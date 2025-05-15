import { useRef, useState } from "react";
import { validateEmail } from "../utils";

// Assets
import appleIcon from '../assets/icons/apple-logo.png';
import googleIcon from '../assets/icons/google.png';
import { BACKEND_URL } from "../config";
import VerifyEmail from "./VerifyEmail";
import CompleteRegistration from "./CompleteRegistration";

// Components
import { Button } from "../components/ui/Button";
import { FormInput } from "../components/ui/FormInput";
import toast from "react-hot-toast";

// import { useGoogleLogin, CodeResponse } from '@react-oauth/google';


const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSendingEmail, setisSendingEmail] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValid(validateEmail(newEmail));
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
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e);

    try{
      setisSendingEmail(true);
      const response = await fetch(`${BACKEND_URL}/send-confirmation-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      });

      if(!response.ok){
        const error = await response.json();
        console.log(error);
        if(error.error){
          setError(error.error);
        }
      }else{
        toast.success("A verification code has been sent to your email.")
        setStep(2);
      }

    }catch(err){
      console.error(err);
    }finally{
      setisSendingEmail(false);
    }
  }

  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!emailInputRef.current?.value) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      emailInputRef.current?.blur();
      handleBlur();
      if(validateEmail(emailInputRef.current?.value)){
        handleClick(e);
      }
    }
  };

  /*
  const handlegoogleLoginSuccess = async (credentialsResponse: CodeResponse) => {
    console.log(credentialsResponse);
     try {
      const response = await fetch(`${BACKEND_URL}/google-register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'auth_code': credentialsResponse.code})
      });

      if(!response.ok){
        console.log("Response is not okay.");
        const error = await response.json();
        setError(error.error);
      }else{
        const data = await response.json();
        console.log(data);
        navigate("/login");
      }
    }catch(err){
        console.log(err);
    }
  }

  const handleGoogleLoginError = () => {
    console.log("Google login failed");
  }

  const googleLogin = useGoogleLogin({
    onSuccess: handlegoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: 'auth-code',
  })
  */

  if(step === 1){
    return (
      <div className="relative max-w-lg mx-auto p-5 h-dvh md:h-screen flex flex-col md:items-center md:justify-center overflow-hidden">
        <div className="flex flex-col h-full md:h-auto md:p-6 md:shadow-[0_0_7px_1px_rgba(0,0,0,0.25)] md:rounded-lg">
          <div className="pt-4 md:pt-0">
            <h1 className="text-2xl font-bold text-center">Sign Up</h1>
            <p className="text-center my-3">By continuing, you agree to our <span className="text-blue-400">User Agreement</span> and acknowledge that you understand the <span className="text-blue-400">Privacy Policy</span>.</p>
            <p className="text-center text-xs">Registration via Apple & Google is currently not available</p>
            <div className="flex flex-col mt-4 gap-y-2 hover:cursor-not-allowed">
            <div 
              // onClick={googleLogin}
              className="relative flex items-center justify-between p-2 border border-slate-300 rounded-full bg-white color text-slate-800">
              <div className="w-5 h-5 bg-red-400 rounded-full"></div>
              <p className="text-slate-400">Continue with Google</p>
              <img
                className="w-[18px] h-[18px]" 
                src={googleIcon} 
                alt="Google Icon" />
            </div>
            <div className="relative flex items-center justify-between p-2 border border-slate-300 rounded-full bg-white color text-slate-800">
              <div className="w-5 h-5 bg-red-400 rounded-full"></div>
              <p className="text-slate-400">Continue with Apple</p>
              <img
                className="w-[18px] h-[18px]" 
                src={appleIcon} 
                alt="Apple Icon" />
            </div>
          </div>
            <div className="divider my-3">OR</div>
            <FormInput 
              type="email"
              placeholder="Email *"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              error={error}
              isValid={isValid}
              ref={emailInputRef}
              onKeyDown={handleEmailKeyDown}
            />
            <p className="my-2.5">Already a redditor? <a className="text-blue-400" href="/login">Log in</a></p>
          </div>
          <div className="mt-auto">
            <Button 
            onClick={handleClick}
            disabled={!isValid}
            isValid={isValid}
            label={`${isSendingEmail ? 'Loading...' : 'Continue'}`}
            className="mt-2 md:mt-4 cursor-pointer"
          />
          </div>
        </div>
      </div>
    )
  }else if(step === 2){
    return <VerifyEmail email={email} setStep={setStep} />
  }else if(step === 3){
    return <CompleteRegistration email={email} />
  }
}

export default Register;