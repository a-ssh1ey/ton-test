import React, { useState } from "react";
import Button_extra from "../components/Button_extra/Button_extra";
import axios from "axios";
import { APIURL } from "../../configure";
import { useTonConnect } from "../hooks/useTonConnect";
import { FaCopy } from "react-icons/fa"; // Импортируем иконку для копирования

function Create({ setActive, selected, userId }) {
  const [text, setText] = useState("");
  const [dealAmount, setDealAmount] = useState(""); // Состояние для суммы сделки
  const { wallet: walletAddress } = useTonConnect(); // Получаем адрес кошелька
  const [dealCode, setDealCode] = useState(""); // Состояние для кода сделки
  const [isDealCreated, setIsDealCreated] = useState(false); // Состояние для проверки, создана ли сделка

  const handleCreateDeal = () => {
    console.log("Sending request...");
    axios
      .post(`${APIURL}/playground/create-deal/`, {
        user_id: userId,
        amount: dealAmount, // Передаем сумму сделки в запросе
        wallet_address: walletAddress, // Передаем адрес кошелька в запросе
      })
      .then((response) => {
        console.log("Response received:", response.data);
        const code = response.data.deal_code;
        setDealCode(code); // Сохраняем код сделки
        setText(`Deal created with code: ${code}`);
        setIsDealCreated(true); // Устанавливаем флаг, что сделка создана
      })
      .catch((error) => {
        console.error("Error during request:", error);
        setText("Error creating deal.");
      });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(dealCode)
      .then(() => {
        console.log("Deal code copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy deal code:", error);
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
      {isDealCreated && (
        <button
          onClick={handleCopyToClipboard}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: "10px",
          }}
          title="Copy to clipboard"
        >
          <FaCopy size={16} />
        </button>
      )}
    </div>
  );
}

export default Create;
