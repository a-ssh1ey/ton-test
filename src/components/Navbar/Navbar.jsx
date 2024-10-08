import React from "react";
import { FlexBoxRow } from "../styled/styled";
import Button_extra from "../Button_extra/Button_extra";
import "./Navbar.css";
function Navbar({ setActive, selected }) {
  const buttons = [
    { text: "Main", page: 0 },
    { text: "Create", page: 2 },
    { text: "Join", page: 1 },
    { text: "Pending", page: 3 },
  ];

  return (
    <div className="navbar">
      {buttons
        .filter((button) => button.page !== selected) // исключаем кнопку текущей страницы
        .map((button) => (
          <Button_extra
            key={button.page}
            text={button.text}
            onClick={() => setActive(button.page)}
            secondary={true}
          />
        ))}
    </div>
  );
}

export default Navbar;
