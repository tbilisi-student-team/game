import React, {useState} from 'react';
import {Layout} from "@/components/Layout";
import {RoutePaths, Status} from '@/types/index';
import {AxiosError} from "axios";
import {ErrorResponse} from "@/remoteAPI/ErrorResponse";
import {createForumTopic, CreateForumTopicRequest} from "@/remoteAPI/forum";
import {useRouter} from "next/router";
import {Input} from "@/ui/Input";
import { Button } from '@/ui/Button';
import {useSession} from "next-auth/react";
import {useAppContext} from "@/appContext/AppContext";
import {GlobalServerSideProps} from "@/utils/getServerSideProps";


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

export default function Index(props: GlobalServerSideProps) {
  const { data: session, status } = useSession();
  const {
    currentUser: [ currentUserState, actions ]
  } = useAppContext();

  const { data, isLoading } = currentUserState;

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

  if (status === "loading" || isLoading) {
    return <Layout theme={props.theme} heading={'Loading...'} subheading={''}/>
  }

  if (status === "unauthenticated" && !data) {
    return <Layout theme={props.theme} heading={'Access denied'} subheading={''}/>
  }

  return (
    <Layout theme={props.theme} heading={'Forum'}>
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

        <Button name='Create new topic' onSubmit={handleCreateForumTopic} disabled={!requestDataIsValid} />
      </form>
    </Layout>
  );
};

export { getServerSideProps } from '@/utils/getServerSideProps';
