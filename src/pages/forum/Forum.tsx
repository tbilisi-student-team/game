import React from 'react';
import TableRow from './ui';
import { ThreadTBodyData } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons'
import {Layout} from "@/components/Layout";

const threadTBodyData: ThreadTBodyData = [
  {
    id: 1,
    title: 'How to play the game',
    text: 'Here we discuss the rules of Pew game and game mechanics. If someone has questions - welcome to this there',
    datatime: '21:28, 25.07.2011',
    userName: 'zenzuk',
    comments: 200,
  },
  {
    id: 2,
    title: 'Looking for a companion to play',
    text: 'Let`s find new friends and companions to play Pew. Please add your name here if you are free to play and indicate time you want to play',
    datatime: '21:28, 25.07.2011',
    userName: 'grgr',
    comments: 33,
  },
  {
    id: 3,
    title: 'New ideas for game development',
    text: 'Leave your ideas here and we probably implement them in our game',
    datatime: '21:28, 25.07.2011',
    userName: 'ivan1234',
    comments: 17,
  },
];

export default function Forum() {
  const createPostHandle = () => {
    console.log('new post');
  };

  return (
    <Layout heading={'Forum'}>
      <div className='forum'>
        <table className='forum-table'>
          <thead>
          <tr className='table-header'>
            <th className='forum-table-header-cell'>Theme</th>
            <th className='forum-table-header-cell'><FontAwesomeIcon icon={faCalendarDays} /></th>
            <th className='forum-table-header-cell'><FontAwesomeIcon icon={faUser} /></th>
            <th className='forum-table-header-cell'><FontAwesomeIcon icon={faMessage} /></th>
          </tr>
          </thead>
          <tbody>
          {threadTBodyData.map((item) => (
            <TableRow key={item.id} data={item} />
          ))}
          </tbody>
        </table>
        <button
          onClick={createPostHandle}
          className='button'
          type='button'
        >
          <span className='button-title'>
            Add a new theme
          </span>
        </button>
      </div>
    </Layout>
  );
};
