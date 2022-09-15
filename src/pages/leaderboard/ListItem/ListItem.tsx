
import React, { PropsWithChildren } from 'react';
import type { UserScore } from '../types/index'


type ListItemProps = PropsWithChildren<{
  data: UserScore;
}>;

export const ListItem = (props: ListItemProps) => {

  return (
    <tr key={props.data.username} className='theme' >
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
