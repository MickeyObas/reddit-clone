import { useState } from "react";


const EmailVerify = () => {

  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // I want only numbers - but don't want to use input:number
    if (/^\d*$/.test(inputValue)) {
      setCode(inputValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if(code && code.length < 6){
      setError(`Please lengthen this text to 6 characters or more (You are currently using ${code.length} character${code.length > 1 ? 's' : ''}).`);
    }
  }
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setError("");
  }

  return (
    <div onBlur={handleBlur} className="container mx-auto p-5 h-screen">
    <div className="flex flex-col h-full">
      <div className="pt-10">
        <h1 className="text-2xl font-bold text-center mb-4">Verify your email</h1>
        <p className="text-center">Enter the 6-digit code we sent to "insert email here"</p>
        <div className="mt-8">
          <div className="relative w-full">
            <input 
              type="text"
              minLength={6}
              maxLength={6}
              inputMode="numeric"
              placeholder="Verification code *" 
              className={`peer bg-[#2A3236] p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-white ${error && 'outline-deep-red outline-2'}`}
              value={code}
              onChange={handleCodeChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              />
          </div>
            <p className="min-h-5 mt-1 ps-3 text-xs text-deep-red">{error}</p>
        </div>
      </div>
      <div className="mt-auto">
        <p className="text-center mb-8">Didn't get an email?<a className="ms-4 underline font-medium">Resend</a></p>
        <button
          disabled={!(code.length === 6)} 
          className={`mt-auto text-center w-full bg-[#2A3236] py-3.5 rounded-full ${!(code.length === 6) ? 'opacity-40' : 'bg-deep-red'}`}
          onClick={() => console.log("Clicked")}
          >Continue</button>
      </div> 
    </div>
  </div>
  )
}

export default EmailVerify;