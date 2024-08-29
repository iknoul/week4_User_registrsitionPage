// import {BrowserRouter, Routes, Route} from 'react-router-dom'
// import { useState } from 'react'
// import {FirstContext} from '@/context/index'
// import PrivateRouter from './component/PrivateRouter'
// import Login from './auth/customer/Login'
// import SignUp from './auth/customer/Signup'
// import Home from './pages/Home'

// const App = ()=>{
//   const [token, setToken] = useState('')
//   return(
//   <BrowserRouter>
//     <FirstContext.Provider value={{}}>   

//       <Routes>
//         <Route element={<PrivateRouter roles={['seller','customer']}/>}>
//           <Route path='/' element={<Home/>}></Route>
//         </Route>
//         <Route path='/login' element={<Login/>}></Route>
//         <Route path='/signup' element={<SignUp/>}></Route>
//       </Routes>
//     </FirstContext.Provider>
//   </BrowserRouter>)
// }

// export default App