import React, { useState, useEffect } from "react";
import axios from "axios";
//import { URL } from "../config.js";

function Pending({ setActive, selected }) {
  const [deals, setDeals] = useState([]);
  const [userId, setUserId] = useState(""); // ID пользователя

  useEffect(() => {
    if (userId) {
      // Получение активных сделок пользователя при изменении userId
      /* axios.get(`${URL}/playground/get-user-deals/`, { params: { user_id: userId } })
                .then(response => {
                    console.log('Deals received:', response.data.deals);
                    setDeals(response.data.deals);
                })
                .catch(error => {
                    console.error('Error fetching user deals:', error);
                });*/
    }
  }, [userId]);

  return (
    <div>
      <button onClick={() => setActive(0)} disabled={selected === 0}>
        Back
      </button>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID"
      />
      <button onClick={() => setUserId(userId)}>Get Pending Deals</button>
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
