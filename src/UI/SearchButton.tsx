import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export const SearchButton = () => {

  return (
    <button className='search-icon'>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </button> 
  )
}

export default SearchButton