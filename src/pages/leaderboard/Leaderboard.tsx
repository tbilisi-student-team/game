import React from 'react';
import { ListItem } from './ListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faDumbbell, faTrophy } from '@fortawesome/free-solid-svg-icons';
import type { UserScore } from './types/index'

const mockResults: UserScore[] = [
  { username: 'Avokado', score: 374 },
  { username: 'Lemon', score: 755 },
  { username: 'Grapefruit', score: 22 },
  { username: 'Pamelo', score: 836 },
  { username: 'Jackfruit', score: 272 },
]
 
export default function Leaderboard () {

  const sortedLeaders = mockResults.sort((a, b) => a.score < b.score ? 1 : -1);

  const threadList = sortedLeaders.map(
    (item: UserScore, index: number) => <ListItem key={item.username} data={{ ...item, place: index+1 }}/>
  );

  return (
    <table className='leaderboard-table'>
    <thead>
      <tr className='table-header'>
        <th className='forum-table-header-cell'><FontAwesomeIcon icon={faTrophy} /></th>
        <th className='forum-table-header-cell'>User Name</th>
        <th className='forum-table-header-cell'><FontAwesomeIcon icon={faDumbbell} /></th>
      </tr>
    </thead>
    <tbody>{threadList}</tbody>
    </table>
  )
}
