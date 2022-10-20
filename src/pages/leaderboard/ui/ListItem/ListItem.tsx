import React from 'react';
import { LeaderData } from '@/reduxStore/slices';


export default function ListItem (props: {data: LeaderData & {place: number}}) {
  return (
    <tr key={props.data.id} className='theme' >
      <td className='table-cell centered'>
        <p>{props.data.place}</p>
      </td>
      <td className='table-cell'>
        <p className='theme-title'>
          {props.data.username}
        </p>
      </td>
      <td className='table-cell centered'>
        <p>{props.data.score}</p>
      </td>
    </tr>
  );
};
