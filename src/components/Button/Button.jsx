import "./Button.css";

import React from "react";

function Button({ text, inactive, onClick, disabled, secondary }) {
  return (
    <div
      className={`${inactive ? "inactive" : ""} ${disabled ? "disabled" : ""} ${
        secondary ? "secondary" : ""
      } button`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}

export default Button;
