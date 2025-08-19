import { useRadioGroup } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AddUser() {
  let navigate=useNavigate()
  const [user,setUser]=useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    mobileNumber:"",
    city:""
  });

  const {firstName,lastName,email,password,mobileNumber,city}=user;

  const onInputChange =(e)=>{
    setUser({...user,[e.target.name]:e.target.value});
  }

  const onSubmit =async(e)=>{
    e.preventDefault();
   const result = await axios.post("http://localhost:8080/save",user);
   navigate("/")
  };

  const hanleCancel=()=>{
      setUser({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        mobileNumber:"",
        city:""
      });
  };
  return (
    <div className='container'>
      <div className='row'>
      <div className='col-md-6 offset-md-3 mt-5 border rounded p-4 mt-2 bg-light' style={{ height: '80vh' }}>
        <form onSubmit={(e)=>onSubmit(e)}>
          <div className="mb-2">
          <label htmlFor='firstName' className="form-label d-flex"><h6>First Name :</h6></label>
          <input type="text" className='form-control' placeholder='Enter Your Name' name='firstName' value={firstName} onChange={(e)=>onInputChange(e)}/>
          </div>
          <div className="mb-2">
          <label htmlFor='lastName' className="form-label d-flex"><h6>lastName :</h6></label>
          <input type="text" className='form-control' placeholder='Enter Your Name' name='lastName' value={lastName} onChange={(e)=>onInputChange(e)}/>
          </div>

          <div className="mb-2">
          <label htmlFor='email' className="form-label d-flex"><h6>Email :</h6></label>
          <input type="text" className='form-control' placeholder='abc@gmail.com' name='email' value={email} onChange={(e)=>onInputChange(e)}/>
          </div>
          <div className="mb-2">
          <label htmlFor='password' className="form-label d-flex"><h6>Password :</h6></label>
          <input type="password" className='form-control' placeholder='Type New Password' name='password' value={password} onChange={(e)=>onInputChange(e)} />
          </div>
          <div className="mb-2">
          <label htmlFor='mobileNumber' className="form-label d-flex"><h6>MobileNumber :</h6></label>
          <input type="text" className='form-control' placeholder='Type MobileNumber' name='mobileNumber' value={mobileNumber} onChange={(e)=>onInputChange(e)} />
          </div>
          <div className="mb-2">
          <label htmlFor='city' className="form-label d-flex"><h6>City :</h6></label>
          <input type="text" className='form-control' placeholder='Enter a City' name='city' value={city} onChange={(e)=>onInputChange(e)} />
          </div>
          <div className='d-flex justify-content-start gap-2'>
          <button type="submit" className='btn btn-sm btn-secondary btn rounded-pill'>Register</button>
          <Link type='button' className='btn btn-danger rounded-pill btn-sm ' to={"/"}>Cancel</Link>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
