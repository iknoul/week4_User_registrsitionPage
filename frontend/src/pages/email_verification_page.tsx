'use client'
import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import { decodeToken } from '@/utils/decodeToken';


import axios from '@/utils/axios'

import OtpVerificationBox from '@/app/components/OtpVerificationBox/OtpVerificationBpx';


const  Email_verification_page = ()=> {

  const [disabled, disable] = useState(true)
  const [failed, setFailed] = useState(false)
  const [verified, setVerified] = useState(false)
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter()

  const onSendOtp = async (email:string) => {
    
    setOtpSent(true);  
    //OTP sending function here
    if (email && !otpSent) {
      try {
        // API call for sending OTP
        const result = await axios.post(`/registration/verify-sentotp-email`,{email})
        setOtpSent(true);
      } catch (error) {
        console.error('Error sending OTP:', error);
        setFailed(true)
        // throw(error)

      }
    }
  };

const verifyOtp = async (email:string, otp:string) => {

  try {
        const result = await axios.post('/registration/verify-verifyotp-email', {
        email,
        OTP: otp,
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
    if (decodedToken &&  (decodedToken.step === 'emailVerified' || decodedToken.step === 'mobileVerified')) {
      router.push('/mobile_verification_page'); // Redirect to the mobile verification page if already verified
    }
  }
}, [router]);
  return (
    <OtpVerificationBox 
      verifyOtp={verifyOtp}
      onSendotp={onSendOtp}
      type='email' 
      otpSent={otpSent} 
      verified = {verified} 
      failed = {failed} 
      disabled = {disabled} 
      setOtpSent={setOtpSent} 
      setVerified={setVerified} 
      setFailed={setFailed} 
      disable={disable}
      after={()=>{router.push('/mobile_verification_page')}}
    />
  );
}

export default Email_verification_page;

