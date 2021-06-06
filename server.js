const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose')
const resolvers = require('./graphQl/resolvers')
const typeDefs = require('./graphQl/typeDef')
const { MONGO_URI } = require('./config/env.json')

const contextMiddleware = require('./utils/contextMiddleware')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware
})

const connectMongoDB = async() => {
    try{
        const conn = await mongoose.connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })

        console.log(`Connected to MongoDB ${conn.connection.host}`)
    }
    catch(error){
        console.log(`Error connnecting to MongoDB ${error.message}`)
        process.exit(1)
    }
}

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);

  connectMongoDB();
});