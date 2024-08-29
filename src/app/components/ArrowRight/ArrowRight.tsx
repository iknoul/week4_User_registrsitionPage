import styles from './ArrowRight.module.css'

import Image from 'next/image'
import arrowRight from '@/../public/icons/arrowRight.svg'
import React from 'react';

interface myProps{
    disabled :boolean;
    callBackFunction:Function;
}
const ArrowRight:React.FC<myProps> = ({disabled, callBackFunction})=>{
    return(
    <div 
        className={`${styles.arrowRight} ${disabled ? styles.disabled: ''}`}
        onClick={()=>{
            if(!disabled){
                callBackFunction()
            }
        }}>
        <Image 
            src={arrowRight}
            alt='aroow right'
        />
    </div>)
}

export default ArrowRight