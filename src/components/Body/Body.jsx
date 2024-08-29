import { Button } from "../styled/styled";
import React from "react";
import "./Body.css";

function Body({ setActive, selected }) {
  return (
    <div className="body">
      <Button inactive onClick={() => setActive(1)} disabled={selected === 1}>
        Join a deal
      </Button>
      <Button inactive onClick={() => setActive(2)} disabled={selected === 2}>
        Create a deal
      </Button>
      <Button inactive onClick={() => setActive(3)} disabled={selected === 3}>
        Pending
      </Button>
    </div>
  );
}

export default Body;
