
import React from 'react';
import { useForm } from 'react-hook-form';


type FormValues = {
  username:string,
  email:string,
  channel: string
}
function VerificationForm() {

const form = useForm<FormValues>({
  // if we add thid default values then, we dont have to add the <form values> type 
  // defaultValues:{
  //   username:'',
  //   email: '',
  //   channel: ''
  // }

  // loding saved data
  defaultValues: async ()=>{
    const response = await fetch('http://localhost:8888/k')
    const data =  await response.json()
    console.log('hers' , data)
    return ({
      username : data[0].name,
      email : data[0].email,
      channel : data[0].website
    })
  }
})
const {register, control, handleSubmit, formState} = form
const {errors} =  formState;

const onSubmit = (data: FormValues) =>{
    console.log('form submitted', data)
}

const notYout = (sd:string)=>{
  return (sd.length>8)
}

  return (
    <div>
      <h1>registration form</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="username"> </label>
        <input
            type="text"
            id="username"
            {...register('username',{
                required:{
                    value: true,
                    message:"name is required"
                }
              })
            }    
        />
        <p>{errors.username?.message}</p>

        <label htmlFor="email"> </label>
        <input
            type="email"
            id="email"
            {...register('email',{
                pattern:{
                    value:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message:"invalid email format"
                },
                required:{
                  value: true,
                  message:"email is required"
              },
              validate: {
                notMe :(fieldValue)=>{
                  return fieldValue !== 'rhmanshamil@gmail.com' || "enter a different email"
                },
                notYou: (fieldValue)=>{
                  return notYout(fieldValue) || 'enter assassas'
                }
              }
            })
            }    
        />
        <p>{errors.email?.message}</p>
        <button>submit</button>

      </form>
    </div>
  );
}

export default VerificationForm;

