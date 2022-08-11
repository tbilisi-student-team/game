import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

type SearchButtonProps = {
  handleSearch: () => void
}

export const SearchButton = (props: SearchButtonProps) => {

  return (
    <button className='search-icon' onClick={props.handleSearch}>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </button> 
  )
}

export default SearchButton