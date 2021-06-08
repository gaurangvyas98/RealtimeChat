import { createContext, useContext, useReducer } from "react";

const MessageStateContext = createContext()
const MessageDispatchContext = createContext()

const messageReducer = (state, action) =>{
    let usersCopy, userIndex
    const { username, message, messages } = action.payload
    
    switch (action.type) {
        case 'SET_USERS':
          return {
            ...state,
            users: action.payload,
          }
        case 'SET_USER_MESSAGES':
            usersCopy = [...state.users]
            userIndex = usersCopy.findIndex((u) => u.username === username)
            usersCopy[userIndex] = { ...usersCopy[userIndex], messages }
      
            return {
              ...state,
              users: usersCopy,
            }
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