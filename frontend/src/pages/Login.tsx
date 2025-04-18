import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import appleIcon from '../assets/icons/apple-logo.png';
import googleIcon from '../assets/icons/google.png';
import { BACKEND_URL } from "../config";
import { FormInput } from "../components/ui/FormInput";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

// Types
type ErrorState = {
  general: string,
  emailOrUsername: string,
  password: string
}


const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorState>({
    general: '',
    emailOrUsername: '',
    password: ''
  });
  const [isEmailOrUsernameValid, setIsEmailOrUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const isFormValid = isEmailOrUsernameValid && isPasswordValid;

  const handleEmailOrUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOrUsername(e.target.value);
    setIsEmailOrUsernameValid(!!e.target.value);
  };

  const handleEmailOrUsernameBlur = () => {
    if(!emailOrUsername){
      setError((prev) => ({...prev, emailOrUsername: "Please fill out this field."}));
    }else{
      setError((prev) => ({...prev, emailOrUsername: ""}));
    };
    setIsEmailOrUsernameValid(!!emailOrUsername);
  }

  const handlEmailorUsernameFocus = () => {
    setError((prev) => ({...prev, emailOrUsername: ""}));
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

  const handleContinue = async () => {
    // Clear general error
    setError((prev) => ({...prev, general: ''}))

    // Resend confirmation email
    try{
      const response = await fetch(`${BACKEND_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: emailOrUsername,
          password: password
        })
      });

      if(!response.ok){
        const error = await response.json();
        setError((prev) => ({...prev, general: error.error}))
        console.log(error);
      }else{
        const data = await response.json();
        // Store credentials 
        login(data);
        navigate('/');
        
      }
    }catch(err){
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto p-5 h-screen">
      <div className="flex flex-col h-full">
        <div className="pt-10">
          <h1 className="text-2xl font-bold text-center">Log In</h1>
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
          <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error.general}</p>
          <FormInput
            containerClassName="mb-1"
            type="email"
            placeholder="Email or Username *"
            value={emailOrUsername}
            error={error.emailOrUsername}
            isValid={isEmailOrUsernameValid}
            onChange={handleEmailOrUsernameChange}
            onBlur={handleEmailOrUsernameBlur}
            onFocus={handlEmailorUsernameFocus}
          />
          <FormInput 
            type="password"
            placeholder="Password *"
            value={password}
            error={error.password}
            isValid={isPasswordValid}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            onFocus={handlePasswordFocus}
          />
          <p className="mt-2.5">New to Reddit? <a className="text-blue-400" href="/register">Sign Up</a></p>
        </div>
        <Button 
          onClick={handleContinue}
          disabled={!isFormValid}
          isValid={isFormValid}
          label="Continue"
          className="mt-auto"
        />
      </div>
    </div>
  )
}

export default Login;