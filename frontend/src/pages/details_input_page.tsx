import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/utils/axios';
import axios1 from 'axios';

import PrivateRouter from '@/app/components/PrivateRouter';
import AdressContainer from '@/app/components/AddressContainer/AdressContainer';
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
  ifsc: string;
};

type Status = "pending" | "verified" | "Retry" | undefined;
type StatusCategory = "name" | "aadhar" | "pancard" | "gst" | "accNo" | "pinCode" | 'ifsc';

const Details_input_page: React.FC = () => {
     
  const { register, handleSubmit, getValues, watch, formState:{errors}, setError } = useForm<FormValues>({ mode: 'onChange' });

  const inputCategory: (keyof FormValues)[] = ['name', 'aadhar', 'pancard', 'gst', 'accNo', 'pinCode'];
  const watchedValues = watch(inputCategory);

  const fieldValues = inputCategory.reduce((acc, key, index) => {
    acc[key] = watchedValues[index];
    return acc;
  }, {} as Record<string, string | undefined>);
  fieldValues['ifsc'] = watch('ifsc')

  const [adressData, setAdressData] = useState({})
  const [isAnyPending, setIsAnyPending] = useState(true);
  const [submiited, setSubmiited] = useState(false)
  const [statuses, setStatuses] = useState<{ [key in StatusCategory]?: Status }>({
    name: undefined,
    aadhar: undefined,
    pancard: undefined,
    gst: undefined,
    accNo: undefined,
    ifsc : 'verified',
    pinCode: undefined,
  });

  const initialDate = '2023-01-01'; // Example initial date in string format
  const [date, setDate] = useState<string>(initialDate);
  const [dateError, setDateError] = useState<string | undefined>(undefined);

  const updateStatus = (category: StatusCategory, status: Status) => {
    setStatuses(prevStatuses => ({
      ...prevStatuses,
      [category]: status,
    }));
  };

   // Function to check if any status is pending
  const onSubmit = async() => {
 
    if(new Date(initialDate).getTime() == new Date(date).getTime()){
      setDateError('* Date is required')
    }

       // Check each field and set errors if empty
    Object.entries(fieldValues).forEach(([field, value]) => {
        if (!value) {
          setError(field as any, { type: 'manual', message: `* ${field} is required` });
        }
    });

    statuses['ifsc'] = 'verified'
    const isAllVerified = Object.values(statuses).every(status => status === 'verified');

    if(true){
      const value = getValues('name')
      const token = sessionStorage.getItem('registrationToken')

      try 
      {
        // Example API call for sending verification
        const result = await axios.post(`/registration/verify-submit`, 
          {name: value,        
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setSubmiited(isAllVerified)

      } 
      catch (error)
      {


      }
    }
  };

  const onRetry = (field:string)=>{
    updateStatus(field as StatusCategory, undefined);
    return true
  }

  const handleVerify = async (field: keyof FormValues) => {

    updateStatus(field as StatusCategory, 'pending');

    const value = getValues(field);
    const ifscValue = getValues('ifsc');
    const token = sessionStorage.getItem('registrationToken')

    try 
    {
      // Example API call for sending verification
      const result = await axios.post(`/registration/verify-${field}`, 
        {[field]: value,
          ...(field === 'accNo' && { ifsc: ifscValue }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

      if (result.status==200)
      {
        console.log(result)
        if(field === 'pinCode'){
          setAdressData(result.data && result.data.data.PostOffice[0])
        }
        updateStatus(field as StatusCategory, 'verified');
      }
    } 
    catch (error)
    {

      updateStatus(field as StatusCategory, 'Retry');

      if (axios1.isAxiosError(error)) {
        if (error.response && error.response.status === 422) {
          setError(field, {
            type: 'manual',
            message: `* This ${field} value doesn't exist`
          });
        } 
        else {
          console.error('Error verifying:', error);
          setError(field, {
            type: 'manual',
            message: `* Error verifying`
          });
        }
      } 
      else 
      {
        console.error('Unknown error:', error);
        setError(field, {
          type: 'manual',
          message: `* Error verifying`
        });
      }
    }

    if (!value || errors[field]) {
      console.log(`${field} is invalid.`);
      setError(field, {
        type: 'manual',
        message: `* ${field} is invalid.`
      });
      return;
    }
  };

  const handleBlur = async (field: keyof FormValues)=>{
    updateStatus(field as keyof FormValues, undefined); // Reset status to undefined
  }
  
  useEffect(() => {
    const pending = Object.values(statuses).includes('pending');
    setIsAnyPending(pending);
   
  }, [statuses]);

  useEffect(()=>{
    
  })

  return (
    <PrivateRouter requiredSteps={{ step: 'mobileVerified' }}>
      <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form} ${isAnyPending ? styles.isAnyPending : ''}`} noValidate>
        <h3>Personal Details</h3>

        {inputCategory.map((item, index) => 
        {
          return (
            <React.Fragment key={index}>
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
                    validate:{
                     retry:  onRetry
                    }
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
                onBlur={()=>handleBlur}
                disabled={statuses[item as StatusCategory] === 'verified'} // Disable the field if status is 'verified'
              />
              
              {
                item === 'accNo' &&(
                  <input 
                    type='text' 
                    className={styles.ifsc}
                    placeholder='IFSC'
                    {
                      ...register('ifsc',{
                          pattern: {
                            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                            message: '*Invalid IFSC code',
                          },
                          required: {
                            value: true,
                            message: '*IFSC code is required',
                          },
                      })
                    }
                    disabled={statuses['accNo'] === 'verified'}  
                  />
                )
              }
              {item !== 'name' && (
                <VerifyButton
                  status={statuses[item] ? statuses[item] : undefined}
                  disabled={
                    !!errors[item] ||
                    !fieldValues[item] || 
                    statuses[item] === 'verified' ||
                    (item === 'accNo' && (!!errors.accNo || !!errors.ifsc))
                  }
                  callBackFunction={() => handleVerify(item)}
                >
                  {item === 'pinCode' ? 'Fetch' : 'Verify'}
                </VerifyButton>
              )}
            </div>

            {errors[item] && <p className={styles.err}>{errors[item]?.message}</p>}
            {item === 'accNo' && !errors['accNo'] && errors['ifsc'] && <p className={styles.err}>{errors['ifsc']?.message}</p>}
            
            </React.Fragment>
          );
        })}

        {
          statuses['pinCode'] == 'verified' &&(
            <AdressContainer {...adressData}/>
          )
        }
        
         <div className={`${styles.inputs}`}>              
              <label htmlFor="date">DOB:</label>
              <input
                  type='date' 
                  className={styles.ifsc}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    setDateError(undefined); // Clear error when the date changes
                  }}
              />
          </div>
         {dateError && <p className={styles.err}>{dateError}</p>}

        {/* Submit Button */}
        <ButtonOne  callBackFunction={onSubmit} isSubmit={submiited} width='100px' height='30px'>{submiited ? '':'Submit'}</ButtonOne>
      </form>
    </div>

    </PrivateRouter>
    );
};

export default Details_input_page;
