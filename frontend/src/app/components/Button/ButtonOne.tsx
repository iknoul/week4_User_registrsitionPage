'use client'
import styles from './buttonOne.module.css'


interface ButtonProps {
    bgColor?: string;
    borderColor?: string;
    color?: string;
    callBackFunction?: Function;
    width?: string; 
    height?:string;
    children?: string;
    onlyMobile?:boolean;
    isSubmit?:boolean;
  }

// conditionally adding classes and  style it dynamically
const ButtonOne = ({isSubmit, onlyMobile, bgColor, borderColor, color, width, height, callBackFunction, children}: ButtonProps)=>{

    const className = `${isSubmit ? styles.isSubmit:''}${styles.button} ${onlyMobile ? styles.onlyMobile: ''} ${bgColor ? styles[`bg${bgColor}`] : ''} ${color ? styles[color] : ''} ${borderColor ? styles[borderColor] : ''}`;
    return(
    <div  onClick={callBackFunction ? ()=>{callBackFunction()} : () => {}} className = {className} style={{width:width,height:height }}>
        <p>{children}</p>
    </div>)
}

export default ButtonOne