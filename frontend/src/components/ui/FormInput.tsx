import exclamationIcon from '../../assets/icons/exclamation-mark.png';
import checkIcon from '../../assets/icons/check.png';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string,
  containerClassName?: string,
  value?: string,
  isValid: boolean,
  error?: string,
}

export const FormInput: React.FC<FormInputProps> = ({
  containerClassName,
  className,
  value,
  error,
  isValid,
  ...rest
}) => {
  return (
    <div className={`${containerClassName}`}>
      <div className="relative w-full">
        <input 
          className={`peer bg-gray-white p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-blue-500 ${error && 'outline-deep-red outline-2'} ${className}`}
          value={value}
          {...rest}
          />
          {error ? (<img 
            src={exclamationIcon}
            alt="Error icon"
            className="absolute w-5 top-1/2 -translate-y-1/2 right-[1rem]"
            />) : (
              (value && isValid) && (
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
  )
}