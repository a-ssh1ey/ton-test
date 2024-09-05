import React, { useCallback, useMemo } from "react";
import axios from "axios";
import { Address, toNano } from "ton";
import { APIURL } from "../../../configure";
import { useTonConnect } from "../../hooks/useTonConnect";

export default function Deal({
  dealId,
  dealCode,
  dealStatus,
  role,
  amount,
  buyerWallet,
  sellerWallet,
  onStatusChange,
}) {
  const { sender, connected } = useTonConnect();

  const getRecipientAddress = useCallback(
    () => (role === "buyer" ? sellerWallet : buyerWallet),
    [role, sellerWallet, buyerWallet]
  );

  const recipient = getRecipientAddress();

  const address = useMemo(() => {
    if (!recipient) return null;
    try {
      return Address.parse(recipient).toString({
        bounceable: false,
      });
    } catch (error) {
      console.error("Failed to parse address:", error);
      return null;
    }
  }, [recipient]);

  const updateDealStatus = useCallback(
    async (newStatus) => {
      if (!address) {
        console.error("Invalid recipient address");
        return;
      }
      try {
        const response = await axios.post(
          `${APIURL}/playground/update-deal-status/`,
          {
            dealId,
            status: newStatus,
            recipientAddress: address,
          }
        );
        if (response.status === 200) {
          onStatusChange(dealId, newStatus);
        }
      } catch (error) {
        console.error("Failed to update deal status:", error);
      }
    },
    [dealId, address, onStatusChange]
  );

  const handleCancel = useCallback(
    () => updateDealStatus("canceled"),
    [updateDealStatus]
  );

  const handleMarkAsCompleted = useCallback(
    () => updateDealStatus("completed"),
    [updateDealStatus]
  );

  const handleTransfer = useCallback(async () => {
    if (!connected) {
      console.error("Wallet not connected");
      return;
    }
    if (!address) {
      console.error("Invalid recipient address");
      return;
    }

    try {
      await sender.send({
        to: address,
        value: toNano(amount),
      });
      console.log("Transfer successful");
      await updateDealStatus("In progress");
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  }, [connected, sender, amount, address, updateDealStatus]);

  const renderButtons = () => {
    switch (dealStatus) {
      case "created":
        return role === "buyer" ? (
          <button onClick={handleTransfer}>Transfer</button>
        ) : (
          <button onClick={handleCancel} style={{ color: "red" }}>
            Cancel
          </button>
        );
      case "In progress":
        return role === "seller" ? (
          <button onClick={handleMarkAsCompleted}>Mark as Completed</button>
        ) : (
          <p style={{ color: "yellow" }}>This deal is in progress.</p>
        );
      case "completed":
        return <p style={{ color: "green" }}>This deal is completed.</p>;
      case "canceled":
        return <p style={{ color: "red" }}>This deal is canceled.</p>;
      default:
        return null;
    }
  };

  return (
    <div
      className="deal-card"
      style={{ border: "1px solid #ccc", padding: "16px", maxWidth: "400px" }}
    >
      <div className="deal-content" style={{ marginBottom: "16px" }}>
        <p>
          <strong>ID:</strong> {dealId}
        </p>
        <p>
          <strong>Code:</strong> {dealCode}
        </p>
        <p>
          <strong>Status:</strong> {dealStatus}
        </p>
        <p>
          <strong>Amount:</strong> {amount} TON
        </p>
        <p>
          <strong>Recipient:</strong> {recipient || "N/A"}
        </p>
      </div>
      <div
        className="deal-footer"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        {renderButtons()}
      </div>
    </div>
  );
}
