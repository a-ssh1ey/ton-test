import React, { useEffect, useState } from "react";
import "./App.css"; // Импортируем стили
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import UserProfile from "./components/UserProfile/UserProfile";
import "@twa-dev/sdk";
import TransferTon from "./components/TransferTon/TransferTon";
import { Create, Join, MainPage, Pending } from "./views";

const accessToken = "7456487049:AAF148xa94-xy-0xiq-1wylHQe1e3YGk3Tc";

function App() {
  const { network } = useTonConnect();
  const [userId, setUserId] = useState(null);
  const [active, setActive] = useState(0);

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

  const components = {
    0: <MainPage setActive={setActive} selected={active} />,
    1: <Join setActive={setActive} selected={active} userId={userId} />,
    2: <Create setActive={setActive} selected={active} />,
    3: <Pending setActive={setActive} selected={active} />,
  };
  return (
    <div className="styled-app">
      <div className="app-container">
        <FlexBoxCol>
          <div className="first_row">
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
          </div>
          {components[active]}
        </FlexBoxCol>
      </div>
    </div>
  );
}

export default App;
