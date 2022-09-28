import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import { ThreadTableRow } from '../../types';

type TableRowProps = PropsWithChildren<{
  data: ThreadTableRow;
}>;

export default function TableRow(props: TableRowProps) {
  const { id, title, text, datatime, userName, comments } = props.data;

  return (
    <tr key={id} className='theme' >
      <td className='table-cell'>
        <h3 className='theme-title'>
          <Link href={'#'} className='header-link'>{title}</Link>
        </h3>
        <p>{text}</p>
      </td>
      <td className='table-cell'>{datatime}</td>
      <td className='table-cell'>{userName}</td>
      <td className='table-cell'>{comments}</td>
    </tr>
  );
}
