import "./Button.css";
import React from "react";

interface ButtonProps {
  text: string;
  inactive?: boolean;
  onclick?: () => void;
  disabled?: boolean;
  secondary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, inactive, onclick, disabled, secondary }) => {
  return (
    <div
      className={`${inactive ? "inactive" : ""} ${disabled ? "disabled" : ""} ${secondary ? "secondary" : ""} button`}
      onClick={onclick}
    >
      {text}
    </div>
  );
}

export default Button;
