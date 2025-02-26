import { useState } from "react";
import { validateEmail } from "../utils";

// Assets
import exclamationIcon from '../assets/icons/exclamation-mark.png';
import appleIcon from '../assets/icons/apple-logo.png';
import googleIcon from '../assets/icons/google.png';
import checkIcon from '../assets/icons/check.png';


function Register() {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsValid(validateEmail(email));
  };

  const handleBlur = () => {
    if(!email){
      setError("Please fill out this field.");
    }else if(!email.includes("@")){
      setError(`Please include an '@' in the email address. '${email}' is missing an '@'.`)
    }else if(email[-1] === '@'){
      setError(`Please enter a part following '@'. '${email}' is incomplete.`);
    }else if(!validateEmail(email)){
      setError("Please enter a valid email address.");
    }else{
      setError("");
    }
  }

  const handleFocus = () => {
    setError("");
  }

  return (
    <div className="container mx-auto p-5 h-screen">
      <div className="flex flex-col h-full">
        <div className="pt-10">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
          <p className="text-center my-3">By continuing, you agree to our <span className="text-blue-400">User Agreement</span> and acknowledge that you understand the <span className="text-blue-400">Privacy Policy</span>.</p>
          <div className="flex flex-col mt-4 gap-y-2">
            <div className="relative flex items-center p-2 rounded-full bg-white color text-slate-800">
              <div className="w-5 h-5 bg-red-400 rounded-full"></div>
              <p className="ms-3">Continue as Michael</p>
              <img
                className="w-[18px] h-[18px] ms-auto" 
                src={googleIcon} 
                alt="Google Icon" />
            </div>
            <div className="flex items-center p-2 rounded-full bg-white color text-slate-800">
              <img 
                className="w-[17px] h-[17px]"
                src={appleIcon}
                alt="Apple Icon"
                />
              <p className="ms-[25%] font-medium">Continue With Apple</p>
            </div>
          </div>
          <div className="divider my-3">OR</div>
          <div>
            <div className="relative w-full">
              <input 
                type="email"
                placeholder="Email *" 
                className={`peer bg-[#2A3236] p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-white ${error && 'outline-deep-red outline-2'}`}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                />
                {error ? (<img 
                  src={exclamationIcon}
                  alt="Error icon"
                  className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
                  />) : (
                    (email && isValid) && (
                      <img 
                        src={checkIcon}
                        alt="Check icon"
                        className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                      />
                    )
                  )}
            </div>
              <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error}</p>
          </div>
          <p className="mt-2.5">Already a redditor? <a className="text-blue-400" href="/login">Log in</a></p>
        </div>
        <button
          disabled={!isValid} 
          className={`mt-auto text-center w-full bg-[#2A3236] py-3.5 rounded-full ${!isValid ? 'opacity-40' : 'bg-deep-red'}`}
          onClick={() => console.log("Clicked")}
          >Continue</button>
      </div>
    </div>
  )
}

export default Register;