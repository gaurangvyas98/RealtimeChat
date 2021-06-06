const bcrypt = require('bcrypt')
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const User  = require('../../model/User')
const  Message  = require('../../model/Message')
const { JWT_SECRET } = require('../../config/env.json')

module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
        const { user } = context
        try {
            if (!user) throw new AuthenticationError('Unauthenticated')

            // find all users except logged in user
            let users = await User.find({
                username: {$ne: user.username}
            })

            //finding all messages of user(sent or recieved)
            const allUserMessages = await Message.find({ $or:[ 
                {'from': user.username}, 
                {'to': user.username }]})

            // const allUserMessages = await Message.find({
            // where: {
            //     [Op.or]: [{ from: user.username }, { to: user.username }],
            // },
            // order: [['createdAt', 'DESC']],
            // })

            //finding latest message of user
            users = users.map((otherUser) => {
            const latestMessage = allUserMessages.find(
                (m) => m.from === otherUser.username || m.to === otherUser.username
            )
            otherUser.latestMessage = latestMessage
            return otherUser
            })

            return users
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    login: async (_, args) => {
      const { username, password } = args
      let errors = {}

      try {
        if (username.trim() === '')
          errors.username = 'username must not be empty'
        if (password === '') errors.password = 'password must not be empty'

        if (Object.keys(errors).length > 0) {
          throw new UserInputError('bad input', { errors })
        }

        //finding if user exists in db
        const foundUser = await User.findOne({ username: username })

        if (!foundUser) {
          errors.username = 'user not found'
          throw new UserInputError('user not found', { errors })
        }

        // const correctPassword = await bcrypt.compare(password, foundUser.password)

        // if (!correctPassword) {
        //   errors.password = 'password is incorrect'
        //   throw new UserInputError('password is incorrect', { errors })
        // }

        const token = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: 60 * 60,
        })

        return {
          ...foundUser.toJSON(),
          createdAt: foundUser.createdAt.toISOString(),
          token,
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
  Mutation: {
    register: async(_, args) => {
        let { username, email, password, confirmPassword } = args
        let errors = {}
        try{
            // Validate input data
            if (email.trim() === '') errors.email = 'email must not be empty'
            if (username.trim() === '')
            errors.username = 'username must not be empty'
            if (password.trim() === '')
            errors.password = 'password must not be empty'
            if (confirmPassword.trim() === '')
            errors.confirmPassword = 'repeat password must not be empty'

            if (password !== confirmPassword)
            errors.confirmPassword = 'passwords must match'

            if (Object.keys(errors).length > 0) {
                throw errors
            }
      
            // Hash password
            password = await bcrypt.hash(password, 6)

            //create new user
            const newUser = new User({
               username,
               email,
               password
            })

            //saving in the db
            await newUser.save()

            // Return user
            return newUser
        }
        catch(err){
            console.log(err.message)
            if(err.message.includes('duplicate key error collection')){
                throw new UserInputError('username or email already taken')
            }

            throw new UserInputError('Bad input', { errors })
        }
    }
  },
}