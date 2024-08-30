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
app.use(express.static('/public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// app.post('/send-otp', (req, res)=>{
//   res.status(200).send('okk ...')
// })

// app.get('/k',async (req, res)=>{
//   try {
//     const users = await User.find(); // Fetch all users
//     if (users.length === 0) {
//       User.create({
//         name: 'shamill Lannister',
//         email: 'nikolaj_coster-waldau@gameofthron.es',
//         password: '$2b$12$6vz7wiwO.EI5Rilvq1zUc./9480gb1uPtXcahDxIadgyC3PS8XCUK'
//       })
//         .then(user => {
//           console.log('User inserted:', user);
//         })
//         .catch(error => {
//           console.error('Error inserting user:', error);
//         });
//       return res.status(404).json({ message: 'No users found' });
//     }
//     console.log(users);
//     res.json(users);
//   } catch (error) {
//     res.status(200).json({username:'sbooooss', email:'rhmanshamil@gmail.co', channel:'s'});
//   }
  // res.status(200).json({username:'sss', email:'rhmanshamil@gmail.co', channel:'s'})
// })

const routes = require('./routes');
app.use(routes);

const server = app.listen(process.env.PORT || 8888, () => {
  console.log(`Express running → On PORT : ${server.address().port}`);
});
