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

    try {
      await sender.send({
        to: Address.parse(recipient), // Используем адрес получателя из пропсов
        value: toNano(amount), // Используем сумму сделки из пропсов
      });
      console.log("Transfer successful");
      onStatusChange(dealId, "completed"); // Обновляем статус сделки после успешного перевода
    } catch (error) {
      console.error("Transfer failed:", error);
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

  return (
    <div className="deal-container">
      <div className="deal-info">
        <p>ID: {dealId}</p>
        <p>Code: {dealCode}</p>
        <p>Status: {dealStatus}</p>
        <p>Amount: {amount} TON</p>
        <p>Recipient: {recipient}</p>
      </div>
      <div className="deal-actions">{renderButtons()}</div>
    </div>
  );
};

export default Deal;
