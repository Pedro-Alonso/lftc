import BaseLink from "next/link";
import { Button } from "./button";

interface Props {
  href: string;
  text: string;
  className?: string;
}

export const Link = ({ href, text, className = "" }: Props) => {
  const handleClick = () => {
    const element = document.getElementById(href);
    if (element) {
      element.click();
    }
  };
  return (
    <Button text={text} onClick={handleClick} className={className}>
      <BaseLink href={href} id={href} />
    </Button>
  );
};
