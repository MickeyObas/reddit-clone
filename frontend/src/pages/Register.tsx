import { useState } from "react";
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


const Register: React.FC = () => {

  const [step, setStep] = useState(1);
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
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(e);

    try{
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
        setStep(2);
      }

    }catch(err){
      console.error(err);
    }
  }

  if(step === 1){
    return (
      <div className="container mx-auto p-5 h-screen">
        <div className="flex flex-col h-full">
          <div className="pt-10">
            <h1 className="text-2xl font-bold text-center">Sign Up</h1>
            <p className="text-center my-3">By continuing, you agree to our <span className="text-blue-400">User Agreement</span> and acknowledge that you understand the <span className="text-blue-400">Privacy Policy</span>.</p>
            <div className="flex flex-col mt-4 gap-y-2">
              <div className="relative flex items-center p-2 border border-slate-300 rounded-full bg-white color text-slate-800">
                <div className="w-5 h-5 bg-red-400 rounded-full"></div>
                <p className="ms-3">Continue as Michael</p>
                <img
                  className="w-[18px] h-[18px] ms-auto" 
                  src={googleIcon} 
                  alt="Google Icon" />
              </div>
              <div className="flex items-center p-2 border border-slate-300 rounded-full bg-white color text-slate-800">
                <img 
                  className="w-[17px] h-[17px]"
                  src={appleIcon}
                  alt="Apple Icon"
                  />
                <p className="ms-[25%] font-medium">Continue With Apple</p>
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
            />
            <p className="mt-2.5">Already a redditor? <a className="text-blue-400" href="/login">Log in</a></p>
          </div>
          <Button 
            onClick={handleClick}
            disabled={!isValid}
            isValid={isValid}
            label="Continue"
            className="mt-auto"
          />
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