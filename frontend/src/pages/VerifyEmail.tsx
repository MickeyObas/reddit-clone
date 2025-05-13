import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { FormInput } from "../components/ui/FormInput";
import { Button } from "../components/ui/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface VerifyEmailProps{
  email: string,
  setStep: (step: number) => void
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({email, setStep}) => {

  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [codeResendCountdown, setCodeResendCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (/^\d*$/.test(inputValue)) {
      setCode(inputValue);
    }
  };

  const handleBlur = ()=> {
    if(code && code.length < 6){
      setError(`Incomplete code. ${6 - code.length} character${6 - code.length > 1 ? 's' : ''} left.`);
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
      setIsResending(true);
      const response = await fetch(`${BACKEND_URL}/resend-confirmation-email/`, {
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
        console.log("Email sent again", data);
        setCanResend(false);
        setCodeResendCountdown(59);
        toast.success("A new verification code has been sent to your account.")
      }
    }catch(err){
      console.error(err);
    }finally{
      setIsResending(false);
    }
  }

  const handleContinueClick = async () => {
    try{
      setIsVerifying(true);
      const response = await fetch(`${BACKEND_URL}/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          code
        })
      });

      if(!response.ok){
        const error = await response.json();
        setError(error.error);
        console.log(error);
      }else{
        const data = await response.json();
        console.log("Verification successful", data);
        setStep(3);
        toast.success("Verification successful.")
      }

    }catch(err){
      console.error(err);
    }finally{
      setIsVerifying(false);
    }
  }

  const codeInputRef = useRef<HTMLInputElement>(null);

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!codeInputRef.current?.value) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      // emailInputRef.current?.blur();
      handleBlur();
      if(code.length === 6 && !error){
        handleContinueClick();
      }
    }
  };

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
    <div className="container mx-auto p-5 h-dvh md:h-screen max-w-lg flex items-center justify-center" >
    <div className="flex flex-col h-full md:h-auto md:p-6 md:shadow-[0_0_7px_1px_rgba(0,0,0,0.25)] md:rounded-lg justify-between">
      <div>
        <div className="pt-4 md:pt-0">
          <h1 className="text-2xl font-bold text-center mb-4">Verify your email</h1>
          <p className="text-center">Enter the 6-digit code we sent to "{email}"</p>
          <FormInput
            ref={codeInputRef}
            containerClassName="mt-8" 
            minLength={6}
            maxLength={6}
            inputMode="numeric"
            placeholder="Verification code *"
            value={code}
            onChange={handleCodeChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoComplete="verification-code"
            name="verification-code"
            error={error}
            isValid={code.length === 6}
            onKeyDown={handleCodeKeyDown}
          />
        </div>
      </div> 

      <div>
        <div className="md:mt-4">
          <p className="text-center mb-3">Didn't get an email?{
            !canResend 
            ? <span className="ms-3 text-xs opacity-50">Resend in {codeResendCountdown} seconds</span>
            : isResending
              ? <span className="ms-3 text-xs opacity-50">Resending...</span>
              : <span 
              className="ms-4 underline font-medium cursor-pointer"
              onClick={handleResendClick}
              >Resend</span>}
          </p>
          <p className="text-center mb-8">Typed in the wrong email?
            <span 
              onClick={() => navigate(-1)}
              className="ms-4 cursor-pointer font-medium underline text-red-600">Go back</span>
          </p>
        </div>
        <Button 
          className={`mt-2 md:mt-4 ${!isVerifying && 'cursor-pointer'}`}
          onClick={handleContinueClick}
          disabled={!(code.length === 6)}
          isValid={code.length === 6}
          label={`${isVerifying ? 'Loading...' : 'Continue'}`}
        />
      </div>

    </div>
  </div>
  )
}

export default VerifyEmail;