import "./Button_extra.css";

import React from "react";

function Button_extra({ text, inactive, onClick, disabled, secondary }) {
  return (
    <button
      className={`${inactive ? "inactive" : ""} ${disabled ? "disabled" : ""} ${
        secondary ? "secondary" : ""
      } button`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button_extra;
