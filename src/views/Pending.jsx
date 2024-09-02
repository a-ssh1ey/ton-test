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

  const handleStatusChange = (dealId, newStatus) => {
    setDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.deal_id === dealId ? { ...deal, status: newStatus } : deal
      )
    );
  };

  return (
    <div>
      <ul>
        {deals.map((deal) => {
          return (
            <li key={deal.deal_id}>
              <Deal
                dealId={deal.deal_id}
                dealCode={deal.deal_code}
                dealStatus={deal.status}
                role={deal.role}
                amount={deal.amount}
                buyerWallet={deal.buyer_wallet} // Передаем кошелек покупателя
                sellerWallet={deal.seller_wallet} // Передаем кошелек продавца
                onStatusChange={handleStatusChange}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Pending;
