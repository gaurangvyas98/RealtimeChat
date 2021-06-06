const mongoose = require('mongoose')
const User = require('./model/User')
const Message = require('./model/Message')
const { MONGO_URI } = require('./config/env.json')
const bcrypt = require('bcrypt')

const usersArray = [
    {
        username: 'john',
        email: 'john@email.com',
        password: '123',
        imageUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1700&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jane',
        email: 'jane@email.com',
        password: '123',
        imageUrl:
          'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2190&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'boss',
        email: 'boss@email.com',
        password: '123',
        imageUrl:
          'https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2122&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
]

const messageArray = [
    {
        uuid: '7648485a-6657-48d7-87d6-6a98931d3598',
        content: 'Hey Jane!',
        from: 'john',
        to: 'jane',
        createdAt: '2020-07-01 07:00:00',
        updatedAt: '2020-07-01 07:00:00',
      },
      {
        uuid: 'ae4df4f1-a428-400d-bb16-edd4237e0c47',
        content: "Hey John, how's it going?",
        from: 'jane',
        to: 'john',
        createdAt: '2020-07-01 08:00:00',
        updatedAt: '2020-07-01 08:00:00',
      },
      {
        uuid: '0a7c92ac-f69c-4799-8aad-9663a4afb47d',
        content: 'Not too bad, just getting to work, you?',
        from: 'john',
        to: 'jane',
        createdAt: '2020-07-01 09:00:00',
        updatedAt: '2020-07-01 09:00:00',
      },
      {
        uuid: '240dd560-5825-4d5d-b089-12a67e8ec84c',
        content: "I'm working from home now",
        from: 'jane',
        to: 'john',
        createdAt: '2020-07-01 10:00:00',
        updatedAt: '2020-07-01 10:00:00',
      },
      {
        uuid: 'fd4cee68-5caf-4b1b-80a9-5b9add7fd863',
        content: 'Hey John, are you done with that task?',
        from: 'boss',
        to: 'john',
        createdAt: '2020-07-01 11:00:00',
        updatedAt: '2020-07-01 11:00:00',
      },
]

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


const importData = async() =>{
    connectMongoDB()
    // const password =  await bcrypt.hash('123', 6)
    // const createdAt = new Date()
    // const updatedAt = createdAt

    try{
        await User.deleteMany()
        await Message.deleteMany()

        const createdUser = await User.insertMany(usersArray)

        await Message.insertMany(messageArray)

        console.log('Data imported!')
        process.exit()
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }
}

const destroyData = async() =>{
    connectMongoDB()
    try{
        await User.deleteMany()
        await Message.deleteMany()
     
        console.log('Data destroyed!')
        process.exit()
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }
}

//creating a script "node backend/seeder -d for destroying data from terminal"
if(process.argv[2] === '-d'){
    destroyData()
}
else{ 
    //creating a script "node backend/seeder for importing data from terminal"
    importData()
}