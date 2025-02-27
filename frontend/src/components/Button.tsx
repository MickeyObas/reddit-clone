interface ButtonProps {
  type?: 'button' | 'submit',
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
  disabled: boolean,
  label: string,
  className?: string,
  isValid: boolean
}

export const Button: React.FC<ButtonProps> = ({
  type='button',
  onClick,
  disabled=false,
  label,
  isValid,
  className
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`text-center w-full font-medium py-3.5 rounded-full ${!isValid ? 'bg-gray-white opacity-40' : 'bg-deep-red text-white'} ${className}`}
    >{label}</button>
  )
}