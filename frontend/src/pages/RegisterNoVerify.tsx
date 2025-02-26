import { JSX, useState } from "react";

// Assets
import exclamationIcon from '../assets/icons/exclamation-mark.png';
import checkIcon from '../assets/icons/check.png';

// Types
type ErrorState = {
  username: string,
  password: string
}


const RegisterNoVerify = (): JSX.Element => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorState>({
    username: '',
    password: ''
  });

  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const isFormValid = isUsernameValid && isPasswordValid;

  // Username handlers
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    // TODO: Check if username is taken or not
    setIsUsernameValid(!!e.target.value);
  };

  const handleUsernameBlur = () => {
    if(!username){
      setError((prev) => ({...prev, username: "Please fill out this field"}))
    }
  }
  const handleUsernameFocus = () => {
    setError((prev) => ({...prev, username: ''}));
  }

  // Password handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordValid(!!e.target.value);
  }

  const handlePasswordBlur = () => {
    if(!password){
      setError((prev) => ({...prev, password: "Please fill out this field"}))
    }
  }
  
  const handlePasswordFocus = () => {
    setError((prev) => ({...prev, password: ''}));
  }

  return (
    <div className="container mx-auto p-5 h-screen">
      <div className="flex flex-col h-full">
        <div className="pt-10">
          <h1 className="text-2xl font-bold text-center mb-4">Create your username and password</h1>
          <p className="text-center">Reddit is anonymous, so your username is what you'll go by here. Choose wisely&#8212;because once you get a name, you can't change it.</p>
          <div className="mt-7">
            <div className="relative w-full">
              <input 
                type="text"
                placeholder="Username*" 
                className={`peer bg-[#2A3236] p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-white ${error.username && 'outline-deep-red outline-2'}`}
                value={username}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                onFocus={handleUsernameFocus}
                />
                {error.username ? (<img 
                  src={exclamationIcon}
                  alt="Error icon"
                  className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
                  />) : (
                    (username && isUsernameValid) && (
                      <img 
                        src={checkIcon}
                        alt="Check icon"
                        className="peer-focus:hidden absolute w-5 top-1/2 -translate-y-1/2 right-[1rem] opacity-60"
                      />
                    )
                  )}
            </div>
            <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error.username}</p>
          </div>
          <div className="mt-1">
            <div className="relative w-full">
              <input 
                type="password"
                placeholder="Password*" 
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
                    (password && isPasswordValid) && (
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
      </div>
      <div className="mt-auto">
        <button
          disabled={!isFormValid} 
          className={`mt-auto text-center w-full bg-[#2A3236] py-3.5 rounded-full ${!isFormValid ? 'opacity-40' : 'bg-deep-red'}`}
          onClick={() => console.log("Clicked")}
          >Continue</button>
      </div>            
    </div>
  </div>
  )
}

export default RegisterNoVerify;