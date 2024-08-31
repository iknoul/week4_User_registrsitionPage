const https = require('https');

const User = require('../../db/models/userSchema')

function verifyGSTCertificate(gstin) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            hostname: 'gst-verification.p.rapidapi.com',
            port: null,
            path: '/v3/tasks/sync/verify_with_source/ind_gst_certificate',
            headers: {
                'x-rapidapi-key': 'a2adb6a937msh4a51c4ca69acecbp1d5738jsnc1a7fded247e',
                'x-rapidapi-host': 'gst-verification.p.rapidapi.com',
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

        req.write(JSON.stringify({
            task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
            group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
            data: {
                gstin: gstin,
            },
        }));
        req.end();
    });
}

exports.verifyGST = async (req, res) => {
    const {gst, email} = req.body;

    try {
        // Call the function to verify GST certificate
        const result = await verifyGSTCertificate(gst);
        
        // Parse the result if needed
        const parsedResult = JSON.parse(result);
        console.log('Verification Result:', parsedResult);

        // Process the verification result
        if (parsedResult && parsedResult.status === 'completed') {

            const updatedUser = await User.findOneAndUpdate(
                { email: email }, // Find the user by email
                {
                  $set: {
                    ...(gst && { gstNumber: gst }), // Update mobile number if provided
                  },
                },
              );

            res.status(200).json({ success: true, data: parsedResult });
        } else {
            res.status(400).json({ success: false, message: 'Verification failed or not completed' });
        }
    } catch (error) {
        console.error('Error during GST verification:', error);
        res.status(500).json({ success: false, message: 'GST verification failed', error });
    }
};
