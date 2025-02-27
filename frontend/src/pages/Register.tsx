import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils";

// Assets
import exclamationIcon from '../assets/icons/exclamation-mark.png';
import appleIcon from '../assets/icons/apple-logo.png';
import googleIcon from '../assets/icons/google.png';
import checkIcon from '../assets/icons/check.png';
import { BACKEND_URL } from "../config";
import EmailVerify from "./VerifyEmail";
import RegisterTwo from "./CompleteRegistration";
import VerifyEmail from "./VerifyEmail";
import CompleteRegistration from "./CompleteRegistration";


const Register: React.FC = () => {

  const navigate = useNavigate();

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

    // Send confirmation code
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
      }else{
        const data = await response.json();
        console.log("Email sent", data);
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
          onClick={handleClick}
            disabled={!isValid} 
            className={`mt-auto text-center w-full bg-[#2A3236] py-3.5 rounded-full ${!isValid ? 'opacity-40' : 'bg-deep-red'}`}
            >Continue</button>
        </div>
      </div>
    )
  }else if(step === 2){
    return <VerifyEmail email={email} setStep={setStep} />
  }else if(step === 3){
    return <CompleteRegistration />
  }
}

export default Register;