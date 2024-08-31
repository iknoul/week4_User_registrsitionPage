const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db');

const User = require('./db/models/userSchema')

//dev
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './.env' });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


const routes = require('./routes');
app.use(routes);

const server = app.listen(process.env.PORT || 8888, () => {
  console.log(`Express running → On PORT : ${server.address().port}`);
});
