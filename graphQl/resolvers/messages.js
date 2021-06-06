const { UserInputError, AuthenticationError } = require('apollo-server')
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
          const { user } = context
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
  
          return newMessage
        } catch (err) {
          console.log(err)
          throw err
        }
      },
    },
  }




              //   const messages = await Message.findAll({
            //     where: {
            //       from: { [Op.in]: usernames },
            //       to: { [Op.in]: usernames },
            //     },
            //     order: [['createdAt', 'DESC']],
            //   })
