import React from "react";
import axios from "axios";
import "./Deal.css";
import { APIURL } from "../../../configure";
import { useTonConnect } from "../../hooks/useTonConnect"; // Импортируем хук
import { Address, toNano } from "ton";

const Deal = ({
  dealId,
  dealCode,
  dealStatus,
  role,
  onStatusChange,
  amount,
  recipient,
}) => {
  const { sender, connected } = useTonConnect(); // Подключаемся к TonConnect

  const handleCancel = async () => {
    try {
      const response = await axios.post(`${APIURL}/playground/cancel-deal/`, {
        dealId: dealId,
      });

      if (response.status === 200) {
        onStatusChange(dealId, "canceled");
      }
    } catch (error) {
      console.error("Failed to cancel the deal:", error);
    }
  };

  const handleTransfer = async () => {
    if (!connected) {
      console.error("Wallet not connected");
      return;
    }

    console.log("Recipient before parsing:", recipient); // Логируем значение recipient

    if (
      !recipient ||
      typeof recipient !== "string" ||
      recipient.trim() === ""
    ) {
      console.error(
        "Invalid recipient address: Address is missing or not a valid string."
      );
      return;
    }

    try {
      const address = Address.parse(recipient); // Пробуем распарсить адрес
      await sender.send({
        to: address,
        value: toNano(amount), // Используем сумму сделки из пропсов
      });
      console.log("Transfer successful");
      onStatusChange(dealId, "completed"); // Обновляем статус сделки после успешного перевода
    } catch (error) {
      console.error("Transfer failed:", error); // Ловим ошибку и логируем её
    }
  };

  const renderButtons = () => {
    if (dealStatus === "created") {
      if (role === "buyer") {
        return (
          <button className="deal-button" onClick={handleTransfer}>
            Transfer
          </button>
        );
      }
      return (
        <button className="deal-button" onClick={handleCancel}>
          Cancel
        </button>
      );
    } else if (dealStatus === "completed") {
      return <p className="deal-completed">This deal is completed.</p>;
    } else if (dealStatus === "canceled") {
      return <p className="deal-canceled">This deal is canceled.</p>;
    }
    return null;
  };
  console.log("Recipient in Deal component:", recipient);

  return (
    <div className="deal-container">
      <div className="deal-info">
        <p>ID: {dealId}</p>
        <p>Code: {dealCode}</p>
        <p>Status: {dealStatus}</p>
        <p>Amount: {amount} TON</p>
        <p>Recipient: {recipient || "N/A"}</p>{" "}
      </div>
      <div className="deal-actions">{renderButtons()}</div>
    </div>
  );
};

export default Deal;
