import { render } from 'react-dom';
import { getDataModel } from './DataModel';
import { useEffect, useState } from 'react';

type HourCellDisplayProps =  {
  date: string,
  row: string,
  col: string
}

const START_COLOR ={ r: 255, g: 255, b: 255 }

const END_COLOR = { r: 26, g: 106, b: 2 }

const DIFF_COLOR = {
  r: END_COLOR.r - START_COLOR.r,
  g: END_COLOR.g - START_COLOR.g,
  b: END_COLOR.b - START_COLOR.b,
}

export const getColor = function(count: number, userNum:number) {
  const percent = count / userNum;
  return `rgb(${Math.round(START_COLOR.r + percent*DIFF_COLOR.r)}, ${Math.round(START_COLOR.g + 
    percent*DIFF_COLOR.g)}, ${Math.round(START_COLOR.b + percent*DIFF_COLOR.b)})`;
}

// hour block effect: add or remove from user's availability
const HourCellDisplay: React.FC<HourCellDisplayProps> = function ({date, row, col}){
  const dataModel = getDataModel();
  const [available, setAvailable] = useState<Set<string>>(dataModel.map.get(`${col}-${row}`)!);
  const [users, setUsers] = useState<Set<string>>(dataModel.users);
  const [color, setColor] = useState<string>(getColor(available!.size, users.size));
  
  useEffect(() => {
    const listenerId = `${Date.now()}-${col}-${row}`;
    dataModel.addListener(listenerId, () => {
      setAvailable(dataModel.map.get(`${col}-${row}`)!);
      setUsers(dataModel.users);
      setColor(getColor(dataModel.map.get(`${col}-${row}`)!.size, dataModel.users.size));
    });

    return () => {
      dataModel.removeListener(listenerId);
    }
  }, []);

  return (
    <div className="cellDisplay" style={{backgroundColor:color}}
    onMouseEnter={() => {
      if(document.getElementById('placeholder'))
        render(<><h2>{date}</h2>
        <div className='row justify-content-center'>
          <div className='col-md-4'>
            Available
            {Array.from(available!.values()).map(i => <div key={i}>{i}</div>)}
          </div>
          <div className='col-md-4'>
            Unavailable
            {Array.from(users.values()).filter(x => !available!.has(x)).map(i => <div key={i}>
              {i}</div>)}
          </div>
        </div>
        </>, document.getElementById('placeholder'));
    }}>
    </div>
  )
}

export default HourCellDisplay;