import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import VerifyButton from '@/app/components/verifyButton/VerifyButton';
import styles from './styles/details_input_page.module.css'


// const Details_input_page = () => {
//   const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

//   const onSubmit = data: => {
//     console.log(data); // Handle form submission if needed
//   };

//   const handleVerify = async (fieldName) => {
//     const isValid = await trigger(fieldName);
//     if (isValid) {
//       const fieldValue = getValues(fieldName);
//       // Make API call with the specific field value
//       console.log(`${fieldName} is valid:`, fieldValue);
//       // Call your API here
//     } else {
//       console.log(`${fieldName} is invalid`);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {/* Example Input Field 1 */}
//       <div>
//         <input
//           type="text"
//           placeholder="Enter Email"
//           {...register('email', {
//             required: 'Email is required',
//             pattern: {
//               value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
//               message: 'Invalid email address',
//             },
//           })}
//         />
//         <button type="button" onClick={() => handleVerify('email')}>Verify Email</button>
//         {errors.email && <p>{errors.email.message}</p>}
//       </div>

//       {/* Example Input Field 2 */}
//       <div>
//         <input
//           type="text"
//           placeholder="Enter Phone Number"
//           {...register('phoneNumber', {
//             required: 'Phone number is required',
//             pattern: {
//               value: /^[0-9]{10}$/,
//               message: 'Invalid phone number',
//             },
//           })}
//         />
//         <button type="button" onClick={() => handleVerify('phoneNumber')}>Verify Phone</button>
//         {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
//       </div>

//       {/* Add more fields as needed */}
//     </form>
//   );
// };

interface FormValues {
  name: string;
  adhar: string;
  // Add more fields as needed
};

const Details_input_page: React.FC = () => {
  
  const { control, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>();

  // const []
  const onSubmit = (data: FormValues) => {
    console.log('Form Data:', data);
    // Handle form submission if needed
  };

  const handleVerify = async (field: keyof FormValues) => {
    const value = getValues(field);

    // Validate the specific field before making the API call
    if (!value || errors[field]) {
      console.log(`${field} is invalid.`);
      return;
    }

    try {
      // Make your API call here with the validated field value
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
      const result = await response.json();
      console.log(`${field} verified successfully:`, result);
    } catch (error) {
      console.error(`Failed to verify ${field}:`, error);
    }
  };

  return (
    <div className={styles.conatainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email Field */}
      <div>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Email is required', pattern: /^\S+@\S+$/i }}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Email"
            />
          )}
        />
        <button type="button" onClick={() => handleVerify('name')}>Verify Email</button>
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      {/* Phone Number Field */}
      <div>
        <Controller
          name="adhar"
          control={control}
          rules={{ required: 'Phone number is required', pattern: /^\d{10}$/ }}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Phone Number"
            />
          )}
        />
        <button type="button" onClick={() => handleVerify('adhar')}>Verify Phone Number</button>
        {errors.adhar && <p>{errors.adhar.message}</p>}
      </div>

      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};


export default Details_input_page;
