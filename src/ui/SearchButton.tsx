import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export function SearchButton() {

  return (
    <button className='search-icon'>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </button>
  )
}
