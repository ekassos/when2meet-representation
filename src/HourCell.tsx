import { useState } from 'react';
import classNames from "classnames";
import { getDataModel } from './DataModel';

type HourCellProps =  {
  row: string,
  col: string,
  user: string,
  select: boolean,
}

// hour block initialization
const HourCell: React.FC<HourCellProps> = function ({row, col, user, select}){
  const [selected, setSelected] = useState(select);
  const dataModel = getDataModel();
  
  return (
    <div className={classNames(selected ? 'selected' : 'unselected', 'cell')} 
    onClick={() => {
      setSelected(!selected);
      if (!selected) {
        dataModel.addItem(`${col}-${row}`, user);
      } else {
        dataModel.deleteItem(`${col}-${row}`, user);
      }
    }}>
    </div>
  )
}

export default HourCell;