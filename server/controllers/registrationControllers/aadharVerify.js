const request = require('request');

const User = require('../../db/models/userSchema')

const validateAadhaar = (adhar) => {

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://api.apyhub.com/validate/aadhaar',
      headers: {
        'apy-token': 'APY0MpcnqB9gNcnfqir1RFvkbPtTtixBKgspqIFfLYeEWsAXVBaOuJZDgMFwWNJ7v9u',
        // 'apy-token':'APY0umFSiV839dYNBP8npGNSeonu9BT46cwfyZAwNjIFk4cTAMrwpVSd5tW70eSx',
        'Content-Type': 'application/json'
      },
      body: { aadhaar: adhar },
      json: true
    };

    request(options, (error, response, body) => {
      if (error) {
        reject(new Error(error));
      } else if (response.statusCode !== 200) {
        reject(new Error(`Request failed with status code ${response.statusCode}`));
      } else {
        resolve(body);
      }
    });
  });
};

// Express route handler
exports.handleAadhaarValidation = async (req, res) => {
    const { aadhar, email } = req.body;
    console.log(aadhar)
    try {
      const result = await validateAadhaar(aadhar);
      console.log(result)
      if(result.data){

        const updatedUser = await User.findOneAndUpdate(
          { email: email }, // Find the user by email
          {
            $set: {
              ...(aadhar && { aadhar }), // Update mobile number if provided
            },
          },
        );

        res.status(200).send('Aadhaar validation successful');
      }
      else{
        res.status(422).send('Validation failed')
      }
      console.log(result, 'result here');

    } catch (error) {
      console.error(error);
      res.status(422).send(`Validation failed: ${error.message}`);
    }
  }
