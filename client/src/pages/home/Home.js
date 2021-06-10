import React, { useEffect } from 'react'
import { Button, Nav, Navbar, Row } from 'react-bootstrap'
import { gql, useSubscription } from '@apollo/client'
import { useAuthDispatch, useAuthState } from '../../context/authContext'
import Users from './Users'
import Chat from './Chat'
import { useMessageDispatch } from '../../context/messageContext'

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`


const Home = () => {
    const authDispatch = useAuthDispatch()
    const messageDispatch = useMessageDispatch()

    const { user } = useAuthState()

    const {data: messageData, error: messageError} = useSubscription(NEW_MESSAGE)

    useEffect(() => {
        if (messageError) console.log(messageError)
    
        if (messageData) {
          const message = messageData.newMessage
          const otherUser = user.username === message.to ? message.from : message.to
    
          messageDispatch({
            type: 'ADD_MESSAGE',
            payload: {
              username: otherUser,
              message,
            },
          })
        }
      }, [messageError, messageData])

    const logout = () => {
        authDispatch({ type: 'LOGOUT' })
        window.location.href = '/login'
    }

    return (
        <>
        <Navbar bg="transparent" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav style={{marginLeft: 'auto'}}>
                <Nav.Item className='navHeading text-white'>
                   <h3>{user.username}</h3>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/">
                    <Button className="btn btn-primary logoutButton" onClick={logout}>
                        Logout
                    </Button></Nav.Link>
                </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Row className="bg-white">
            <Users />
            <Chat />
        </Row>
        </>
    )
}

export default Home