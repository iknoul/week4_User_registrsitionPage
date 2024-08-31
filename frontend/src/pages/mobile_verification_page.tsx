import PrivateRouter from "@/app/components/PrivateRouter"


import axios from '@/utils/axios'
import OtpVerificationBox from "@/app/components/OtpVerificationBox/OtpVerificationBpx"
import { useEffect, useState } from "react"
import { decodeToken } from "@/utils/decodeToken"
import { useRouter } from "next/router"

const MobileVerification = ()=>{

    const [disabled, disable] = useState(true)
    const [failed, setFailed] = useState(false)
    const [verified, setVerified] = useState(false)
    const [otpSent, setOtpSent] = useState(false);
    const router = useRouter()
  
  const onSendOtp = async (mobile_number:string) => {

    const token = sessionStorage.getItem('registrationToken')
    
    setOtpSent(true);  
    //OTP sending function here
    if (mobile_number && !otpSent) 
    {
      try 
      {
        // API call for sending OTP
        const result = await axios.post(`/registration/verify-sentotp-mobile`,
          {mobile_number},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
        setOtpSent(true);        
      } 
      catch (error) 
      {
        console.error('Error sending OTP:', error);
        setFailed(true)
        throw(error)  
      }
    }
  };
  
  const verifyOtp = async (mobile_number:string, otp:string) => {
   
    const token = sessionStorage.getItem('registrationToken')

    try {
          const result = await axios.post('/registration/verify-verifyotp-mobile', {
          mobile_number,
          OTP: otp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      console.log(result.data.registrationToken)
      sessionStorage.setItem('registrationToken', result.data.registrationToken)
  
      // Clear any previous OTP errors if the response is successful
      
      setVerified(true)
      disable(true)
  
      // Handle successful OTP verification
  
      } catch (error) {
        setOtpSent(false)
        setFailed(true)
        disable(false)
        setFailed(true)
        throw error
        
      }
      }
  
  useEffect(() => {
    const token = sessionStorage.getItem('registrationToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.step === 'mobileVerified') {
        router.push('/details_input_page'); // Redirect to the details_input_page if already verified
      }
    }
  }, [router]);
    
return(
<PrivateRouter requiredSteps = {{ step: 'emailVerified' }}>
    <OtpVerificationBox 
      verifyOtp={verifyOtp}
      onSendotp={onSendOtp}
      type='mobile' 
      otpSent={otpSent} 
      verified = {verified} 
      failed = {failed} 
      disabled = {disabled} 
      setOtpSent={setOtpSent} 
      setVerified={setVerified} 
      setFailed={setFailed} 
      disable={disable}
      after={()=>{router.push('/details_input_page')}}
    />
</PrivateRouter>)
}

export default MobileVerification