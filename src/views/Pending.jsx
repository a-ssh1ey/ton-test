import React, { useState, useEffect } from "react";
import axios from "axios";
import Button_extra from "../components/Button_extra/Button_extra";
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

  return (
    <div>
      <Button_extra
        text="Back"
        inactive
        onClick={() => setActive(0)}
        disabled={selected === 0}
        secondary={true}
      />

      <ul>
        {deals.map((deal) => (
          <li
            key={deal.id}
          >{`Deal ID: ${deal.id}, Code: ${deal.code}, Status: ${deal.status}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default Pending;
