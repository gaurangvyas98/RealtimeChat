const { UserInputError, AuthenticationError, withFilter } = require('apollo-server')
const User  = require('../../model/User')
const  Message  = require('../../model/Message')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    Query: {
      getMessages: async (parent, args, context) => {
          const { from } = args
          const { user } = context
        try {
            if (!user) throw new AuthenticationError('Unauthenticated')

            const otherUser = await User.findOne({ username: from })

            if (!otherUser) throw new UserInputError('User not found')

            //$in can only search in array
            const usernames = [user.username, otherUser.username]

            //getting all the messages b/w the two users
            const messages = await Message.find({ 
                from: {$in: usernames}, 
                to: {$in: usernames} 
            });

            return messages
        } catch (err) {
          console.log(err)
          throw err
        }
      },
    },
    Mutation: {
      sendMessage: async (parent, args, context) => {
          const { to, content } = args
          const { user, pubsub } = context
        try {
          if (!user) throw new AuthenticationError('Unauthenticated')
  
          const recipient = await User.findOne({ username: to })
  
          if (!recipient) {
            throw new UserInputError('User not found')
          } else if (recipient.username === user.username) {
            throw new UserInputError('You cant message yourself')
          }
  
          if (content.trim() === '') {
            throw new UserInputError('Message is empty')
          }
        
          //creating new message
          const newMessage = new Message({
            from: user.username,
            to,
            content,
            uuid: uuidv4()
          })
          //saving new message
          await newMessage.save()

          //firing the subscription after saving message
          pubsub.publish('NEW_MESSAGE', {newMessage: message})
  
          return newMessage
        } catch (err) {
          console.log(err)
          throw err
        }
      },
    },
    Subscription: {
      newMessage: {
        subscribe: withFilter((_, __, { pubsub, user }) => {
          //user needs to be authenticated for subscription
          if (!user) throw new AuthenticationError('Unauthenticated')
          
          return pubsub.asyncIterator(['NEW_MESSAGE'])
          },
          ({ newMessage }, _, { user }) => {
            if (newMessage.from === user.username || newMessage.to === user.username) {
              return true
            }
            return false
          }),
      }
    }
  }

    //subscribe withFilter() will take two args
   //subscribing to the messages of the logged in user
   //user will only be able to see 'to' or 'from', not able to see otherUser messages
  
