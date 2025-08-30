interface ButtonProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
  onClick: () => void;
}

export const Button = ({
  text,
  className = "",
  children,
  onClick,
}: ButtonProps) => {
  return (
    <div
      className={`bg-blue-200 w-40 text-center rounded-md font-bold hover:bg-blue-400 cursor-pointer ${className}`}
    >
      <button onClick={onClick}>
        {text}
        {children}
      </button>
    </div>
  );
};
