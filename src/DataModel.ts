import { initializeApp } from '@firebase/app';
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc
} from "@firebase/firestore";

// set parameters from Firebase, if you would like to create your own instance, change these
const firebaseConfig = {
  apiKey: "AIzaSyDS1aJhybEfv51gVBKVScXlBqUnrOjBTPo",
  authDomain: "when2mee.firebaseapp.com",
  projectId: "when2mee",
  storageBucket: "when2mee.appspot.com",
  messagingSenderId: "660393063239",
  appId: "1:660393063239:web:0b9a3ed33f3a19e4b0d262"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type listenerType = {
  id: string,
  callback: () => void
}
  
class DataModel {
  groupId: string;
  map: Map<string, Set<string>>;
  mapListener: Array<listenerType>;
  users: Set<string>;

  constructor(groupId:string, rows:Array<string>, cols:Array<string>) {
    this.groupId = groupId;
    this.map = new Map<string, Set<string>>();
    for (const row of rows) {
      for (const col of cols) {
        this.map.set(`${col}-${row}`, new Set<string>());
      }
    } 
    this.mapListener = [];
    this.users = new Set<string>();
  }

  // get all users that have submitted availabilities
  async fetchUsers() {
    const docRef = doc(db, "Users", this.groupId);
    const docSnap  = await getDoc(docRef);
    if (docSnap.exists()){ 
      this.users = new Set<string>(docSnap.data().users);
    }
  }

  // a new user is adding their availability
  updateUsers(newUser: string) {
    this.users.add(newUser);
    const docRef = doc(db, "Users", this.groupId);
    setDoc(docRef, {"users": Array.from(this.users)});
    this.notifyListener();
  }

  // get event data
  async fetchData() {
    const docRef = doc(db, "Events", this.groupId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()){ 
      const data = docSnap.data();
      for (const key in data) {
        this.map.set(key, new Set<string>(data[key]));
      }
      this.notifyListener();
    }
  }

  // add new availability block 
  async addItem(key:string, newUser:string) {
    let currentSet = this.map.get(key);
    currentSet!.add(newUser);
    this.map.set(key, currentSet!);
    this.notifyListener();

    const docRef = doc(db, `Events`, `${this.groupId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      updateDoc(docRef, {[key]: Array.from(currentSet!)}); 
    } else {
      setDoc(docRef, {[key]: Array.from(currentSet!)})
    }
  }

  // remove availability block
  deleteItem(key:string, newUser:string) {
    let currentSet = this.map.get(key);
    currentSet!.delete(newUser);
    this.map.set(key, currentSet!);
    this.notifyListener();

    const docRef = doc(db, `Events`, `${this.groupId}`);
    updateDoc(docRef, {[key]: Array.from(currentSet!)});
  }
  
  addListener(id:string, callbackFunction:() => void) {
    const listener = {
      id: id,
      callback: callbackFunction
    }
    this.mapListener.push(listener);
    callbackFunction();
  }

  removeListener(listenerId:string) {
    let idx = this.mapListener.findIndex((elem:listenerType) => elem.id === listenerId);
    this.mapListener.splice(idx, 1);
  }

  notifyListener() {
    for (const tl of this.mapListener) {
      tl.callback();
    }
  }
}

let dataModel:DataModel | undefined = undefined;

export function getDataModel(groupId?:string, rows?:Array<string>, cols?:Array<string>) {
  if (!dataModel) {
    dataModel = new DataModel(groupId!, rows!, cols!);
  }
  return dataModel;
}

export function resetDataModel() {
  dataModel = undefined;
}
