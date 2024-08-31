const https = require('https');

const User = require('../../db/models/userSchema')

exports.verifyPanToAadhaar = (req, res) => {
    const { pancard, email } = req.body;

    if (!pancard) {
        return res.status(400).json({ error: 'PAN number is required' });
    }

    const options = {
        method: 'POST',
        hostname: 'aadhaar-number-verification-api-using-pan-number.p.rapidapi.com',
        port: null,
        path: '/api/validation/pan_to_aadhaar',
        headers: {
            'x-rapidapi-key': 'a2adb6a937msh4a51c4ca69acecbp1d5738jsnc1a7fded247e',
            'x-rapidapi-host': 'aadhaar-number-verification-api-using-pan-number.p.rapidapi.com',
            'Content-Type': 'application/json'  
        }
    };

    const apiReq = https.request(options, function (apiRes) {
        const chunks = [];

        apiRes.on('data', function (chunk) {
            chunks.push(chunk);
        });

        apiRes.on('end',  async()=> {
            try {
                const body = Buffer.concat(chunks).toString();
                const parsedBody = JSON.parse(body);

                // Check if the response contains an error
                if (apiRes.statusCode !== 200) {
                    return res.status(apiRes.statusCode).json({
                        error: parsedBody.message || 'Failed to verify PAN to Aadhaar',
                    });
                }

                const updatedUser = await User.findOneAndUpdate(
                    { email: email }, // Find the user by email
                    {
                      $set: {
                        ...(pancard && { pancard }), // Update mobile number if provided
                      },
                    },
                  );

                // Success response
                res.status(200).json({ data: parsedBody });

            } catch (error) {
                // JSON parsing error
                console.error('Error parsing API response:', error.message);
                res.status(500).json({ error: 'Failed to parse API response' });
            }
        });
    });

    // Handle request error
    apiReq.on('error', (error) => {
        console.error('Request error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    // Send the request payload
    apiReq.write(JSON.stringify({
        pan: pancard,
        consent: 'y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via AITAN Labs API'
    }));
    apiReq.end();
};


