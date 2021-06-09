import React from 'react'
import { useAuthState } from '../../context/authContext'
import classNames from 'classnames'

const Message = ({ message }) => {

    const { user } = useAuthState()
    const sent = message.from === user.username //message is then sent by the user
    const received = !sent

    return (
        <div className={classNames('d-flex my-3', {
            'ml-auto': sent,
            'mr-auto': received,
            })}
        >
        <div className={classNames('py-2 px-3 rounded-pill', {
            'bg-primary': sent,
            'bg-secondary': received,
            })}
        >
          <p className={classNames({ 'text-white': sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
      </div>
    )
}

export default Message
