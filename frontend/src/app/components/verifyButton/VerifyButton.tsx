import styles from './verifyButton.module.css'

interface myProps{
    status?:'pending' | 'verified' | 'Retry' |'sent OTP' | undefined,
    disabled:boolean,
    callBackFunction ?: Function,
    children?: String

}

const VerifyButton:React.FC<myProps> = ({status, disabled, children, callBackFunction=()=>{}})=>{

    return(

    <div className={`
        ${styles.verifyButton} 
        ${status ? styles[status]:''} 
        ${disabled? styles.disabled:''}` 
        }
        aria-disabled={disabled}
        onClick={()=>{
            if(!disabled){
                callBackFunction()
            }
        }}
        >
        <p>{status!='verified'?(status ? status : children):''}</p>
    </div>)
}

export default VerifyButton