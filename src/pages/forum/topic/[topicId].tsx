import React, {useEffect, useState} from 'react';
import {Layout} from "@/components/Layout";
import {Status} from '@/types/index';
import Topic from "@/remoteAPI/forum/types/Topic";
import Comment from "@/remoteAPI/forum/types/Comment";
import {
  createForumCommentToComment,
  CreateForumCommentToCommentRequest,
  createForumCommentToTopic,
  CreateForumCommentToTopicRequest,
  getForumCommentCommentsByParentCommentId,
  getForumTopicByTopicId,
  getForumTopicCommentsByTopicId,
  getForumTopicEmotionsByTopicId,
} from "@/remoteAPI/forum";
import {AxiosError} from "axios";
import {ErrorResponse} from "@/remoteAPI/ErrorResponse";
import {useRouter} from "next/router";
import Emotion from "@/remoteAPI/forum/types/Emotion";
import {Input} from "@/ui/Input";
import { Button } from '@/ui/Button';
import moment from 'moment';
import { faArrowsRotate, faPlus, faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {createForumEmotionToTopic, CreateForumEmotionToTopicRequest} from "@/remoteAPI/forum/createForumEmotionToTopic";

type TopicState = {
  status: Status,
  error: Error | null,
  topic: Topic | null,
};

const INITIAL_TOPIC_STATE: TopicState = {
  status: Status.Pending,
  error: null,
  topic: null,
}

type TopicEmotionsState = {
  status: Status,
  error: Error | null,
  topicEmotions: Emotion[],
  requestData: {
    text: CreateForumEmotionToTopicRequest['text'],
    authorName: CreateForumEmotionToTopicRequest['authorName'],
    TopicId?: CreateForumEmotionToTopicRequest['TopicId'],
  },
}

const INITIAL_TOPIC_EMOTIONS_STATE: TopicEmotionsState = {
  status: Status.Pending,
  error: null,
  topicEmotions: [],
  requestData: {
    text: '',
    authorName: '',
  }
}

type RootCommentsState = {
  status: Status,
  error: Error | null,
  rootComments: Comment[],
  requestData: {
    text: CreateForumCommentToTopicRequest['text'],
    authorName: CreateForumCommentToTopicRequest['authorName'],
    TopicId?: CreateForumCommentToTopicRequest['TopicId'],
  }
}

const INITIAL_ROOT_COMMENTS_STATE: RootCommentsState = {
  status: Status.Pending,
  error: null,
  rootComments: [],
  requestData: {
    text: '',
    authorName: '',
  }
}

type CommentsNodeState = {
  status: Status,
  error: Error | null,
  comments: Comment[] | null,
  requestData: {
    text: CreateForumCommentToCommentRequest['text'],
    authorName: CreateForumCommentToCommentRequest['authorName'],
    ParentCommentId?: CreateForumCommentToCommentRequest['ParentCommentId'],
  }
}

type ParentCommentsWithCommentsMap = Record<Comment['id'], CommentsNodeState>;

type CommentsWithCommentsState = {
  parentCommentsWithCommentsMap: ParentCommentsWithCommentsMap
}

const INITIAL_COMMENTS_WITH_COMMENTS_STATE: CommentsWithCommentsState = {
  parentCommentsWithCommentsMap: {},
};

type EmotionProps = {
  text: Topic['text'],
}

function Emotion (
  {
    text,
  }: EmotionProps
) {
  return (
    <div>
      {text}
    </div>
  )
}

type TopicProps = {
  title: Topic['title'],
  authorName: Topic['authorName'],
  text: Topic['text'],
  updatedAt: Topic['updatedAt'],
}

function Topic (
  {
    title,
    text,
    authorName,
    updatedAt,
  }: TopicProps
) {

  const date = moment(updatedAt).format('D MMM YYYY');
  return (
    <article className="topic-plaque__main">
      <h3>{title}</h3>
      <p className='topic-text'>{text}</p>
      <div className='topic-data__row'>
        <div className="topic-data">{authorName}, </div>
        <div className="topic-data">{date}</div>
      </div>

    </article>
  )
}

type CommentProps = {
  parentCommentExist?: boolean,
  authorName: Comment['authorName'],
  text: Comment['text'],
  updatedAt: Comment['updatedAt'],
  id: Comment['id'],
  parentCommentsWithCommentsMap: ParentCommentsWithCommentsMap
  onGetCommentCommentsByParentCommentId: (parentCommentId: number) => void,
  onCreateCommentToComment?: (parentCommentId: number) => void,
  onSetCommentsWithCommentsRequestDataValue?: (
    parentCommentId: number,
    value: string,
    name: string,
  ) => void,
}

function Comment(
  {
    id,
    text,
    authorName,
    updatedAt,
    parentCommentsWithCommentsMap,
    onGetCommentCommentsByParentCommentId,
    onCreateCommentToComment,
    onSetCommentsWithCommentsRequestDataValue,
  }: CommentProps
) {
  const childCommentsNodeState = parentCommentsWithCommentsMap[id];

  const childComments = !!childCommentsNodeState ? childCommentsNodeState.comments : null;
  const childCommentsLoading = !!childCommentsNodeState ? childCommentsNodeState.status === Status.Pending : false;
  const childCommentsError = !!childCommentsNodeState ? childCommentsNodeState.error : null;

  const requestData = !!childCommentsNodeState ? childCommentsNodeState.requestData : null;

  const requestDataIsValid = !!requestData && !!requestData.text.length && !!requestData.authorName.length;

  const [isInputVisible, setIsInputVisible] = useState(false)

  const date = moment(updatedAt).format('D MMM YYYY');

  return (
    <div className="topic-plaque">
      <div className="topic-child">
        <div className='topic-data__row'>
          <div className="topic-data">{authorName}, </div>
          <div className="topic-data">{date}</div>
        </div>
        <p>{text}</p>
      </div>
      <div className="topic-options">
      <div className="topic-option" onClick={() => setIsInputVisible(!isInputVisible)} > Reply </div>
       <div> | </div>
        <div className="topic-option" onClick={() => !childCommentsLoading && onGetCommentCommentsByParentCommentId(id)} > Get more comments </div>
      </div>
      {/* <Button name='Get more comments' onSubmit={() => onGetCommentCommentsByParentCommentId(id)} disabled={childCommentsLoading} /> */}


      {isInputVisible && (onSetCommentsWithCommentsRequestDataValue && onCreateCommentToComment && requestData) && (
        <form>
          <Input
            label={'Your name'}
            name={'authorName'}
            id={'authorName'}
            placeholder={'Your name'}
            value={requestData.authorName}
            setValue={(value, name) => {
              onSetCommentsWithCommentsRequestDataValue(id, value, name);
            }}
          />

          <Input
            label={'Text'}
            name={'text'}
            id={'text'}
            placeholder={'Text'}
            value={requestData.text}
            setValue={(value, name) => {
              onSetCommentsWithCommentsRequestDataValue(id, value, name);
            }}
          />

          <Button name='Add a child comment' onSubmit={() => onCreateCommentToComment(id)} disabled={!requestDataIsValid} />

        </form>
      )}

      {(!!childComments && !!childComments.length) && childComments.map((childComment) => (
        <div key={childComment.id} style={{ paddingLeft: '20px' }}>
          <Comment
            onCreateCommentToComment={onCreateCommentToComment}
            onSetCommentsWithCommentsRequestDataValue={onSetCommentsWithCommentsRequestDataValue}
            parentCommentExist={true}
            authorName={childComment.authorName}
            text={childComment.text}
            updatedAt={childComment.updatedAt}
            id={childComment.id}
            parentCommentsWithCommentsMap={parentCommentsWithCommentsMap}
            onGetCommentCommentsByParentCommentId={onGetCommentCommentsByParentCommentId}
          />
        </div>
      ))}
    </div>
  )
}

export default function Index() {
  const nextRouter = useRouter();

  const { topicId } = nextRouter.query;

  const [topicState, setTopicState] = useState<TopicState>(INITIAL_TOPIC_STATE);

  useEffect(() => {
    if (typeof topicId === 'string') {
      getForumTopicByTopicId({ topicId: parseInt(topicId, 10) })
        .then((axiosResponse) => {
          if (axiosResponse.status === 200) {
            const topic = axiosResponse.data;

            setTopicState((prev) => {
              return {
                ...prev,
                status: Status.Fulfilled,
                topic,
              }
            });
          } else {
            throw new Error(`${axiosResponse.status}. Unexpected error.`);
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error);

          setTopicState((prev) => {
            return {
              ...prev,
              status: Status.Rejected,
              error,
            };
          });
        })
    }
  }, [topicId])

  const [topicEmotionsState, setTopicEmotionsState] = useState<TopicEmotionsState>(INITIAL_TOPIC_EMOTIONS_STATE);


  useEffect(() => {
    if (typeof topicId === 'string') {
      getForumTopicEmotionsByTopicId({ topicId: parseInt(topicId, 10) })
        .then((axiosResponse) => {
          if (axiosResponse.status === 200) {
            const topicEmotions = axiosResponse.data;

            setTopicEmotionsState((prev) => {
              return {
                ...prev,
                status: Status.Fulfilled,
                topicEmotions,
              }
            });
          } else {
            throw new Error(`${axiosResponse.status}. Unexpected error.`);
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error);

          setTopicEmotionsState((prev) => {
            return {
              ...prev,
              status: Status.Rejected,
              error,
            };
          });
        })
    }
  }, [topicId])

  const handleSetTopicEmotionRequestDataValue = (value: string, name: string) => {
    setTopicEmotionsState((prev) => {
      return {
        ...prev,
        requestData: {
          ...prev.requestData,
          [name]: value,
        },
      };
    });
  }

  const handleCreateEmotionToTopic = () => {
    if (typeof topicId === 'string') {
      setTopicEmotionsState((prev) => {
        return {
          ...prev,
          status: Status.Pending,
          error: null,
        };
      });

      createForumEmotionToTopic(
        {
          ...topicEmotionsState.requestData,
          TopicId: parseInt(topicId, 10),
        }
      )
        .then((axiosResponse) => {
          if (axiosResponse.status === 200) {
            const topicEmotions = axiosResponse.data;

            setTopicEmotionsState((prev) => {
              return {
                ...prev,
                status: Status.Fulfilled,
                topicEmotions,
                requestData: {
                  text: '',
                  authorName: '',
                }
              }
            });
          } else {
            throw new Error(`${axiosResponse.status}. Unexpected error.`);
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error);

          setTopicEmotionsState((prev) => {
            return {
              ...prev,
              status: Status.Rejected,
              error,
            };
          });
        })
    }
  }

  const handleGetEmotions = () => {
    if (typeof topicId === 'string') {
      setTopicEmotionsState((prev) => {
        return {
          ...prev,
          status: Status.Pending,
          error: null,
        }
      });

      getForumTopicEmotionsByTopicId({ topicId: parseInt(topicId, 10) })
        .then((axiosResponse) => {
          if (axiosResponse.status === 200) {
            const topicEmotions = axiosResponse.data;

            setTopicEmotionsState((prev) => {
              return {
                ...prev,
                status: Status.Fulfilled,
                topicEmotions,
              }
            });
          } else {
            throw new Error(`${axiosResponse.status}. Unexpected error.`);
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error);

          setTopicEmotionsState((prev) => {
            return {
              ...prev,
              status: Status.Rejected,
              error,
            };
          });
        })
    }
  }

  const [rootCommentsState, setRootCommentsState] = useState<RootCommentsState>(INITIAL_ROOT_COMMENTS_STATE);

  const handleSetRootCommentsRequestDataValue = (value: string, name: string) => {
    setRootCommentsState((prev) => {
      return {
        ...prev,
        requestData: {
          ...prev.requestData,
          [name]: value,
        }
      }
    });
  }

  const handleCreateCommentToTopic = () => {
    if (typeof topicId === 'string') {
      setRootCommentsState((prev) => {
        return {
          ...prev,
          status: Status.Pending,
          error: null,
        }
      });

      createForumCommentToTopic({
        ...rootCommentsState.requestData,
        TopicId: parseInt(topicId, 10),
      })
        .then((axiosResponse) => {
          if (axiosResponse.status === 200) {
            const { comments, comment } = axiosResponse.data;

            setRootCommentsState((prev) => {
              return {
                ...prev,
                status: Status.Fulfilled,
                rootComments: comments,
                requestData: {
                  authorName: '',
                  text: '',
                }
              }
            });

            handleGetCommentCommentsByParentCommentId(comment.id);
          } else {
            throw new Error(`${axiosResponse.status}. Unexpected error.`);
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error);

          setRootCommentsState((prev) => {
            return {
              ...prev,
              status: Status.Rejected,
              error,
            };
          });
        })
    }
  }

  useEffect(() => {
    if (typeof topicId === 'string') {
      getForumTopicCommentsByTopicId({ topicId: parseInt(topicId, 10) })
        .then((axiosResponse) => {
          if (axiosResponse.status === 200) {
            const comments = axiosResponse.data;

            setRootCommentsState((prev) => {
              return {
                ...prev,
                status: Status.Fulfilled,
                rootComments: comments,
              }
            });

            const parentCommentsWithCommentsMap: ParentCommentsWithCommentsMap = comments.reduce((prev, curr) => {
              return {
                ...prev,
                [curr.id]: {
                  status: Status.Idle,
                  error: null,
                  comments: [],
                  requestData: {
                    text: '',
                    authorName: '',
                  }
                }
              }
            }, {});

            setCommentsWithCommentsState((prev) => {
              return {
                ...prev,
                parentCommentsWithCommentsMap: {
                  ...prev.parentCommentsWithCommentsMap,
                  ...parentCommentsWithCommentsMap,
                }
              }
            })
          } else {
            throw new Error(`${axiosResponse.status}. Unexpected error.`);
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error);

          setRootCommentsState((prev) => {
            return {
              ...prev,
              status: Status.Rejected,
              error,
            };
          });
        })
    }
  }, [topicId])

  const [
    commentsWithCommentsState,
    setCommentsWithCommentsState,
  ] = useState<CommentsWithCommentsState>(INITIAL_COMMENTS_WITH_COMMENTS_STATE);

  const handleSetCommentsWithCommentsRequestDataValue = (parentCommentId: number, value: string, name: string) => {
    setCommentsWithCommentsState((prev) => {
      return {
        ...prev,
        parentCommentsWithCommentsMap: {
          ...prev.parentCommentsWithCommentsMap,
          [parentCommentId]: {
            ...prev.parentCommentsWithCommentsMap[parentCommentId],
            requestData: {
              ...prev.parentCommentsWithCommentsMap[parentCommentId].requestData,
              [name]: value,
            }
          }
        }
      }
    });
  }

  const handleCreateCommentToComment = (parentCommentId: CreateForumCommentToCommentRequest['ParentCommentId']) => {
    if (typeof topicId === 'string') {
      setCommentsWithCommentsState((prev) => {
        return {
          ...prev,
          parentCommentsWithCommentsMap: {
            ...prev.parentCommentsWithCommentsMap,
            [parentCommentId]: {
              ...prev.parentCommentsWithCommentsMap[parentCommentId],
              status: Status.Pending,
              error: null,
            }
          }
        }
      });

      createForumCommentToComment({
        ...commentsWithCommentsState.parentCommentsWithCommentsMap[parentCommentId].requestData,
        ParentCommentId: parentCommentId,
      })
        .then((axiosResponse) => {
          if (axiosResponse.status === 200) {
            const { comments, comment } = axiosResponse.data;

            setCommentsWithCommentsState((prev) => {
              return {
                ...prev,
                parentCommentsWithCommentsMap: {
                  ...prev.parentCommentsWithCommentsMap,
                  [parentCommentId]: {
                    ...prev.parentCommentsWithCommentsMap[parentCommentId],
                    status: Status.Fulfilled,
                    comments,
                    requestData: {
                      text: '',
                      authorName: '',
                    }
                  },
                  [comment.id]: {
                    ...prev.parentCommentsWithCommentsMap[comment.id],
                    status: Status.Fulfilled,
                    requestData: {
                      text: '',
                      authorName: '',
                    }
                  }
                }
              }
            });
          } else {
            throw new Error(`${axiosResponse.status}. Unexpected error.`);
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error);

          setCommentsWithCommentsState((prev) => {
            return {
              ...prev,
              parentCommentsWithCommentsMap: {
                ...prev.parentCommentsWithCommentsMap,
                [parentCommentId]: {
                  ...prev.parentCommentsWithCommentsMap[parentCommentId],
                  status: Status.Rejected,
                  error,
                }
              }
            }
          });
        })
    }
  }

  const handleGetCommentCommentsByParentCommentId = (
    parentCommentId: Comment['id']
  ) => {
    setCommentsWithCommentsState((prev) => {
      return {
        ...prev,
        parentCommentsWithCommentsMap: {
          ...prev.parentCommentsWithCommentsMap,
          [parentCommentId]: {
            ...prev.parentCommentsWithCommentsMap[parentCommentId],
            status: Status.Pending,
            error: null,
          }
        }
      }
    })

    getForumCommentCommentsByParentCommentId({ parentCommentId })
      .then((axiosResponse) => {
        if (axiosResponse.status === 200) {
          const comments = axiosResponse.data;

          const parentCommentsWithCommentsMap: ParentCommentsWithCommentsMap = comments.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.id]: {
                status: Status.Idle,
                error: null,
                comments: [],
                requestData: {
                  text: '',
                  authorName: '',
                }
              }
            }
          }, {});

          setCommentsWithCommentsState((prev) => {
            return {
              ...prev,
              parentCommentsWithCommentsMap: {
                ...prev.parentCommentsWithCommentsMap,
                [parentCommentId]: {
                  ...prev.parentCommentsWithCommentsMap[parentCommentId],
                  status: Status.Fulfilled,
                  comments,
                  requestData: {
                    text: '',
                    authorName: '',
                  }
                },
                ...parentCommentsWithCommentsMap,
              }
            }
          })
        } else {
          throw new Error(`${axiosResponse.status}. Unexpected error.`);
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error);

        setCommentsWithCommentsState((prev) => {
          return {
            ...prev,
            parentCommentsWithCommentsMap: {
              ...prev.parentCommentsWithCommentsMap,
              [parentCommentId]: {
                ...prev.parentCommentsWithCommentsMap[parentCommentId],
                status: Status.Rejected,
                error,
              }
            }
          }
        })
      })
  }

  const topicEmotionRequestDataIsValid =
    !!topicEmotionsState.requestData.text.length
    && topicEmotionsState.requestData.authorName.length;

  const rootCommentsRequestDataIsValid =
    !!rootCommentsState.requestData.text.length
    && rootCommentsState.requestData.authorName.length;

  return (
    <Layout heading={''} subheading={''}>
      <div>
      <div className="topic-plaque">
        {!!topicState.topic && (
          <div>
            <Topic
              text={topicState.topic.text}
              title={topicState.topic.title}
              authorName={topicState.topic.authorName}
              updatedAt={topicState.topic.updatedAt}
            />
          </div>
        )}

        <div>
          <div className="emotions-header">
            {topicEmotionsState.topicEmotions.length > 0 && <div>Emotions:</div>}
            <div className='emotions-options'>
              <FontAwesomeIcon icon={faArrowsRotate} className='icon emotions-icon' onClick={handleGetEmotions} />
            </div>
          </div>


          {(!!topicEmotionsState.topicEmotions && !!topicEmotionsState.topicEmotions.length) && (
            <div className='emotion-tags'>{topicEmotionsState.topicEmotions.map((topicEmotion) => (
                  <div className='emotion-tag' key={topicEmotion.id}>
                    <Emotion text={topicEmotion.text}/>
                  </div>
                ))}
            </div>
          )}
        </div>

        <form>
          <Input
            label={'Your name'}
            name={'authorName'}
            id={'authorName'}
            placeholder={'Author name'}
            value={topicEmotionsState.requestData.authorName}
            setValue={handleSetTopicEmotionRequestDataValue}
          />
          <Input
            label={'Your emotion'}
            name={'text'}
            id={'text'}
            placeholder={'Text'}
            value={topicEmotionsState.requestData.text}
            setValue={handleSetTopicEmotionRequestDataValue}
          />

          <Button name='Add emotion to topic' onSubmit={handleCreateEmotionToTopic} disabled={!topicEmotionRequestDataIsValid} />

        </form>

      </div>


      <div className="topic-plaque">

          { (!!rootCommentsState.rootComments && !!rootCommentsState.rootComments.length) && (
            <ul>
              {rootCommentsState.rootComments.map((rootComment) => (
                <li key={rootComment.id}>
                  <Comment
                    onSetCommentsWithCommentsRequestDataValue={handleSetCommentsWithCommentsRequestDataValue}
                    onCreateCommentToComment={handleCreateCommentToComment}
                    authorName={rootComment.authorName}
                    text={rootComment.text}
                    updatedAt={rootComment.updatedAt}
                    id={rootComment.id}
                    onGetCommentCommentsByParentCommentId={handleGetCommentCommentsByParentCommentId}
                    parentCommentsWithCommentsMap={
                      commentsWithCommentsState
                        .parentCommentsWithCommentsMap
                    }
                  />
                </li>
              ))}
            </ul>
          )}

            <h3>Add a comment to a topic:</h3>

            <form>
              <Input
                  label={'Your name'}
                  name={'authorName'}
                  id={'authorName'}
                  placeholder={'Author name'}
                  value={rootCommentsState.requestData.authorName}
                  setValue={handleSetRootCommentsRequestDataValue}
                />
              <Input
                label={'Text'}
                name={'text'}
                id={'text'}
                placeholder={'Text'}
                value={rootCommentsState.requestData.text}
                setValue={handleSetRootCommentsRequestDataValue}
              />

              <Button name='Add a comment to a topic' onSubmit={handleCreateCommentToTopic} disabled={!rootCommentsRequestDataIsValid} />

            </form>

      </div>

      </div>

    </Layout>
  );
};
