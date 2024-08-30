  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  dotenv.config({ path: './.env' });

  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log('DATABASE CONNECTED');
    })
    .catch(e => {
      console.log(e);
    });
