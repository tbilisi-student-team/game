import React, {useEffect, useState} from 'react';

import {useSelector} from 'react-redux'

import { Layout } from '@/components/index';
import ListItem from './ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faTrophy } from '@fortawesome/free-solid-svg-icons';
import type { UserScore } from './types'


export default function Leaderboard () {
  const leaderboard = useSelector(state => (state as any).leaderboard)

  const [sortedLeaders, setSortedLeaders] = useState([])

  useEffect(() => {
    if(leaderboard.data !== null) {
      setSortedLeaders(leaderboard.data.sort((a: UserScore, b: UserScore) => a.data!.score < b.data!.score ? 1 : -1))
    }

  }, [leaderboard])

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
        <tbody>{sortedLeaders.map(
        (item: UserScore, index: number) => <ListItem key={item.data?.username} data={{ ...item.data, place: index+1 }}/>
      )}</tbody>
      </table>
    </Layout>
  )
}