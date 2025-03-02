
interface LinkButtonProps {
  href: string,
  label: string,
  className?: string
}


export const LinkButton: React.FC<LinkButtonProps> = ({href, label, className}) => {
  return (
    <a
      href={href}
      className={`py-2 px-3 rounded-full font-medium text-center text-white bg-deep-red ${className}`}
    >{label}</a>
  )
}