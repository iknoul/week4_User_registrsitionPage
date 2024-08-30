'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {useRouter} from 'next/router';
import { decodeToken } from '@/utils/decodeToken';


import axios from '@/utils/axios'
import { AxiosError } from 'axios';

import ArrowRight from '@/app/components/ArrowRight/ArrowRight';
import VerifyButton from '@/app/components/verifyButton/VerifyButton';

import styles from './styles/email_verification_page.module.css'


type FormValues = {
  username:string,
  email:string,
  channel: string,
  otp: string,
}
function email_verification_page() {

  const [step, setStep] = useState(1)
  const [disabled, disable] = useState(true)
  const [failed, setFailed] = useState(false)
  const [verified, setVerified] = useState(false)
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter()

const form = useForm<FormValues>({mode: 'onChange'})
const {register, control, handleSubmit, formState, getValues, setValue, clearErrors, setError} = form

const {errors, isValid} =  formState;

const onSendOtp = async () => {
  setOtpSent(false);
  clearErrors('email');

  const email = getValues('email');
  if (email && !otpSent) {
    // Call your OTP sending function here

    try {
      // Example API call for sending OTP
      const result = (await axios.post(`/auth/login-sentotp`,{email, Mobile_no:'2221012312'}))
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  }
};

const verifyOtp = async () => {
  try {
    const email = getValues('email');
    const otp = getValues('otp');
    clearErrors('email');

    const result = await axios.post('/auth/login-verifyotp', {
      email,
      Mobile_no: '2221012312',
      OTP: otp,
    });

    console.log(result.data.registrationToken)
    sessionStorage.setItem('registrationToken', result.data.registrationToken)

    // Clear any previous OTP errors if the response is successful
    clearErrors('otp');
    setVerified(true)
    disable(true)

    // Handle successful OTP verification

  } catch (error:unknown) {

    setOtpSent(false)
    setFailed(true)
    disable(false)


    // Check if the error is an AxiosError
    if (error instanceof AxiosError) {
      // Handle AxiosError specifically
      if (error.response && (error.response.status === 401 || error.response.status === 500)) {
        // Set the error for the OTP field
        setError('email', {
          type: 'manual',
          message: ' ! Invalid OTP. Please try again.',
        });
      } else {
        // Handle other AxiosErrors, such as network issues or other statuses
        console.error('Verification failed with status:', error.response?.status);
      }
    } else {
      // Handle non-AxiosErrors (e.g., unexpected errors)
      console.error('An unexpected error occurred:', error);
    }
  }
  }

const onSubmit = (data: FormValues) =>{
    console.log('form submitted', data)
}
useEffect(() => {
  const token = sessionStorage.getItem('registrationToken');
  if (token) {
    const decodedToken = decodeToken(token);
    if (decodedToken && decodedToken.step === 'emailVerified') {
      router.push('/mobile_verification_page'); // Redirect to the mobile verification page if already verified
    }
  }
}, [router]);
  return (
    <div className={styles.container}>
      <h1>registration form</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>    
      <h3>Email verification</h3>
        <label htmlFor="email"></label>
        <div className={styles.input}>
          <input
              type="email"
              id="email"
              placeholder='Enter your email, eg: ewe@li.com'
              {...register('email',{
                  pattern:{
                      value:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message:"*invalid email format"
                  },
                  required:{
                    value: true,
                    message:"email is required"
                },
              })
              }
              disabled={otpSent}    
          />
          <VerifyButton 
            callBackFunction={onSendOtp} 
            disabled={!isValid || otpSent}
            status={otpSent?(verified?'verified':(failed?'fail':'pending')):'sent OTP'}
          />
        </div>
        {
          otpSent && !verified &&
          <span className={styles.otpVerifyContainer}>
            <label htmlFor="otp"></label>
            <input 
              className={styles.otp}
              type="text"
              id="otp"
              placeholder='Enter your otp'  
              {...register('otp', {
                required: {
                  value: true,
                  message: "OTP is required",
                },
              })}
            />
            <VerifyButton callBackFunction={verifyOtp} disabled={!isValid}>Verify OTP</VerifyButton>
          </span>
        }
        <p>{errors.email?.message}</p>

        <ArrowRight disabled={!verified} callBackFunction={()=>{router.push('/mobile_verification_page')}}/>
        
      </form>
      
    </div>
  );
}

export default email_verification_page;

