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

  // Function to update deal status in the database
  const updateDealStatus = async (newStatus) => {
    try {
      const response = await axios.post(
        `${APIURL}/playground/update-deal-status/`,
        {
          dealId,
          status: newStatus,
        }
      );
      if (response.status === 200) {
        onStatusChange(dealId, newStatus);
      }
    } catch (error) {
      console.error("Failed to update deal status:", error);
      // Consider adding user feedback here, e.g., showing an error message
    }
  };

  // Function to handle deal cancellation
  const handleCancel = useCallback(async () => {
    try {
      await updateDealStatus("canceled");
    } catch (error) {
      console.error("Failed to cancel the deal:", error);
    }
  }, [dealId, updateDealStatus]);

  const handleTransfer = useCallback(async () => {
    if (!connected) {
      console.error("Wallet not connected");
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
      return;
    }

    try {
      const address = Address.parse(recipient).toString({
        bounceable: false,
      });
      await sender.send({
        to: address,
        value: toNano(amount),
      });
      console.log("Transfer successful");

      await updateDealStatus("In progress");
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  }, [
    connected,
    sender,
    amount,
    dealId,
    getRecipientAddress,
    updateDealStatus,
  ]);

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
      case "In progress":
        return <p className="deal-in-progress">This deal is in progress.</p>;
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
