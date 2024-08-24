import React, { useState } from "react";
import { Button } from "../components/styled/styled";
import Button_extra from "../components/Button_extra/Button_extra";
import axios from "axios";
import { APIURL } from "../../configure";

function Join({ setActive, selected, userId }) {
  const [text, setText] = useState("");
  const [code, setCode] = useState("");

  const handleJoinDeal = () => {
    console.log("Sending request...");
    axios
      .post(`${URL}/playground/join-deal/`, { code, user_id: userId })
      .then((response) => {
        console.log("Response received:", response.data);
        setText(`User joined deal with ID: ${response.data.deal_id}`);
      })
      .catch((error) => {
        console.error("Error during request:", error);
        if (error.response && error.response.status === 404) {
          setText("Deal not found.");
        } else {
          setText("Error joining deal.");
        }
      });
  };

  return (
    <div>
      <div>
        <Button_extra
          text="Back"
          inactive
          onClick={() => setActive(0)}
          disabled={selected === 0}
          secondary={true}
        />

        <p>{text}</p>
      </div>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter deal code"
      />
      <button onClick={handleJoinDeal}>Join Deal</button>
      <p>{text}</p>
    </div>
  );
}

export default Join;
