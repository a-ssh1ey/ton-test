import React from "react";
import "./Deal.css";

const Deal = ({ dealId, dealCode, dealStatus, role }) => {
  const renderButtons = () => {
    if (dealStatus === "created") {
      if (role === "buyer") {
        return <button className="deal-button">Transfer</button>;
      }
      return <button className="deal-button">Cancel</button>;
    } else if (dealStatus === "completed") {
      return <p className="deal-completed">This deal is completed.</p>;
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
