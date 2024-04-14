//import * as React from "react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Register() {
 
    const [userType, setUserType] = useState() //whether user is employer or worker
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [phoneNum, setPhoneNum] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:5173/register", { userType, firstName, lastName, phoneNum,email, password })
        .then(result => {console.log(result)
        navigate("/login")
        })
        .catch(err => console.log(err))
    }

  return (
    <div className="flex flex-col pb-20 bg-white">
      <div className="flex flex-col items-center px-16 pt-20 w-full bg-blue-600 max-md:px-5 max-md:max-w-full">
        <div className="flex z-10 flex-col mb-0 max-w-full w-[705px] max-md:mb-2.5">
          <div className="text-2xl font-black text-white max-md:max-w-full">
            Skillmatch
          </div>
          <div className="flex flex-col px-20 py-16 mt-16 bg-white rounded-xl shadow-sm max-md:px-5 max-md:mt-10 max-md:max-w-full">
            <div className="self-center text-2xl font-bold text-black">
              Sign Up
            </div>
            <div className="self-center mt-3.5 text-base text-black">
              Create an account to get started!
            </div>
            <form onSubmit={handleSubmit}></form>
              <div className="mt-16 mr-2.5 text-xs text-blue-600 max-md:mt-10 max-md:max-w-full">
                Are you signing up as an employer or a worker?
              </div>
              <div className="mt-2.5 mr-2.5 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                  <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col grow text-black max-md:mt-4">
                      <div className="flex gap-5 text-xs whitespace-nowrap max-md:pr-5">
                        <div className="flex gap-2.5">
                          <div className="shrink-0 bg-white rounded-md border border-solid border-zinc-500 h-[15px] w-[15px]" />
                          <div>Employer</div>
                        </div>
                        <div className="flex gap-2.5">
                          <div className="shrink-0 bg-white rounded-md border border-solid border-zinc-500 h-[15px] w-[15px]" />
                          <div className="my-auto">Worker</div>
                        </div>
                      </div>
                      <div className="mt-7 text-base">First Name</div>
                      <div className="shrink-0 mt-2.5 h-12 bg-white rounded-md border border-solid border-zinc-500" />
                    </div>
                  </div>
                  <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col grow mt-11 text-base text-black max-md:mt-10">
                      <div>Last Name</div>
                      <div className="shrink-0 mt-2.5 h-12 bg-white rounded-md border border-solid border-zinc-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mr-2.5 text-base text-black max-md:max-w-full">
                Phone Number
              </div>
              <div className="shrink-0 mt-2.5 mr-2.5 max-w-full h-12 bg-white rounded-md border border-solid border-zinc-500 w-[526px]" />
              <div className="mt-4 mr-2.5 text-base text-black max-md:max-w-full">
                Email
              </div>
              <div className="shrink-0 mt-1.5 mr-2.5 max-w-full h-12 bg-white rounded-md border border-solid border-zinc-500 w-[526px]" />
              <div className="mt-4 mr-2.5 text-base text-black max-md:max-w-full">
                Password
              </div>
              <div className="shrink-0 mt-2.5 mr-2.5 max-w-full h-12 bg-white rounded-md border border-solid border-zinc-500 w-[526px]" />
              <div className="justify-center items-center px-16 py-2.5 mt-11 mr-2.5 text-lg font-semibold text-white bg-blue-600 rounded-md max-md:px-5 max-md:mt-10 max-md:max-w-full">
                Sign In
              </div>
            <form onSubmit={handleSubmit}></form>

            <div className="mt-4 mr-2.5 mb-3 text-base text-blue-600 max-md:max-w-full">
              Already have an account?
              <span className="text-blue-600"> Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;