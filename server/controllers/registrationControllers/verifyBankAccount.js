const https = require('https');

const User = require('../../db/models/userSchema')

function getVerifivationId(bankAccountNo, bankIfscCode) {

    console.log(bankAccountNo, bankIfscCode, "--<___ bank ifsc`")

    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            hostname: 'indian-bank-account-verification.p.rapidapi.com',
            port: null,
            path: '/v3/tasks/async/verify_with_source/validate_bank_account',
            headers: {
                'x-rapidapi-key': 'a5f81d51ecmsh33c9bb11d5bbcc5p1018cfjsn66e44cedf33e',
                'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com',
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks);
                resolve(body.toString());
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        const requestData = {
            task_id: '123',
            group_id: '1234',
            data: {
                bank_account_no: bankAccountNo,
                bank_ifsc_code: bankIfscCode,
            },
        };

        req.write(JSON.stringify(requestData));
        req.end();
    });
}

const getBankVerificationData = async (requestId, retryCount = 5, delay = 10000) => {
    console.log(`Fetching data for request ID: ${requestId}`);

    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'indian-bank-account-verification.p.rapidapi.com',
            port: null,
            path: `/v3/tasks?request_id=${requestId}`,
            headers: {
                'x-rapidapi-key': 'a5f81d51ecmsh33c9bb11d5bbcc5p1018cfjsn66e44cedf33e',
                'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com'
            },
        };

        const req = https.request(options, (res) => {

            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', async () => {
                const body = Buffer.concat(chunks);
                const result = JSON.parse(body.toString());

                // Assuming 'status' in result contains 'in_progress'
                if (result.status === 'in_progress' && retryCount > 0) {
                    console.log('Verification still in progress. Retrying...');
                    // Wait for the delay time and then retry
                    setTimeout(() => {
                        resolve(getBankVerificationData(requestId, retryCount - 1, delay));
                    }, delay);
                } else {
                    resolve(result);
                }
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        req.end();
    });
}

exports.verifyBankDetails = async (req, res) => {
    const {accNo, ifsc, email } = req.body;

    try {
        // First, verify the bank details and get the request_id
        const verificationResult = await getVerifivationId(accNo, ifsc);
        
        // Assuming you get `request_id` from verificationResult
        const { request_id } = await JSON.parse(verificationResult);
        
        if (!request_id) {
            return res.status(400).json({ success: false, message: 'Request ID not found in verification result' });
        }
        console.log(request_id, "<-- request id")
        // Now, use the request_id to get the real data
        const realData = await getBankVerificationData(request_id);
        // Parse the realData to JSON
        const parsedDataArray = await JSON.parse(realData);
        console.log("Parsed realData:", parsedDataArray);

        // Access the first element of the array
        const parsedData = parsedDataArray[0];

        // Check if the status is completed
        if (parsedData.status === 'completed' && parsedData.result.status === 'id_found') {


            const updatedUser = await User.findOneAndUpdate(
                { email: email }, // Find the user by email
                {
                  $set: {
                    ...(bankAccountNo && { bankAccountNo:accNo }),
                    ...(bankIfscCode && { bankIfscCode:ifsc }),
                  },
                },
              );

            res.status(200).json({ success: true, data: parsedData });
        } else {
            res.status(400).json({ success: false, message: 'Verification not completed or ID not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Bank account verification failed', error });
    }
};
