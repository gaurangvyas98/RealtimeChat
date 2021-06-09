import React, { createContext, useReducer, useContext } from 'react'

const MessageStateContext = createContext()
const MessageDispatchContext = createContext()

const messageReducer = (state, action) => {
  let usersCopy
  switch (action.type) {
    //setting users in context
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      }
    //setting the selectedUser messages in context
    case 'SET_USER_MESSAGES':
      const { username, messages } = action.payload
      usersCopy = [...state.users]

      const userIndex = usersCopy.findIndex((u) => u.username === username)

      usersCopy[userIndex] = { ...usersCopy[userIndex], messages }

      return {
        ...state,
        users: usersCopy,
      }
    //adding a seleted boolean in context if the user is selected
    case 'SET_SELECTED_USER':
      usersCopy = state.users.map((user) => ({
        ...user,
        selected: user.username === action.payload,
      }))

      return {
        ...state,
        users: usersCopy,
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null })

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  )
}

export const useMessageState = () => useContext(MessageStateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)