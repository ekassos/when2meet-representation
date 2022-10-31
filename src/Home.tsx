import { useState, useCallback } from "react";
import {
  Link
} from "react-router-dom";
import moment from 'moment-timezone';
import { DEFAULT_INPUT } from "./App";
import { EventProps } from "./EventDisplay";

type AppRouterProps =  {
  groupId: string,
  callback: (params:EventProps) => void,
}

// homepage with controls on event name, timezone, dates and times.
const Home:React.FC<AppRouterProps> = function({groupId, callback}) {
  const [eventName, setEventName] = useState(DEFAULT_INPUT.eventName);
  const [timeZone, setTimeZone] = useState(DEFAULT_INPUT.timeZone);
  const [startDate, setStartDate] = useState(DEFAULT_INPUT.startDate);
  const [numDays, setNumDays] = useState(DEFAULT_INPUT.numDays);
  const [startTime, setStartTime] = useState(DEFAULT_INPUT.startTime);
  const [endTime, setEndTime] = useState(DEFAULT_INPUT.endTime);

  const handleClick = useCallback((eventName, timeZone, startDate, numDays, startTime, endTime) => {
    callback({eventName:eventName, timeZone:timeZone, startDate:startDate, numDays:numDays, 
      startTime:startTime, endTime:endTime});
  }, [callback]);

  return (
      <div id="Home">
        <form className="form-inline row">
          <div className="col-md-2">
            <label htmlFor="event-name">Event name:</label>
            <input className="form-control" type="text" id="event-name" 
            value={eventName} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => 
            setEventName(ev.target.value)}></input>
          </div>
          <div className="col-md-3">
            <label htmlFor="timezone">Time zone:</label>
            <select className="form-control" id="timezone" value={timeZone}
            onChange={(ev) => setTimeZone(ev.target.value)}>
              {moment.tz.names().map((item) => 
                <option key={item} value={item}>{item}</option>)
              }
            </select>
          </div>
          <div className="col-md-2">
            <label htmlFor="startday">Start date:</label>
            <input className="form-control" type="date" id="startday" 
            value={startDate}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => 
            setStartDate(ev.target.value)}></input>
          </div>
          <div className="col-md-1">
            <label htmlFor="numday">Days:</label>
            <input className="form-control" min="1" max="7" type="number" id="numday" 
            value={numDays} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => 
            setNumDays(parseInt(ev.target.value))}></input>
          </div> 
          <div className="col-md-2">
            <label htmlFor="starttime">Start time:</label>
            <input className="form-control" type="number" id="starttime" min="0" max="23"
            value={startTime} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => 
            setStartTime(parseInt(ev.target.value))}></input>
          </div>  
          <div className="col-md-2">
            <label htmlFor="endtime">End time:</label>
            <input className="form-control" type="number" id="endtime" min="0" max="24"
            value={endTime} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => 
            setEndTime(parseInt(ev.target.value))}></input>
          </div>  
          <div className="d-grid linkcontainer">
            <Link to={`/event/${groupId}`} className="btn btn-primary btn-block" onClick={() => 
            handleClick(eventName, timeZone, startDate, numDays, startTime, endTime)}>Create event</Link>
          </div>
        </form>
        </div>
  );
}

export default Home;
