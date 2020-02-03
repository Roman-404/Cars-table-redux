import React, { Fragment } from 'react';
import { TableRow, TableCell, Link, CircularProgress } from '@material-ui/core';

const TableItem = ({ car, onItemClick }) => {
  const { model, brand, grade, vin, dealer } = car;
  const { name, email } = dealer === undefined ? {} : dealer

  return (
    <Fragment>
        <TableRow hover role="checkbox" tabIndex={-1} onClick={() => onItemClick(car)}>
            <TableCell component="th" scope="row">
                {brand}
            </TableCell>
                <TableCell align="center" style={{minWidth: 50}}>{model}</TableCell>
                <TableCell align="center" style={{minWidth: 50}}>{grade}</TableCell>
                <TableCell align="center" style={{minWidth: 100}}>{vin}</TableCell>
                   {dealer == null ? 
                <TableCell align="right" style={{minWidth: 100}}><CircularProgress color="secondary"/></TableCell>
                :
                <TableCell align="right" style={{minWidth: 100}}>
                  {name.match(/_$/ig) ? name.slice(0,-1): name}<br/>
                   <Link href={email}>
                        {email}
                   </Link>                   
                </TableCell>}
        </TableRow>
    </Fragment>
  );
};

export default TableItem;