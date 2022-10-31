import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import moment from 'moment-timezone';
import { range } from './EventDisplay';
import HourCellDisplay, { getColor } from './HourCellDisplay';
import { getDataModel } from './DataModel';

type TimeDisplayerProps = {
  startDate: string,
  timeZone: string,
  rows: Array<string>,
  cols: Array<string>,
  callback: Dispatch<SetStateAction<boolean>>,
}

// general availability displayer
// uses a listener to update the view every time the user updates their availability
const TimeDisplayer: React.FC<TimeDisplayerProps> = function ({ startDate, timeZone, rows, cols, 
  callback }) {
  const dataModel = getDataModel();
  const [userNum, setUserNum] = useState<number>(dataModel.users.size);
  
  useEffect(() => {
    const listenerId = `${Date.now()}-TimeDisplayer`;
    dataModel.addListener(listenerId, () => {
      setUserNum(dataModel.users.size);
    });

    return () => {
      dataModel.removeListener(listenerId);
    }
  }, []);
  
  return (
    <div className='time-selector'>
      {userNum > 0 && <div className='d-inline-flex w-100 justify-content-center'>
        {`0/${userNum} Available`}
          <div className="w-100 d-inline-flex marginleft marginright" style={{border: "1px solid #ccc", 
          maxWidth: 100}}>
            {range(0, userNum + 1, 1).map(i => 
              <div key={i}
              style={{width: `${100/userNum}%`, backgroundColor:getColor(i, userNum)}}>
              </div>
            )}
          </div>
       {`${userNum}/${userNum} Available`}
      </div>}
      <div className="row">Mouseover the calendar to see who is available</div>
      <Table className='mytable'>
        <Thead>
          <Tr>
            <Th scope="col"></Th>
              {cols.map((i) => <Th key={i} scope="col">{i}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {
            rows.map((row) =>                 
            <Tr key={row}>
              <Th scope="row">{row.split(':')[1].includes("00") && row}</Th>
              {
                cols.map(
                (col, i) => <Td key={`${col}-${row}`} onMouseEnter={() => {
                  callback(false)}}  onMouseLeave={() => {callback(true)}}>
                <HourCellDisplay date={moment(`${startDate} ${row}`, 
                "YYYY-MM-DD h:mm A").add(i, "days").tz(timeZone).format('llll z')} row={row} 
                col={col} /></Td>)
              }
            </Tr>)
          }  
        </Tbody>
      </Table>
  </div>
  )
}

export default TimeDisplayer;
