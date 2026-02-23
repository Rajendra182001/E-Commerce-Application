// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';

// export default function LoginUser() {
//   let navigate=useNavigate();


//   const [user,setUser]=useState({
//     email:"",
//     password:""
//   });


//   const[emailError,setEmailError]=useState("");
//  const[isEmailValid,setisEmailValid]=useState(true);
//  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
//  const {email,password}=user;

//   const onInputChange =(e)=>{
//     setUser({...user,[e.target.name]:e.target.value});
//   }
//   useEffect(() => {
//     const isPasswordValid = password.trim() !== "" && password.length >= 5; 
//     setIsButtonDisabled(!(isEmailValid && isPasswordValid));
//   }, [email, password, isEmailValid]);
  
//   const onSubmit = async (e) => {
//     e.preventDefault(); 
//     let button = document.getElementById("button");
//     try {
//       const result = await axios.post("http://localhost:8080/login", user);
//         console.log(result.data); 
    
//       if (result.data === "success") {
//         navigate("/afterLogin");  
//       } else if(result.data === "Invalid password") {
//         alert('Invalid password')
//         navigate("/login");
//         button.disabled=true;
//       }else if(result.data==='Invalid email'){
//         button.disabled=true;
//       }
//       else{
//         navigate("/login")
//       }
//       if(result.data===null){
//         navigate("/")
//       }
//     } catch (error) {
//       console.error("Error during login:", error); 
//       alert("An error occurred while logging in. Please try again.");
//       button.disabled=true;
//     }
//   };
  

//   const checkEmail = async () => {
//     let emailId = document.getElementById("labelEmailId");
//     let btn = document.getElementById("button");
//     let emailInput = document.getElementById("email").value;
//     // If the email input is empty, disable the button and show a message
//     if (emailInput === "") {
//       setisEmailValid(false);
//       setEmailError("Please enter an email");
//       emailId.innerText = "Please enter an email";
//       emailId.style.color = "Red";
//       btn.disabled = true;
//       return;
//     }
  
//     const res = await axios.get(`http://localhost:8080/save/${email}`);
//     console.log(res.data + "name");
//     if (res.data.includes("Email has been Found")) {
//       setisEmailValid(true);
//       setEmailError("");
//       emailId.innerText = res.data;
//       emailId.style.color = "Green";
//       btn.disabled = false;
//     } else if (res.data.includes("Email Not Found")) {
//       setisEmailValid(false);
//       setEmailError("Email Not Found");
//       emailId.innerText = res.data;
//       emailId.style.color = "Red";
//       btn.disabled = true;
//     }
//   };
  
//   const checkPassword = () => {
//     let password = document.getElementById("password").value;
//     let btn = document.getElementById("button");
//     if (password === "" && password.length < 5) {
//       alert('blank password not be allowed')
//       btn.disabled = true;
//     } else {
//       btn.disabled = false;
//     }
//   };
    
//   return (
//     <div className="d-flex align-items-center " style={{ height: '70vh' }}>
//       <div className="container">
//         <div className="row ">
//           <h5 className="text-between text-capitalize"><i>Login Here:</i></h5>
//           <div className="col-md-6 offset-md-3 border bg-light rounded p-4 mt-2" style={{ height: '40vh' }}>
//             <form  onSubmit={(e)=>onSubmit(e)}>
//               <div className="align-self-center">
//                 <div className="mb-3">
//                   <label htmlFor="email" id='labelEmailId' className="form-label d-flex justify-content-start">
//                     Email:
//                   </label>
//                   <input
//                     type="text"
//                     name='email'
//                     id='email'
//                     className="form-control"
//                     placeholder="Enter your email"
//                     onBlur={checkEmail}
//                     onChange={(e)=>onInputChange(e)}
//                     value={email}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="password" className="form-label d-flex justify-content-start">
//                     Password:
//                   </label>
//                   <input
//                     type="password"
//                     name='password'
//                     id='password'
//                     className="form-control"
//                     placeholder="Enter a Password"
//                     value={password}
//                     onChange={(e)=>onInputChange(e)}
//                     onBlur={checkPassword}
//                   />
//                 </div>
//                 <div className="d-flex justify-content-sm-start">
//                   <button type="submit" id="button"   className="btn btn-sm btn-secondary rounded-pill mx-2" disabled={isButtonDisabled}>
//                     Login
//                   </button>
//                   <Link type='button' className='btn btn-danger rounded-pill btn-sm ' to={"/forgotPassword"}>ForgotPassword</Link>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
