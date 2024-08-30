
inputCategory.map((item, index)=>{
    
    return(
    <>
        <div className={styles.inputs}>
            <label htmlFor={item}>{item.charAt(0).toUpperCase()}:</label>
            <input
                type="text"
                placeholder={`Enter your ${item}`}
                {...register(item, {
                    ...(item === 'adhar' && {
                    pattern: {
                        value: /^[0-9]{12}$/,
                        message: "*Invalid Adhar",
                    }
                    }),
                    ...(item === 'pancard' && {
                        pattern: {
                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                            message: "*Invalid Pancard",
                        }
                    }),
                    ...(item === 'gst' && {
                        pattern: {
                            value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/,
                            message: "Invalid GST Number",
                        }
                    }),
                    ...(item === 'bankAccount' && {
                        pattern: {
                            value: /^\d{6,20}$/, // Adjust this regex as needed
                            message: "Invalid Bank Account Number",
                        }
                    }),
                    ...(item === 'pinCode' && {
                        pattern: {
                            value: /^\d{6}$/, // Use the appropriate regex pattern based on your country
                            message: "Invalid Pincode",
                        }
                    }),

                    required: {
                    value: true,
                    message: `*${item} is required`,
                    }
                })}
                disabled={statuses[item] === 'verified'} // Disable the field if adharStatus is 'verified'
                
                {...item !== 'name' && (
                    <VerifyButton
                        status={statuses[item] ? statuses[item] : undefined}
                        disabled={!!errors[item] || !fieldValues[item] || statuses[item] === 'verified'}
                        callBackFunction={() => handleVerify(item)}
                    >
                        {item =='pinCode'?'fetch':'verify'}
                    </VerifyButton>
                )}
            />
        </div>
        {errors[item] && <p className={styles.err}>{errors[item].message}</p>}

    </>)
})