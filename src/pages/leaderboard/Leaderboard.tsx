import React, { useEffect } from 'react';

import { useSelector } from 'react-redux'

import { Layout } from '@/components/index';
import ListItem from '../../components/leaderboard/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { fetchTeamLeadersData, Leader, selectLeaderboardData} from '@/reduxStore/slices';
import { reduxStore } from '@/reduxStore/reduxStore';
import {GlobalServerSideProps} from "@/utils/getServerSideProps";

export default function Leaderboard (props: GlobalServerSideProps) {
  const leaderboard = useSelector(selectLeaderboardData);

  console.log(leaderboard);

  useEffect(() => {
    reduxStore.dispatch(fetchTeamLeadersData());
  }, []);

  return (
    <Layout theme={props.theme}>
      <table className='leaderboard-table'>
        <thead>
        <tr className='table-head__row'>
          <th className='table-head__cell'><FontAwesomeIcon icon={faTrophy} /></th>
          <th className='table-head__cell'>User Name</th>
          <th className='table-head__cell'><FontAwesomeIcon icon={faDumbbell} /></th>
        </tr>
        </thead>
        <tbody>{leaderboard && leaderboard.map(
          (leader: Leader, index: number) => <ListItem key={leader.data.id} data={{ ...leader.data, place: index + 1 }}/>
        )}</tbody>
      </table>
    </Layout>
  )
}
