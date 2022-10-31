import HourCell from './HourCell';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { getDataModel } from './DataModel';

type TimeSelectorProps = {
  user: string,
  rows: Array<string>,
  cols: Array<string>
}

// time availability selector (left pane)
const TimeSelector: React.FC<TimeSelectorProps> = function ({ user, rows, cols}) {
  const dataModel = getDataModel();
  const countMap = new Map<string, Set<string>>(dataModel.map);

  return (
    <div className='time-selector'>
      <div className='d-inline-flex'>
        Unavailable
        <div className="cellDisplay unselected marginleft"></div>
        <div className="cellDisplay selected marginright"></div>
        Available
      </div>
      <div className="row">Click calendar cells to toggle</div>
      <Table>
        <Thead>
          <Tr>
            <Th scope="col"></Th>
            {cols.map(
              (i) => <Th key={i} scope="col">{i}</Th>)
            }
          </Tr>
        </Thead>
        <Tbody>
          {
            rows.map((row) =>                 
            <Tr key={row}>
              <Th scope="row">{row.split(':')[1].includes("00") && row}</Th>
              {
                cols.map(
                (col) => <Td key={`${col}-${row}`}><HourCell row={row} col={col} user={user} select={
                  countMap.get(`${col}-${row}`)!.has(user)
                }/></Td>)
              }
            </Tr>)
          }  
        </Tbody>
      </Table>
    </div>
  )
}

export default TimeSelector;