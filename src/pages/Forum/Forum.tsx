import React from 'react';
import { ListItem } from './ListItem/ListItem';
import { ThreadListData } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons'


import Header from '../../UI/Header';

const threadData: ThreadListData = [
  {
    id: 1,
    title: 'Помогаем юзерам выбирать ПК конфигурации и обсуждаем их',
    text: 'Не долго думая создаю&nbsp;тему для общих благ&nbsp;(надеюсь полезную) где будем обсуждать ПК конфигурации. Предлагаю &quot;страждущим&quot; сделать апгрейд или&nbsp;купить новый компьютер кидать сю',
    datatime: '21:28, 25.07.2011',
    userName: 'zenzuk',
    comments: 200,
  },
  {
    id: 2,
    title: 'Всё о компьютерном разгоне (PC Overclocking - OC)',
    text: 'Начнём, надеюсь будет ПОЛЕЗНОЙ инфой!&nbsp;&nbsp; Всё о компьютерном разгоне (PC Overclocking - OC) Небольшой, скромный о разгоне &nbsp; &nbsp; Базовые понятия: &nbsp; 1. Q:Что такое разгон? От чего',
    datatime: '21:28, 25.07.2011',
    userName: 'zenzuk',
    comments: 33,
  },
  {
    id: 3,
    title: 'Выбираем, обсуждаем, покупаем игр.мышки',
    text: 'Так как тема была создана немногим раньше (получил бан за рекламу, ХЗ почему, ну пусть будет, это крайнее) пере-создаю её ещё разок, теперь без рекламы, картинок, и без описании мышек. ДАВАЙТЕ-КА буде',
    datatime: '21:28, 25.07.2011',
    userName: 'zenzuk',
    comments: 17,
  },
];

const threadList = threadData.map((item: any) => <ListItem data={item} />);

export const Forum= () => {

  const createPostHandle = () => {
    console.log('new post');
  };

  return (
    <div className='wrapper'>
      <Header/>
      <div className='main'>
        <div className='title-wrapper'>
          <h1>Форум</h1>
        </div>
        <div className='forum'>
          <table className='forum-table'>
            <thead>
              <tr className='table-header'>
                <th>Тема</th>
                <th><FontAwesomeIcon icon={faCalendarDays} /></th>
                <th><FontAwesomeIcon icon={faUser} /></th>
                <th><FontAwesomeIcon icon={faMessage} /></th>
              </tr>
            </thead>
            <tbody>{threadList}</tbody>
          </table>
          <button
            onClick={createPostHandle}
            className='button'
            type='button'
          ><span className='button-title'>
        Добавить тему
            </span></button>
        </div>

      </div>
    </div>
   
  );
};
