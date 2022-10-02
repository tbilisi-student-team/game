import React, {useEffect, useState} from 'react';

import { Layout } from '@/components/index';
import ListItem from './ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faTrophy } from '@fortawesome/free-solid-svg-icons';
import type { UserScore } from './types'
import {getAllLeaders} from '../../remoteAPI/leaderboard/getAllLeaders'

const mockResults: UserScore[] = [
  { username: 'Avokado', score: 374 },
  { username: 'Lemon', score: 755 },
  { username: 'Grapefruit', score: 22 },
  { username: 'Pamelo', score: 836 },
  { username: 'Jackfruit', score: 272 },
]

export default function Leaderboard () {
  const [leaders, setLeaders] = useState([])

  useEffect(()=> {
    console.log('REQUEST')
    const data={
      "ratingFieldName": "score",
      "cursor": 0,
      "limit": 100
    }
    getAllLeaders(data).then((res:any) => console.log('res', res)).catch((error: unknown) =>
        console.error('LED error:', error)
)},[])

  const sortedLeaders = mockResults.sort((a, b) => a.score < b.score ? 1 : -1);

  const threadList = sortedLeaders.map(
    (item: UserScore, index: number) => <ListItem key={item.username} data={{ ...item, place: index+1 }}/>
  );

  return (
    <Layout>
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
    </Layout>
  )
}
