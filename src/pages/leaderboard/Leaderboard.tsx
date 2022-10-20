import React, { useEffect } from 'react';

import { useSelector } from 'react-redux'

import { Layout } from '@/components/index';
import ListItem from './ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { fetchTeamLeadersData, Leader, selectLeaderboardData} from '@/reduxStore/slices';
import { reduxStore } from '@/reduxStore/reduxStore';

export default function Leaderboard () {
  const leaderboard = useSelector(selectLeaderboardData);

  console.log(leaderboard);

  useEffect(() => {
    reduxStore.dispatch(fetchTeamLeadersData());
  }, []);

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
        <tbody>{leaderboard && leaderboard.map(
          (leader: Leader, index: number) => <ListItem key={leader.data.id} data={{ ...leader.data, place: index + 1 }}/>
        )}</tbody>
      </table>
    </Layout>
  )
}
