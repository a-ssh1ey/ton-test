import React from "react";
import "./Deal.css";
import axios from "axios"; // Import axios for making HTTP requests

const Deal = ({ dealId, dealCode, dealStatus, role, onStatusChange }) => {
  const handleCancel = async () => {
    try {
      // Send a request to the backend to cancel the deal
      const response = await axios.post("/api/cancel-deal/", {
        dealId: dealId,
      });

      if (response.status === 200) {
        // If the request is successful, update the status in the parent component
        onStatusChange(dealId, "canceled");
      }
    } catch (error) {
      console.error("Failed to cancel the deal:", error);
    }
  };

  const renderButtons = () => {
    if (dealStatus === "created") {
      if (role === "buyer") {
        return <button className="deal-button">Transfer</button>;
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
      </div>
      <div className="deal-actions">{renderButtons()}</div>
    </div>
  );
};

export default Deal;
