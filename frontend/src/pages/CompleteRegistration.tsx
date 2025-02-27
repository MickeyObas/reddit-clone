import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils";
import { BACKEND_URL } from "../config";

// Assets
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";


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

  // Password 1 handlers

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
        if(error.password){
          setIsPassword1Valid(false);
          setError((prev) => ({...prev, password1: error.password[0]}))
        }
      }else{
        const data = await response.json();
        console.log(data);
        alert("Registration complete!");
        navigate('/login')
        // setIsRegistered(true);
      }

    }catch(err){
      console.error(err);
    }
  }

  const isFormValid = isPassword1Valid && isPassword2Valid && (password1 === password2);

  return (
    <div className="container mx-auto p-5 h-screen">
      <div className="flex flex-col h-full">
        <div className="pt-10">
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
            type="password"
            placeholder="Password *"
            value={password1}
            onChange={handlePassword1Change}
            onBlur={handlePassword1Blur}
            onFocus={handlePassword1Focus}
            error={error.password1}
            isValid={isPassword1Valid}
          />
          <FormInput 
            type="password"
            placeholder="Confirm Password*"
            value={password2}
            onChange={handlePassword2Change}
            onBlur={handlePassword2Blur}
            onFocus={handlePassword2Focus}
            error={error.password2}
            isValid={isPassword2Valid}
          />
          <p className="mt-2.5">Already a redditor? <a className="text-blue-400" href="/login">Log in</a></p>
        </div>
        <Button
          className="mt-auto" 
          onClick={handleClick}
          disabled={!isFormValid}
          label="Continue"
          isValid={isFormValid}
        />
      </div>
    </div>
  )
}

export default CompleteRegistration;