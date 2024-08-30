import React from 'react';
import { useForm } from 'react-hook-form';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import ArrowRight from '@/app/components/ArrowRight/ArrowRight';
import VerifyButton from '@/app/components/verifyButton/VerifyButton';
import styles from './OtpVerificationBox.module.css';


interface OtpVerificationBoxProps {
    verifyOtp : Function;
    onSendotp : Function;
    type? : 'email' | 'mobile';
    otpSent : boolean;
    verified : boolean;
    failed : boolean;
    disabled : boolean;
    setOtpSent: Function;
    setVerified: Function;
    setFailed: Function;
    disable: Function;
    after: Function;
}

type FormValues = {
    username:string,
    email:string,
    mobile: string,
    channel: string,
    otp: string,
  }

const OtpVerificationBox: React.FC<OtpVerificationBoxProps> = ({ verifyOtp, onSendotp, type, otpSent, verified, failed, disabled, setOtpSent, setVerified, setFailed, disable, after}) => {


    const form = useForm<FormValues>({mode: 'onChange'})  
    const { register, handleSubmit, formState, getValues, setValue, clearErrors, setError } = form;

    const router = useRouter();

    const {errors, isValid} =  formState;

    const onSendOtpClick = () => {
        clearErrors(type);
        const inputValue = getValues(type === 'email' ? 'email' : 'mobile');
        onSendotp(inputValue)
       
    };

    const onVerifyOtp = async() =>{
        const inputValue = getValues(type === 'email' ? 'email' : 'mobile');
        const otp = getValues('otp');
        clearErrors('email');

        try {
           await verifyOtp(inputValue, otp)    
        } catch (error) {
            console.log('herere')
            // Check if the error is an AxiosError
            if (error instanceof AxiosError) {
                // Handle AxiosError specifically
                if (error.response && (error.response.status === 401 || error.response.status === 500)) {
                // Set the error for the OTP field
                console.log('hherer but not')
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

    return (
        <div className={styles.container}>
            <form className={styles.form} noValidate>
                <h3>{type === 'email' ? 'Email Verification' : 'Mobile Verification'}</h3>
                <label htmlFor={type}></label>
                <div className={styles.input}>
                    {type === 'email' && (
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email, e.g., example@domain.com"
                            {...register('email', {
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "*Invalid email format",
                                },
                                required: {
                                    value: true,
                                    message: "Email is required",
                                },
                            })}
                            disabled={otpSent}
                        />
                    )}

                    {type === 'mobile' && (
                        <input
                            type="tel"
                            id="mobile"
                            placeholder="Enter your mobile number"
                            {...register('mobile', {
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "*Invalid mobile number format",
                                },
                                required: {
                                    value: true,
                                    message: "Mobile number is required",
                                },
                            })}
                            disabled={otpSent}
                        />
                    )}

                    <VerifyButton
                        callBackFunction={onSendOtpClick}
                        disabled={!isValid || otpSent}
                        status={otpSent?(verified?'verified':(failed?'fail':'pending')):'sent OTP'}                   
                    />
                </div>

                {otpSent && !verified && (
                    <span className={styles.otpVerifyContainer}>
                        <label htmlFor="otp"></label>
                        <input
                            className={styles.otp}
                            type="text"
                            id="otp"
                            placeholder="Enter your OTP"
                            {...register('otp', {
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: "*Invalid OTP number format",
                                },
                                required: {
                                    value: true,
                                    message: "OTP is required",
                                },
                            })}
                        />
                        <VerifyButton callBackFunction={onVerifyOtp} disabled={!isValid}>Verify OTP</VerifyButton>
                    </span>
                )}

                {type === 'email' && <p>{errors.email?.message}</p>}
                {type === 'mobile' && <p>{errors.mobile?.message}</p>}

                <ArrowRight disabled={!verified} callBackFunction={after} />
            </form>
        </div>
    );
};

export default OtpVerificationBox;
