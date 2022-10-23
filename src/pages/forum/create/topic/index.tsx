import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons'
import {Layout} from "@/components/Layout";
import Link from "next/link";
import {RoutePaths, Status} from '@/types/index';
import Topic from "@/remoteAPI/forum/types/Topic";
import {getForumTopics} from "@/remoteAPI/forum";
import {AxiosError} from "axios";
import {ErrorResponse} from "@/remoteAPI/ErrorResponse";
import {createForumTopic, CreateForumTopicRequest} from "@/remoteAPI/forum";
import {useAppContext} from "@/appContext/AppContext";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Input} from "@/ui/Input";

type State = {
  status: Status,
  error: Error | null,
  requestData: CreateForumTopicRequest,
};

const INITIAL_STATE: State = {
  status: Status.Idle,
  error: null,
  requestData: {
    title: '',
    text: '',
    authorName: '',
  }
}

export default function Index() {
  const nextRouter = useRouter();

  const [state, setState] = useState<State>(INITIAL_STATE);

  const handleSetValue = (value: string, name: string) => {
    setState((prev) => {
      return {
        ...prev,
        requestData: {
          ...prev.requestData,
          [name]: value,
        }
      };
    });
  }

  const handleCreateForumTopic = () => {
    setState((prev) => {
      return {
        ...prev,
        status: Status.Pending,
        error: null,
      };
    });

    createForumTopic(state.requestData)
      .then((axiosResponse) => {
        if (axiosResponse.status === 200) {
          const topic = axiosResponse.data;

          nextRouter.push(`${RoutePaths.Forum}/topic/${topic.id}`);
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
          };
        });
      })
  }

  const requestDataIsValid =
    !!state.requestData.text.length
    && !!state.requestData.title.length
    && !!state.requestData.authorName.length;

  return (
    <Layout heading={'Forum'}>
      <form>
        <Input
          label={'Title'}
          name={'title'}
          id={'title'}
          placeholder={'Title'}
          value={state.requestData.title}
          setValue={handleSetValue}
        />

        <Input
          label={'Text'}
          name={'text'}
          id={'text'}
          placeholder={'Text'}
          value={state.requestData.text}
          setValue={handleSetValue}
        />

        <Input
          label={'Author name'}
          name={'authorName'}
          id={'authorName'}
          placeholder={'Author name'}
          value={state.requestData.authorName}
          setValue={handleSetValue}
        />

        <button
          onClick={handleCreateForumTopic}
          className={'button'}
          type={'button'}
          disabled={!requestDataIsValid}
        >
          <span className={'button-title'}>
            Create new topic
          </span>
        </button>
      </form>
    </Layout>
  );
};
