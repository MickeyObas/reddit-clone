// Assets
import { FormInput } from "../components/ui/FormInput";
import { Button } from "../components/ui/Button";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";


type ErrorState = {
  password1: string,
  password2: string
}


const CompleteRegistration: React.FC<{email: string}> = ({email}) => {
  const navigate = useNavigate();

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<ErrorState>({
    password1: '',
    password2: ''
  });
  const [isPassword1Valid, setIsPassword1Valid] = useState(false);
  const [isPassword2Valid, setIsPassword2Valid] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const handlePassword1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword1(e.target.value);
    setIsPassword1Valid(!!e.target.value);
  };

  const handlePassword1Blur = () => {
    if(!password1){
      setError((prev) => ({...prev, password1: "Please fill out this field."}))
    };
    if((password1 && password2) && password1 !== password2){
      setError((prev) => ({...prev, password2: "Passwords do not match"}))
    }
  };

  const handlePassword1Focus = () => {
    setError((prev) => ({...prev, password1: ''}));
  };

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

  const handleClick = async () => {

    try{
      setisLoading(true);
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
        if(error.password){
          setIsPassword1Valid(false);
          setError((prev) => ({...prev, password1: error.password[0]}))
        }
      }else{
        toast.success("Registration complete!");
        navigate('/login')
      }

    }catch(err){
      console.error(err);
    }finally{
      setisLoading(false);
    }
  }

  const isFormValid = isPassword1Valid && isPassword2Valid && (password1 === password2);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const passwordConfirmInputRef = useRef<HTMLInputElement>(null);
  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordConfirmInputRef.current?.focus();
    }
  };
  const handlePasswordConfirmKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordConfirmInputRef.current?.blur();
      handlePassword2Blur();
      if(isFormValid) handleClick();
    }
  };

  return (
    <div className="container mx-auto p-5 h-dvh md:h-screen max-w-lg lg:max-w-xl flex items-center justify-center overflow-hidden">
      <div className="flex flex-col h-full md:h-auto md:p-6 md:shadow-[0_0_7px_1px_rgba(0,0,0,0.25)] md:rounded-lg justify-between">
        <div className="pt-4 md:pt-0">
          <h1 className="text-2xl font-bold text-center">Complete Registration</h1>
          <p className="text-center my-3">Create a strong password for your new Reddit account.</p>
          <FormInput
            containerClassName="mt-10" 
            type="email"
            placeholder="Email *"
            disabled={true}
            defaultValue={email}
            isValid={true} // Is immutable and always valid
          />
          <FormInput 
            ref={passwordInputRef}
            type="password"
            placeholder="Password *"
            value={password1}
            onChange={handlePassword1Change}
            onBlur={handlePassword1Blur}
            onFocus={handlePassword1Focus}
            error={error.password1}
            isValid={isPassword1Valid}
            onKeyDown={handlePasswordKeyDown}
          />
          <FormInput 
            ref={passwordConfirmInputRef}
            type="password"
            placeholder="Confirm Password*"
            value={password2}
            onChange={handlePassword2Change}
            onBlur={handlePassword2Blur}
            onFocus={handlePassword2Focus}
            error={error.password2}
            isValid={isPassword2Valid}
            onKeyDown={handlePasswordConfirmKeyDown}
          />
          <p className="my-2.5">Already a redditor? <a className="text-blue-400" href="/login">Log in</a></p>
        </div>
        <div>
          <Button
            className={`mt-auto md:mt-4 ${(isFormValid && !isLoading) && 'cursor-pointer'}`} 
            onClick={handleClick}
            disabled={!isFormValid}
            label={`${isLoading ? 'Loading...' : 'Continue'}`}
            isValid={isFormValid}
          />
        </div>
      </div>
    </div>
  )
}

export default CompleteRegistration;