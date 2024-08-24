import React, { useState } from "react";
import Button_extra from "../components/Button_extra/Button_extra";
import axios from "axios";
//import { URL } from "../config.js";

function Create({ setActive, selected }) {
  const [text, setText] = useState("");

  const handleCreateDeal = () => {
    /*console.log('Sending request...');
        axios.post(`${URL}/playground/create-deal/`)
            .then(response => {
                console.log('Response received:', response.data);
                setText(`Deal created with code: ${response.data.code}`);
            })
            .catch(error => {
                console.error('Error during request:', error);
                setText('Error creating deal.');
            });*/
  };

  return (
    <div>
      <Button_extra
        text="Back"
        inactive
        onclick={() => setActive(0)}
        disabled={selected === 0}
        secondary={true}
      />
      <Button_extra
        text="Create Deal"
        onclick={handleCreateDeal}
        secondary={false}
      />
      <p>{text}</p>
    </div>
  );
}

export default Create;
