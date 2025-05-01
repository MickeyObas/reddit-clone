const DownArrow = ({
  color= "",
  outlineColor= "white",
  ...props
}) => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 0.4 0.4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    style={{ transform: 'scale(1, -1)' }}
    stroke={!color ? outlineColor : ''}
    strokeWidth={0.03}
    {...props}
  >
    <path
      d="M0.15 0.2H0.05V0.15l0.15 -0.15 0.15 0.15v0.05h-0.1v0.2H0.15z"
      fill={color}
    />
  </svg>
);
export default DownArrow;
