import React, { useState, useCallback } from 'react'
import { Button } from '../../UI/Button'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../UI/Header'
import { Input } from '../../UI/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

type User = {
  id: number,
  display_name: string,
  first_name: string,
  second_name: string,
  login: string,
  email: string,
  phone: string,
  avatar: string
}

type Users = User[]


// stub users object:
const users = [ 
  {
    'id': 123,
    'first_name': 'Petya',
    'second_name': 'Pupkin',
    'display_name': 'Petya Pupkin',
    'login': 'userLogin',
    'email': 'my@email.com',
    'phone': '89223332211',
    'avatar': '/path/to/avatar.jpg'
  },
  {
    'id': 222,
    'first_name': 'Vasya',
    'second_name': 'Ramkin',
    'display_name': 'Vasya Ramkin',
    'login': 'userLogin',
    'email': 'my@email.com',
    'phone': '89223332211',
    'avatar': '/path/to/avatar.jpg'
  },
  {
    'id': 123,
    'first_name': 'Petya',
    'second_name': 'Pupkin',
    'display_name': 'Petya Pupkin',
    'login': 'userLogin',
    'email': 'my@email.com',
    'phone': '89223332211',
    'avatar': '/path/to/avatar.jpg'
  },
  {
    'id': 222,
    'first_name': 'Vasya',
    'second_name': 'Ramkin',
    'display_name': 'Vasya Ramkin',
    'login': 'userLogin',
    'email': 'my@email.com',
    'phone': '89223332211',
    'avatar': '/path/to/avatar.jpg'
  },
  {
    'id': 123,
    'first_name': 'Petya',
    'second_name': 'Pupkin',
    'display_name': 'Petya Pupkin',
    'login': 'userLogin',
    'email': 'my@email.com',
    'phone': '89223332211',
    'avatar': '/path/to/avatar.jpg'
  },
  {
    'id': 222,
    'first_name': 'Vasya',
    'second_name': 'Ramkin',
    'display_name': 'Vasya Ramkin',
    'login': 'userLogin',
    'email': 'my@email.com',
    'phone': '89223332211',
    'avatar': '/path/to/avatar.jpg'
  }
]
  

const UsersList = (users: Users, setChosenUser: (arg: User)=> void) => {
  const userItem = (user: User) => {
    return (
      <li 
        className='userlist-item' 
        key={user.id} 
        onClick={() => setChosenUser(user)}
      >
        {user.display_name}
      </li>
    )
  }

  return (
    <ul className='userlist'>
      {users.map(userItem)}
    </ul>
  )
}

export const StartGame = () => {

  const [ inputValue, setInputValue ] = useState('')
  const [ chosenUser, setChosenUser ] = useState({ id: 0, display_name: '' })
  const [ isListShown, setIsListShown ] = useState(false)

  const navigate = useNavigate();

  const handleSubmit = useCallback(()=> {
    // here will be the logic of adding user to the game and then game start

    navigate('../game', { replace: true } )

  }, [ navigate ])


  const handleSearch = useCallback(() => {
    // here will be the logic of searching user by sending a request. Then add founded user to the state.

    inputValue && setIsListShown(true)
  }, [ inputValue ])
  
  return (
    <div className='wrapper'>
      <Header/>
      <div className='main'>
        <h2>
          {'Let\'s find a user to play with!'}
        </h2>

        <div className='user-search-wrapper' >
          <Input 
            type='text' 
            id='user-search' 
            name='ID or login:' 
            placeholder='search user' 
            required={false} 
            value={inputValue} 
            setValue={setInputValue}/>
          <div className='search-icon' onClick={handleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>  
        </div>

        {isListShown && UsersList(users, setChosenUser)}

        { chosenUser.display_name && <Button name={'Play with ' + chosenUser.display_name} onSubmit={handleSubmit} />}
      </div>
    </div>
  )
}
