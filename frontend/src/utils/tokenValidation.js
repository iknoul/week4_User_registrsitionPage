import {jwtDecode} from 'jwt-decode'

export const getId=()=>{
    try {
        const decoded = jwtDecode(localStorage.getItem('token'))
        return decoded.id
    } catch (error) {
        return null
    }
}
export const getRole=()=>{
    try {
        const decoded = jwtDecode(localStorage.getItem('token'))
        return decoded.role
    } catch (error) {
        return null
    }
}
export const isValidRole=(roleArr)=>{

    return roleArr.includes(getRole())
}

export const isValidToken=()=>{
    try {
        const decoded = jwtDecode(localStorage.getItem('token'))
        const exp = decoded.exp
        const currentDate = Date.now()/1000
        return exp>currentDate
        
    } catch (error) {
        console.log(error)

    }
}