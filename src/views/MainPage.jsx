import React from "react";
import { Button } from "../components/styled/styled";
import Body from "../components/Body/Body";

function MainPage({ setActive, selected }) {
  return (
    <div>
      <Body setActive={setActive} selected={selected}></Body>
    </div>
  );
}

export default MainPage;
