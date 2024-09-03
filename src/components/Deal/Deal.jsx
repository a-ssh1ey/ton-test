import React from "react";
import axios from "axios";
import "./Deal.css";
import { APIURL } from "../../../configure";
import { useTonConnectUI } from "@tonconnect/ui-react";

const Deal = ({
  dealId,
  dealCode,
  dealStatus,
  role,
  amount,
  buyerWallet,
  sellerWallet,
  onStatusChange,
}) => {
  const [tonConnectUI] = useTonConnectUI();

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
    const recipient = role === "buyer" ? sellerWallet : buyerWallet;

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

    const transaction = {
      messages: [
        {
          address: recipient, // Адрес получателя
          amount: toNano(amount).toString(), // Сумма в nanotons
        },
      ],
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      console.log("Transfer successful");
      onStatusChange(dealId, "completed");
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
        <p>
          Recipient: {role === "buyer" ? sellerWallet : buyerWallet || "N/A"}
        </p>
      </div>
      <div className="deal-actions">{renderButtons()}</div>
    </div>
  );
};

export default Deal;
