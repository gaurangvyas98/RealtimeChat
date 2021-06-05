const User = require('../model/User')
const jwt = require('jsonwebtoken')
const { JWT } = require('../config/env.json')
const bcrypt = require('bcrypt')
const { UserInputError, AuthenticationError } = require('apollo-server')

module.exports = {
    Query: {
        getUsers: async(_, __, context) => {
            try{
                const user = await User.find({ })
                return user
            }catch (err) {
                console.log(err)
                throw err
            }
        }
    }   
}