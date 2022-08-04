import React from 'react';
import { useParams } from 'react-router-dom';

export function User () {
  const { id } = useParams();

  return (
    <>
      <h1>{`User:${id}`}</h1>
    </>
  )
}
