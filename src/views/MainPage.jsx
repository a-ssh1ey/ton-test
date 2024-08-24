import React from "react";
import { Button } from "../styled/styled";

function MainPage({ setActive, selected }) {
  return (
    <div>
      <Body setActive={setActive} selected={selected}></Body>
    </div>
  );
}

export default MainPage;
