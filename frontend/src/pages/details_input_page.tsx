import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/utils/axios';

import ButtonOne from '@/app/components/Button/ButtonOne';
import VerifyButton from '@/app/components/verifyButton/VerifyButton';
import styles from './styles/details_input_page.module.css';

type FormValues = {
  name: string;
  aadhar: string;
  pancard: string;
  gst: string;
  accNo: string;
  pinCode: string;
};

type Status = "pending" | "verified" | "fail" | undefined;
type StatusCategory = "name" | "aadhar" | "pancard" | "gst" | "accNo" | "pinCode";

const Details_input_page: React.FC = () => {
  const { register, handleSubmit, getValues, watch, formState } = useForm<FormValues>({ mode: 'onChange' });
  const { errors } = formState;

  const inputCategory: (keyof FormValues)[] = ['name', 'aadhar', 'pancard', 'gst', 'accNo', 'pinCode'];
  const watchedValues = watch(inputCategory);

  // Convert watchedValues to an object if needed
  const fieldValues = inputCategory.reduce((acc, key, index) => {
    acc[key] = watchedValues[index];
    return acc;
  }, {} as Record<string, string | undefined>);

  const [statuses, setStatuses] = useState<{ [key in StatusCategory]?: Status }>({
    name: undefined,
    aadhar: undefined,
    pancard: undefined,
    gst: undefined,
    accNo: undefined,
    pinCode: undefined
  });

  const updateStatus = (category: StatusCategory, status: Status) => {
    setStatuses(prevStatuses => ({
      ...prevStatuses,
      [category]: status,
    }));
  };

  const onSubmit = (data: FormValues) => {
    console.log('Form Data:', data);
    // Handle form submission if needed
  };

  const handleVerify = async (field: keyof FormValues) => {
    const value = getValues(field);

    try {
      // Example API call for sending verification
      const result = await axios.post(`/auth/verify-${field}`, { [field]: value });
      if (result) {
        updateStatus(field as StatusCategory, 'verified');
      }
    } catch (error) {
      console.error('Error verifying:', error);
    }

    if (!value || errors[field]) {
      console.log(`${field} is invalid.`);
      return;
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <h3>Personal Details</h3>

        {inputCategory.map((item, index) => 
        {

          return (
            <>
            <div
              className={`${styles.inputs} ${statuses[item as StatusCategory] === 'verified'?styles.verified : ''}`}     
              key={index}>
                
              <label htmlFor={item}>{item.charAt(0).toUpperCase() + item.slice(1)}:</label>
              <input
                type="text"
                placeholder={`Enter your ${item}`}

                {...register(item, {

                  ...(item === 'name' && {
                    pattern: {
                      value: /^[A-Za-z][A-Za-z\s'-]{1,}[A-Za-z]$/,
                      message: "*Invalid Name",
                    },
                  }),

                  ...(item === 'aadhar' && {
                    pattern: {
                      value: /^[0-9]{12}$/,
                      message: "*Invalid Adhar",
                    },
                  }),

                  ...(item === 'pancard' && {
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "*Invalid Pancard",
                    },
                  }),

                  ...(item === 'gst' && {
                    pattern: {
                      value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/,
                      message: "Invalid GST Number",
                    },
                  }),

                  ...(item === 'accNo' && {
                    pattern: {
                      value: /^\d{6,20}$/, // Adjust this regex as needed
                      message: "Invalid Bank Account Number",
                    },
                  }),

                  ...(item === 'pinCode' && {
                    pattern: {
                      value: /^\d{6}$/, // Use the appropriate regex pattern based on your country
                      message: "Invalid Pincode",
                    },
                  }),
                  required: {
                    value: true,
                    message: `*${item.charAt(0).toUpperCase() + item.slice(1)} is required`,
                  },
                })}

                disabled={statuses[item as StatusCategory] === 'verified'} // Disable the field if status is 'verified'
              />
              {item !== 'name' && (
                <VerifyButton
                  status={statuses[item] ? statuses[item] : undefined}
                  disabled={!!errors[item] || !fieldValues[item] || statuses[item] === 'verified'}
                  callBackFunction={() => handleVerify(item)}
                >
                  {item === 'pinCode' ? 'Fetch' : 'Verify'}
                </VerifyButton>
              )}
            </div>

            {errors[item] && <p className={styles.err}>{errors[item]?.message}</p>}
            
            </>
          );
        })}

        {/* Submit Button */}
        <ButtonOne width='100px' height='30px'>Submit</ButtonOne>
      </form>
    </div>
  );
};

export default Details_input_page;
