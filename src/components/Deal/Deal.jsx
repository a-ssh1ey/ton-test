import React, { useCallback } from "react";
import axios from "axios";
import { Address, toNano } from "ton";
import { APIURL } from "../../../configure";
import { useTonConnect } from "../../hooks/useTonConnect";
import "./Deal.css";

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
  const { sender, connected } = useTonConnect();

  // Helper function to get the recipient address based on the user's role
  const getRecipientAddress = () =>
    role === "buyer" ? sellerWallet : buyerWallet;

  // Function to handle deal cancellation
  const handleCancel = useCallback(async () => {
    try {
      const response = await axios.post(`${APIURL}/playground/cancel-deal/`, {
        dealId,
      });
      if (response.status === 200) {
        onStatusChange(dealId, "canceled");
      }
    } catch (error) {
      console.error("Failed to cancel the deal:", error);
      // Consider adding user feedback here, e.g., showing an error message
    }
  }, [dealId, onStatusChange]);

  // Function to handle fund transfer
  const handleTransfer = useCallback(async () => {
    if (!connected) {
      console.error("Wallet not connected");
      // Consider adding user feedback here, e.g., showing an error message
      return;
    }

    const recipient = getRecipientAddress();

    if (
      !recipient ||
      typeof recipient !== "string" ||
      recipient.trim() === ""
    ) {
      console.error(
        "Invalid recipient address: Address is missing or not a valid string."
      );
      // Consider adding user feedback here, e.g., showing an error message
      return;
    }

    try {
      const address = Address.parse(recipient).toString({ bounceable: false });
      await sender.send({
        to: address,
        value: toNano(amount),
      });
      console.log("Transfer successful");
      onStatusChange(dealId, "completed");
    } catch (error) {
      console.error("Transfer failed:", error);
      // Consider adding user feedback here, e.g., showing an error message
    }
  }, [connected, sender, amount, dealId, onStatusChange, getRecipientAddress]);

  // Function to render action buttons based on deal status and user role
  const renderButtons = () => {
    switch (dealStatus) {
      case "created":
        return role === "buyer" ? (
          <button className="deal-button" onClick={handleTransfer}>
            Transfer
          </button>
        ) : (
          <button className="deal-button" onClick={handleCancel}>
            Cancel
          </button>
        );
      case "completed":
        return <p className="deal-completed">This deal is completed.</p>;
      case "canceled":
        return <p className="deal-canceled">This deal is canceled.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="deal-container">
      <div className="deal-info">
        <p>ID: {dealId}</p>
        <p>Code: {dealCode}</p>
        <p>Status: {dealStatus}</p>
        <p>Amount: {amount} TON</p>
        <p>Recipient: {getRecipientAddress() || "N/A"}</p>
      </div>
      <div className="deal-actions">{renderButtons()}</div>
    </div>
  );
};

export default Deal;
