import React, { useState, useEffect } from "react";
import { Button } from "../components/styled/styled";
import axios from "axios";
//import {URL} from "../config.js";

function Join({ setActive, selected }) {
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState("");

  const handleJoinDeal = () => {
    console.log("Sending request...");
    /* axios.post(`${URL}/playground/join-deal/`, { code, user_id: userId })
            .then(response => {
                console.log('Response received:', response.data);
                setText(`User joined deal with ID: ${response.data.deal_id}`);
            })
            .catch(error => {
                console.error('Error during request:', error);
                if (error.response && error.response.status === 404) {
                    setText('Deal not found.');
                } else {
                    setText('Error joining deal.');
                }
            });*/
  };

  return (
    <div>
      <div>
        <Button
          inactive
          onclick={() => setActive(0)}
          disabled={selected === 0}
          secondary={true}
        >
          Back
        </Button>
        <p>{text}</p>
      </div>
      <button onClick={() => setActive(0)} disabled={selected === 0}>
        Back
      </button>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter deal code"
      />
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID"
      />
      <button onClick={handleJoinDeal}>Join Deal</button>
      <p>{text}</p>
    </div>
  );
}

export default Join;
