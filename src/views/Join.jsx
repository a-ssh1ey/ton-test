import React, { useState } from "react";
import axios from "axios";
import { APIURL } from "../../configure";
import { useTonConnect } from "../hooks/useTonConnect"; // Предполагается, что этот хук возвращает адрес кошелька

function Join({ setActive, selected, userId }) {
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const { wallet: walletAddress } = useTonConnect(); // Получаем адрес кошелька

  const handleJoinDeal = () => {
    console.log("Sending request...");
    axios
      .post(`${APIURL}playground/join-deal/`, {
        deal_code: code,
        user_id: userId,
        wallet_address: walletAddress, // Передаем адрес кошелька в запросе
      })
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
