import React, { useEffect, useState } from "react";
import "./App.css"; // Импортируем стили
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import UserProfile from "./components/UserProfile/UserProfile";
import "@twa-dev/sdk";
import TransferTon from "./components/TransferTon/TransferTon";

const accessToken = "7456487049:AAF148xa94-xy-0xiq-1wylHQe1e3YGk3Tc";

function App() {
  const { network } = useTonConnect();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Извлечение userId из параметров URL при запуске приложения
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    const newUserId = urlParams.get("userId");

    if (newUserId) {
      console.log(`Setting userId: ${newUserId}`);
      setUserId(newUserId);
    } else {
      console.error("No userId found in the URL parameters");
    }
  }, []); // Выполняется только один раз при запуске приложения

  if (!userId) {
    return <div>Error: No user ID provided</div>;
  }

  return (
    <div className="styled-app">
      <div className="app-container">
        <FlexBoxCol>
          <FlexBoxRow>
            <TonConnectButton />
            <Button>
              {network
                ? network === CHAIN.MAINNET
                  ? "mainnet"
                  : "testnet"
                : "N/A"}
            </Button>
          </FlexBoxRow>
          <UserProfile userId={userId} botToken={accessToken} />

          <TransferTon />
        </FlexBoxCol>
      </div>
    </div>
  );
}

export default App;
