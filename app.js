require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const cors = require('cors');

const app = express();

app.use(cors({ origin: '*'}));

// MongoDB connection string
const dbURI = process.env.MONGO_URI; // Use the connection string from .env file

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use(express.json());

// Use routes
app.use('/', routes);


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        version: "1.0.0",
        title: "My App",
        description: "Documentation automatically generated"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}

module.exports = app => {
    const routes = require('./routes')
    app.use('/', routes)
    swaggerAutogen()(doc, ['./app.js']).then(require('./swagger'))
}

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(4000, () => {
    console.log('Server is running on port 3000');
    }
);