import React from "react";
import { FlexBoxRow } from "../styled/styled";
import Button_extra from "../Button_extra/Button_extra";
function Navbar({ setActive, selected }) {
  return (
    <FlexBoxRow>
      <Button_extra
        text="Main"
        onClick={() => setActive(0)}
        disabled={selected === 0}
        secondary={true}
      />
      <Button_extra
        text="Create"
        onClick={() => setActive(2)}
        disabled={selected === 2}
        secondary={true}
      />
      <Button_extra
        text="Join"
        onClick={() => setActive(1)}
        disabled={selected === 1}
        secondary={true}
      />
      <Button_extra
        text="Pending"
        onClick={() => setActive(3)}
        disabled={selected === 3}
        secondary={true}
      />
    </FlexBoxRow>
  );
}

export default Navbar;
