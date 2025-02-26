import { useState } from "react";
import { validateEmail } from "../utils";

// Assets
import exclamationIcon from '../assets/icons/exclamation-mark.png';
import appleIcon from '../assets/icons/apple-logo.png';
import googleIcon from '../assets/icons/google.png';
import checkIcon from '../assets/icons/check.png';


function Login() {

  const [emailorUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    emailorUsername: '',
    password: ''
  });
  const [isEmailOrUsernameValid, setIsEmailOrUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const isFormValid = isEmailOrUsernameValid && isPasswordValid;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOrUsername(e.target.value);
    setIsEmailOrUsernameValid(!!e.target.value);
  };

  const handleEmailOrUsernameBlur = () => {
    if(!emailorUsername){
      setError((prev) => ({...prev, emailorUsername: "Please fill out this field."}));
    }else{
      setError((prev) => ({...prev, emailorUsername: ""}));
    };
    setIsEmailOrUsernameValid(!!emailorUsername);
  }

  const handlEmailorUsernameFocus = () => {
    setError((prev) => ({...prev, emailorUsername: ""}));
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordValid(!!e.target.value);
  };

  const handlePasswordBlur = () => {
    if(!password){
      setError((prev) => ({...prev, password: "Please fill out this field."}))
    }
  };

  const handlePasswordFocus = () => {
    setError((prev) => ({...prev, password: ''}));
  };

  return (
    <div className="container mx-auto p-5 h-screen">
      <div className="flex flex-col h-full">
        <div className="pt-10">
          <h1 className="text-2xl font-bold text-center">Log In</h1>
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
          <div className="mb-1">
            <div className="relative w-full">
              <input 
                type="email"
                placeholder="Email *" 
                className={`peer bg-[#2A3236] p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-white ${error.emailorUsername && 'outline-deep-red outline-2'}`}
                value={emailorUsername}
                onChange={handleEmailChange}
                onBlur={handleEmailOrUsernameBlur}
                onFocus={handlEmailorUsernameFocus}
                />
                {error.emailorUsername ? (<img 
                  src={exclamationIcon}
                  alt="Error icon"
                  className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
                  />) : (
                    emailorUsername && (
                      <img 
                        src={checkIcon}
                        alt="Check icon"
                        className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                      />
                    )
                  )}
            </div>
              <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error.emailorUsername}</p>
          </div>
          <div>
            <div className="relative w-full">
              <input 
                type="password"
                placeholder="Password *" 
                className={`peer bg-[#2A3236] p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-white ${error.password && 'outline-deep-red outline-2'}`}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                onFocus={handlePasswordFocus}
                />
                {error.password ? (<img 
                  src={exclamationIcon}
                  alt="Error icon"
                  className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
                  />) : (
                    password && (
                      <img 
                        src={checkIcon}
                        alt="Check icon"
                        className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                      />
                    )
                  )}
            </div>
              <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error.password}</p>
          </div>
          <p className="mt-2.5">New to Reddit? <a className="text-blue-400" href="/register">Sign Up</a></p>
        </div>
        <button
          disabled={(!isFormValid)} 
          className={`mt-auto text-center w-full bg-[#2A3236] py-3.5 rounded-full ${(!isFormValid) ? 'opacity-40' : 'bg-deep-red'}`}
          onClick={() => console.log("Clicked")}
          >Continue</button>
      </div>
    </div>
  )
}

export default Login;

/* 
else if(!email.includes("@")){
  setError((prev) => ({...prev, email: `Please include an '@' in the email address. '${email}' is missing an '@'.`}));
}else if(email[-1] === '@'){
  setError((prev) => ({...prev, email: `Please enter a part following '@'. '${email}' is incomplete.`}));
}else if(!validateEmail(email)){
  setError((prev) => ({...prev, email: "Please enter a valid email address."}));
}*/