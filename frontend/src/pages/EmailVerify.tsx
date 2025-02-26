import { JSX, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";


const EmailVerify = (): JSX.Element => {

  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [codeResendCountdown, setCodeResendCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (/^\d*$/.test(inputValue)) {
      setCode(inputValue);
    }
  };

  const handleBlur = ()=> {
    if(code && code.length < 6){
      setError(`Please lengthen this text to 6 characters or more (You are currently using ${code.length} character${code.length > 1 ? 's' : ''}).`);
    }
  }
  
  const handleFocus = () => {
    setError("");
  };

  const handleResendClick = async () => {
    if(!canResend){
      return;
    };

    // Resend confirmation email
    try{
      const response = await fetch(`${BACKEND_URL}/resend-confirmation-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: "mickeygoke@gmail.com"
        })
      });

      if(!response.ok){
        const error = await response.json();
        console.log(error);
      }else{
        const data = await response.json();
        console.log("Email sent again", data);
        setCanResend(false);
        setCodeResendCountdown(59);
      }
    }catch(err){
      console.error(err);
    }
  }

  useEffect(() => {
    if(codeResendCountdown <= 0){
      setCanResend(true);
      return;
    };

    const timer = setInterval(() => {
      setCodeResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [codeResendCountdown])

  return (
    <div className="container mx-auto p-5 h-screen">
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
        <p className="text-center mb-8">Didn't get an email?{
          !canResend 
          ? <span className="ms-3 text-xs opacity-50">Resend in {codeResendCountdown} seconds</span>
          : <span 
            className="ms-4 underline font-medium"
            onClick={handleResendClick}
            >Resend</span>}
        </p>
        <button
          disabled={!(code.length === 6)} 
          className={`mt-auto text-center w-full bg-[#2A3236] py-3.5 rounded-full ${!(code.length === 6) ? 'opacity-40' : 'bg-deep-red'}`}
          >Continue</button>
      </div> 
    </div>
  </div>
  )
}

export default EmailVerify;