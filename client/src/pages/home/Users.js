import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Col } from 'react-bootstrap'


const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`

function Users() {


  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
    //   dispatch({ type: 'SET_USERS', payload: data.getUsers }),
    console.log(data),
    onError: (err) => console.log(err),
  })

  return (
    <Col xs={2} md={4} className="p-0 bg-secondary">
      {/* {usersMarkup} */}
    </Col>
  )
}

export default Users
