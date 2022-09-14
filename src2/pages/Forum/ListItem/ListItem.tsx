
import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { ThreadListItem } from '../types';


type ListItemProps = PropsWithChildren<{
  data: ThreadListItem;
}>;

export const ListItem = (props: ListItemProps) => {
  const { id, title, text, datatime, userName, comments } = props.data;

  return (
    <tr key={id} className='theme' >
      <td className='table-cell'>
        <h3 className='theme-title'>
          <Link to={`${id}`} className='header-link'>{title}</Link>
        </h3>
        <p>{text}</p>
      </td>
      <td className='table-cell'>{datatime}</td>
      <td className='table-cell'>{userName}</td>
      <td className='table-cell'>{comments}</td>
    </tr>
  );
};
