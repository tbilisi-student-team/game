import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUser, faPlus } from '@fortawesome/free-solid-svg-icons'
import {Layout} from "@/components/Layout";
import Link from "next/link";
import {RoutePaths, Status} from '@/types/index';
import Topic from "@/remoteAPI/forum/types/Topic";
import {getForumTopics} from "@/remoteAPI/forum";
import {AxiosError} from "axios";
import {ErrorResponse} from "@/remoteAPI/ErrorResponse";
import {useSession} from "next-auth/react";
import {useAppContext} from "@/appContext/AppContext";

type State = {
  status: Status,
  error: Error | null,
  topics: Topic[],
};

const INITIAL_STATE: State = {
  status: Status.Pending,
  error: null,
  topics: [],
}

export default function Forum() {
  const { data: session, status } = useSession()
  const {
    currentUser: [ currentUserState, actions ]
  } = useAppContext();

  const { data, isLoading } = currentUserState;

  const [state, setState] = useState<State>(INITIAL_STATE);

  useEffect(() => {
    getForumTopics()
      .then((axiosResponse) => {
        if (axiosResponse.status === 200) {
          const topics = axiosResponse.data;

          setState((prev) => {
            return {
              ...prev,
              status: Status.Fulfilled,
              topics,
            };
          });
        } else {
          throw new Error(`${axiosResponse.status}. Unexpected error.`);
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error);

        setState((prev) => {
          return {
            ...prev,
            status: Status.Rejected,
            error,
          }
        })
      })
  }, [])

  if (status === "loading" || isLoading) {
    return <Layout heading={'Loading...'} subheading={''}/>
  }

  if (status === "unauthenticated" && !data) {
    return <Layout heading={'Access denied'} subheading={''}/>
  }

  return (
    <Layout heading={'Forum'}>
      <div className='forum'>
        <Link href={`${RoutePaths.Forum}/create/topic`}>
          <a className='table-body__data-link'>
            <FontAwesomeIcon icon={faPlus} className="icon"/>
            Create topic
          </a>
        </Link>
        <table className='forum-table'>
          <thead className={'table-head'}>
            <tr className='table-head__row'>
              <th className='table-head__cell'>Topic</th>
              <th className='table-head__cell'><FontAwesomeIcon icon={faCalendarDays} /></th>
              <th className='table-head__cell'><FontAwesomeIcon icon={faUser} /></th>
            </tr>
          </thead>
          <tbody className={'table-body'}>
          {state.topics.map((topic) => (
            <tr
              key={topic.id}
              className={'table-body__row theme'}
            >
              <td className='table-body__data'>
              <Link href={`${RoutePaths.Forum}/topic/${topic.id}`}>
                <a className='table-body__data-link'>
                  <div className={'table-body__data-heading'}>
                    {topic.title}
                  </div>
                </a>
              </Link>

                <p className={'table-body__data-text'}>
                  {topic.text}
                </p>
              </td>
              <td className='table-body__data'>
                {topic.updatedAt}
              </td>
              <td className='table-body__data'>
                {topic.authorName}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
