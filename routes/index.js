const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  }
  // Add more fields as needed
})

// Create the model
const User = mongoose.model('User', userSchema)

module.exports = User

router.get('/', (req, res) => {
  res.send('Hello, World!')
})

router.get('/users', async (req, res) => {
  // Logic to fetch all users from User collection
  // Dummy logic to fetch all users from User collection
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
  // and send the response
})

router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = await req.body
    const name = await username
    console.log(name, email, password, username)
    const newUser = new User({ username, email, password, name: username })
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

router.post('/user', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username, password })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const secretKey = crypto.randomBytes(64).toString('hex')

    console.log(secretKey)
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });    res.json({ user, token })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
