import React, { useState, useEffect } from "react";
import axios from "axios";
import Deal from "../components/Deal/Deal";
import { APIURL } from "../../configure";

function Pending({ setActive, selected, userId }) {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${APIURL}/playground/get-user-deals/`, {
          params: { user_id: userId },
        })
        .then((response) => {
          console.log("Deals received:", response.data.deals);
          setDeals(response.data.deals);
        })
        .catch((error) => {
          console.error("Error fetching user deals:", error);
        });
    }
  }, [userId]);

  // Function to handle the status change
  const handleStatusChange = (dealId, newStatus) => {
    setDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.id === dealId ? { ...deal, status: newStatus } : deal
      )
    );
  };

  return (
    <div>
      <ul>
        {deals.map((deal) => (
          <li key={deal.id}>
            <Deal
              dealId={deal.id}
              dealCode={deal.code}
              dealStatus={deal.status}
              role={deal.role}
              amount={deal.amount}
              recipient={deal.recipient}
              onStatusChange={handleStatusChange} // Passing the function to Deal
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pending;
