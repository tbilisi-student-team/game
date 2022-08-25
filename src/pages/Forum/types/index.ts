// export {Type} from './Type';
export type ThreadListItem = {
    id: number;
    title: string;
    text: string;
    datatime: string;
    userName: string;
    comments: number;
  };
  export type ThreadListData = ThreadListItem[];