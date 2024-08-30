const request = require('request');

const validateAadhaar = (adhar) => {

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://api.apyhub.com/validate/aadhaar',
      headers: {
        // 'apy-token': 'APY0MpcnqB9gNcnfqir1RFvkbPtTtixBKgspqIFfLYeEWsAXVBaOuJZDgMFwWNJ7v9u',
        'apy-token':'APY0umFSiV839dYNBP8npGNSeonu9BT46cwfyZAwNjIFk4cTAMrwpVSd5tW70eSx',
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
    const { adhar } = req.body;
  
    try {
      // const result = await validateAadhaar(adhar);
      // console.log(result);
      res.status(200).send('Aadhaar validation successful');
    } catch (error) {
      console.error(error);
      res.status(401).send(`Validation failed: ${error.message}`);
    }
  }
