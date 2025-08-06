interface ButtonProps {
  text: string;
  onClick: () => void;
}

export const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <div className="bg-amber-200 w-40 text-center rounded-md font-bold hover:bg-amber-500">
      <button onClick={onClick}>{text}</button>
    </div>
  );
};
