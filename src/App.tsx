import { useState } from "react";
import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom";
import EventDisplay from "./EventDisplay";
import Home from "./Home";
import moment from "moment";
import { EventProps } from "./EventDisplay";
import { v4 } from 'uuid';

export const DEFAULT_INPUT = {
  eventName: 'Add your event name here',
  timeZone: 'America/New_York',
  startDate: moment(new Date()).format('YYYY-MM-DD'),
  numDays: 3,
  startTime: 9,
  endTime: 17
}

function App () {
  const [eventParams, setEventParams] = useState(DEFAULT_INPUT);
  const groupId = v4();
  let { eventName, timeZone, startDate, numDays, startTime, endTime } = eventParams;

  return (
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<Home groupId={groupId} 
        callback={(params:EventProps) => setEventParams(params)}/>}/>
        <Route path="/event/:groupId" element={<EventDisplay eventName={eventName} 
        timeZone={timeZone} startDate={startDate} numDays={numDays} startTime={startTime} endTime={endTime}/>}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
