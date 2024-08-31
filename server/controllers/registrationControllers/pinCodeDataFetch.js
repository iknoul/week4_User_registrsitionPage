const https = require('https');
const User = require('../../db/models/userSchema')

function fetchPincodeData(pincode) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'api.postalpincode.in',
            port: null,
            path: `/pincode/${pincode}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                resolve(body);
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        req.end();
    });
}

exports.getPincodeData = async (req, res) => {
    const { pinCode, email } = req.body;

    if (!pinCode) {
        return res.status(400).json({ success: false, message: 'PIN code is required' });
    }

    try {
        // Call the function to fetch postal data
        const result = await fetchPincodeData(pinCode);
        
        // Parse the result if needed
        const parsedResult = JSON.parse(result);
        console.log('Pincode Data:', parsedResult);

        // Respond with the fetched data
        if (parsedResult && parsedResult[0] && parsedResult[0].Status === 'Success') {

            const updatedUser = await User.findOneAndUpdate(
                { email: email }, // Find the user by email
                {
                  $set: {
                    ...(pinCode && { pinCode }), // Update mobile number if provided
                  },
                },
              );

            res.status(200).json({ success: true, data: parsedResult[0] });
        } else {
            res.status(404).json({ success: false, message: 'Data not found for the given PIN code' });
        }
    } catch (error) {
        console.error('Error fetching pincode data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pincode data', error });
    }
};