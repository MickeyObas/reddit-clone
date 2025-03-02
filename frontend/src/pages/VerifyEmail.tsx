import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { FormInput } from "../components/ui/FormInput";
import { Button } from "../components/ui/Button";

interface VerifyEmailProps{
  email: string,
  setStep: (step: number) => void
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({email, setStep}) => {

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
      }
    }catch(err){
      console.error(err);
    }
  }

  const handleContinueClick = async () => {
    try{
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
        <p className="text-center">Enter the 6-digit code we sent to "{email}"</p>
        <FormInput
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
        />
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
        <Button 
          className="mt-auto"
          onClick={handleContinueClick}
          disabled={!(code.length === 6)}
          isValid={code.length === 6}
          label="Continue"
        />
      </div> 
    </div>
  </div>
  )
}

export default VerifyEmail;