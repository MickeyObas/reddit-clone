import exclamationIcon from '../assets/icons/exclamation-mark.png';
import checkIcon from '../assets/icons/check.png';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password',
  placeholder: string,
  className?: string,
  containerClassName?: string,
  value?: string,
  error?: string,
  isValid: boolean,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export const FormInput: React.FC<FormInputProps> = ({
  type='text',
  placeholder,
  containerClassName,
  className,
  value,
  error,
  isValid,
  onChange,
  onBlur,
  onFocus,
  ...rest
}) => {
  return (
    <div className={`${containerClassName}`}>
      <div className="relative w-full">
        <input 
          type={type}
          placeholder={placeholder}
          className={`peer bg-gray-white p-4 border-0 outline-0 rounded-2xl w-full focus:outline-2 focus:outline-blue-500 ${error && 'outline-deep-red outline-2'} ${className}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
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