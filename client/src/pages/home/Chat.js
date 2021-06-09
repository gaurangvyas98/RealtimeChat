import React, { useEffect, useState } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import Message from './Message'
import { Col, Form } from 'react-bootstrap'

import { useMessageDispatch, useMessageState } from '../../context/messageContext'

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`


function Chat() {
  const [content, setMessageContent] = useState('')
  const { users } = useMessageState()
  const dispatch = useMessageDispatch()

  const selectedUser = users?.find((u) => u.selected === true)
  const messages = selectedUser?.messages

  const [getMessages,{ loading: messagesLoading, data: messagesData },] = useLazyQuery(GET_MESSAGES)

  //if we don't have user message in context fetch the msgs from backend
  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } })
    }
  }, [selectedUser])

  //setting user meessages in the context
  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      })
    }
  }, [messagesData])

  let selectedChatMarkup
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p>Select a friend</p>
  } 
  else if (messagesLoading) {
    selectedChatMarkup = <p>Loading..</p>
  } 
  else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message) => (
      <Message key={message.uuid} message={message}/>
      //passing messages in Message component
    ))
  } 
  else if (messages.length === 0) {
    selectedChatMarkup = <p>You are now connected! send your first message!</p>
  }


  //sending message using useMutation hook
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    //after msg is successfully sent to server add the message to context
    // onCompleted: data => dispatch({ 
    //     username: selectedUser.username, 
    //     message: data.sendMessage
    //   }),
    onError: err => console.log(err)
  })

  const submitMessage = e => {
    e.preventDefault()

    if(content.trim() === '' || !selectedUser) return

    //mutation for sending the message
    sendMessage({ variables: { to: selectedUser.username, content } })
    
    //emptying the textfield after sending the message
    setMessageContent('')
  }

  return(
        <Col xs={8} md={8} className='p-3'>
          <div className='messages-box d-flex flex-column'>
            {selectedChatMarkup}
          </div>
         
          <Form onSubmit={submitMessage}>
            <Form.Group>
              <Form.Control 
                type='text' 
                onChange=''
                className='message-input rounded-pill bg-secondary'
                placeholder='Type a message...'
                value={content}
                onChange={(e) => setMessageContent(e.target.value)}
              >
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
  ) 
}

export default Chat