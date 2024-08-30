import React, { useState } from "react";
import Button_extra from "../components/Button_extra/Button_extra";
import axios from "axios";
import { APIURL } from "../../configure";

function Create({ setActive, selected, userId }) {
  const [text, setText] = useState("");
  const [dealAmount, setDealAmount] = useState(""); // Добавлено состояние для суммы сделки

  const handleCreateDeal = () => {
    console.log("Sending request...");
    axios
      .post(`${APIURL}/playground/create-deal/`, {
        user_id: userId,
        amount: dealAmount, // Передаем сумму сделки в запросе
      })
      .then((response) => {
        console.log("Response received:", response.data);
        setText(`Deal created with code: ${response.data.code}`);
      })
      .catch((error) => {
        console.error("Error during request:", error);
        setText("Error creating deal.");
      });
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter deal amount"
        value={dealAmount}
        onChange={(e) => setDealAmount(e.target.value)} // Обновляем состояние при изменении инпута
      />
      <Button_extra
        text="Create Deal"
        onClick={handleCreateDeal}
        secondary={false}
      />
      <p>{text}</p>
    </div>
  );
}

export default Create;
