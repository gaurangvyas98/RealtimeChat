import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Col, Image } from 'react-bootstrap'
import { useMessageDispatch, useMessageState } from '../../context/messageContext'
import classNames from 'classnames'


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
    const dispatch = useMessageDispatch()
    const { users } = useMessageState()
    const selectedUser = users?.find((u) => u.selected === true)?.username

    const { loading } = useQuery(GET_USERS, {
        onCompleted: (data) =>
            dispatch({ type: 'SET_USERS', payload: data.getUsers }),
        onError: (err) => console.log(err),
})

let usersMarkup

if (!users || loading) 
{
    usersMarkup = <p>Loading..</p>
} 
else if (users.length === 0) 
{
    usersMarkup = <p>No users have joined yet</p>
} 
else if (users.length > 0) 
{
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username
      return (
        <div
          role="button"
          className={classNames('user-div d-flex justify-content-center justify-content-md-start p-3',
            {
              'bg-white': selected,
            }
          )}
          key={user.username}
          onClick={() =>
            dispatch({ type: 'SET_SELECTED_USER', payload: user.username })
          }
        >
          <Image
            src={
              user.imageUrl ||
              'https://images.unsplash.com/photo-1525382455947-f319bc05fb35?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=814&q=80'
            }
            className="user-image"
          />
          <div className="d-none d-md-block ml-2">
            <p className="text-success">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage ? user.latestMessage.content : 'You are now connected!'}
            </p>
          </div>
        </div>
      )
    })
  }


return (
    <Col xs={2} md={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  )
}

export default Users
