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
  dealWalletAddress, // Include the deal wallet address
  onStatusChange,
}) {
  const { sender, connected } = useTonConnect();

  const address = useMemo(() => {
    if (!dealWalletAddress) return null;
    try {
      return Address.parse(dealWalletAddress).toString({
        bounceable: false,
      });
    } catch (error) {
      console.error("Failed to parse address:", error);
      return null;
    }
  }, [dealWalletAddress]);

  const updateDealStatus = useCallback(
    async (newStatus) => {
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
      }
    },
    [dealId, onStatusChange]
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
      console.error("Invalid deal wallet address");
      return;
    }

    try {
      await sender.send({
        to: address,
        value: toNano(amount),
      });
      console.log("Transfer successful");
      await updateDealStatus("in_progress");
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  }, [connected, sender, amount, address, updateDealStatus]);

  const renderButtons = () => {
    switch (dealStatus) {
      case "created":
        return role === "buyer" ? (
          <>
            <p>
              Please send {amount} TON to the deal wallet address to initiate
              the deal.
            </p>
            <p>
              <strong>Deal Wallet Address:</strong> {dealWalletAddress}
            </p>
            <button onClick={handleTransfer}>Send Funds</button>
          </>
        ) : (
          <button onClick={handleCancel} style={{ color: "red" }}>
            Cancel Deal
          </button>
        );
      case "in_progress":
        return role === "buyer" ? (
          <button onClick={handleMarkAsCompleted} style={{ color: "green" }}>
            Release Funds
          </button>
        ) : (
          <p style={{ color: "orange" }}>Waiting for buyer to release funds.</p>
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
        {dealWalletAddress && (
          <p>
            <strong>Deal Wallet Address:</strong> {dealWalletAddress}
          </p>
        )}
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
