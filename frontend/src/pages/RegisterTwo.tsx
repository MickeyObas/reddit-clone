import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils";

// Assets
import exclamationIcon from '../assets/icons/exclamation-mark.png';
import checkIcon from '../assets/icons/check.png';

import { BACKEND_URL } from "../config";
import { useAuth } from "../contexts/AuthContext";

type ErrorState = {
  email: string,
  password1: string,
  password2: string
}


const RegisterTwo = (): JSX.Element => {
  const navigate = useNavigate();
  const { setIsRegistered } = useAuth();

  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<ErrorState>({
    email: '',
    password1: '',
    password2: ''
  });
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPassword1Valid, setIsPassword1Valid] = useState(false);
  const [isPassword2Valid, setIsPassword2Valid] = useState(false);


  // Email handlers 

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailValid(validateEmail(email));
  };

  const handleEmailBlur = () => {
    if(!email){
      setError((prev) => ({...prev, email: "Please fill out this field."}));
    }else if(!email.includes("@")){
      setError((prev) => ({...prev, email: `Please include an '@' in the email address. '${email}' is missing an '@'.`}));
    }else if(email[-1] === '@'){
      setError((prev) => ({...prev, email: `Please enter a part following '@'. '${email}' is incomplete.`}));
    }else if(!validateEmail(email)){
      setError((prev) => ({...prev, email: "Please enter a valid email address."}));
    }else{
      setError((prev) => ({...prev, email: ""}));
    }
  }

  const handleEmailFocus = () => {
    setError((prev) => ({...prev, email: ""}));
  };


  // Password 1 handlers

  const handlePassword1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword1(e.target.value);
    setIsPassword1Valid(!!e.target.value);
  };

  const handlePassword1Blur = () => {
    if(!password1){
      setError((prev) => ({...prev, password1: "Please fill out this field."}))
    }
  };

  const handlePassword1Focus = () => {
    setError((prev) => ({...prev, password1: ''}));
  };


  // Password 2 handlers

  const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword2(e.target.value);
    setIsPassword2Valid(!!e.target.value);
  };

  const handlePassword2Blur = () => {
    if(!password2){
      setError((prev) => ({...prev, password2: "Please fill out this field."}))
    };
    if(password2 !== password1){
      setError((prev) => ({...prev, password2: "Passwords do not match"}))
    }
  };

  const handlePassword2Focus = () => {
    setError((prev) => ({...prev, password2: ''}));
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(e);

    // Hit Register endpoint
    try{
      const response = await fetch(`${BACKEND_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password: password1,
          password2
        })
      });

      if(!response.ok){
        const error = await response.json();
        if(error.email){
          setIsEmailValid(false);
          setError((prev) => ({...prev, email: error.email[0]}))
        }
        if(error.password){
          setIsPassword1Valid(false);
          setError((prev) => ({...prev, password1: error.password[0]}))
        }
      }else{
        const data = await response.json();
        console.log(data);
        alert("Registration complete!");
        // navigate('/')
        setIsRegistered(true);
      }

    }catch(err){
      console.error(err);
    }
  }

  const isFormValid = isEmailValid && isPassword1Valid && isPassword2Valid && (password1 === password2);

  return (
    <div className="container mx-auto p-5 h-screen">
      <div className="flex flex-col h-full">
        <div className="pt-10">
          <h1 className="text-2xl font-bold text-center">Complete Registration</h1>
          <p className="text-center my-3">Create a strong password for your new Reddit account.</p>
          <div className="mt-10">
            <div className="relative w-full">
              <input 
                type="email"
                placeholder="Email *" 
                className={`peer bg-[#2A3236] p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-white ${error.email && 'outline-deep-red outline-2'}`}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                onFocus={handleEmailFocus}
                />
                {error.email ? (<img 
                  src={exclamationIcon}
                  alt="Error icon"
                  className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
                  />) : (
                    (email && isEmailValid) && (
                      <img 
                        src={checkIcon}
                        alt="Check icon"
                        className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                      />
                    )
                  )}
            </div>
              <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error.email}</p>
          </div>
          <div>
            <div className="relative w-full">
              <input 
                type="password"
                placeholder="Password *" 
                className={`peer bg-[#2A3236] p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-white ${error.password1 && 'outline-deep-red outline-2'}`}
                value={password1}
                onChange={handlePassword1Change}
                onBlur={handlePassword1Blur}
                onFocus={handlePassword1Focus}
                />
                {error.password1 ? (<img 
                  src={exclamationIcon}
                  alt="Error icon"
                  className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
                  />) : (
                    (password1 && isPassword1Valid) && (
                      <img 
                        src={checkIcon}
                        alt="Check icon"
                        className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                      />
                    )
                  )}
            </div>
              <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error.password1}</p>
          </div>
          <div>
            <div className="relative w-full">
              <input 
                type="password"
                placeholder="Password Confirmation *" 
                className={`peer bg-[#2A3236] p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-white ${error.password2 && 'outline-deep-red outline-2'}`}
                value={password2}
                onChange={handlePassword2Change}
                onBlur={handlePassword2Blur}
                onFocus={handlePassword2Focus}
                />
                {error.password2 ? (<img 
                  src={exclamationIcon}
                  alt="Error icon"
                  className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
                  />) : (
                    (password2 && isPassword2Valid) && (
                      <img 
                        src={checkIcon}
                        alt="Check icon"
                        className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                      />
                    )
                  )}
            </div>
              <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error.password2}</p>
          </div>
          <p className="mt-2.5">Already a redditor? <a className="text-blue-400" href="/login">Log in</a></p>
        </div>
        <button
        onClick={handleClick}
          disabled={!isFormValid} 
          className={`mt-auto text-center w-full bg-[#2A3236] py-3.5 rounded-full ${!isFormValid ? 'opacity-40' : 'bg-deep-red'}`}
          >Continue</button>
      </div>
    </div>
  )
}

export default RegisterTwo;