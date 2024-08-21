import React, { useEffect, useState } from 'react';
import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import UserProfile from "./components/UserProfile";
import "@twa-dev/sdk";
import { TransferTon } from './components/TransferTon';

const accessToken = '7456487049:AAF148xa94-xy-0xiq-1wylHQe1e3YGk3Tc';

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  const { network } = useTonConnect();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Extract userId from URL parameters when the app is launched
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    const newUserId = urlParams.get("userId");

    if (newUserId) {
      console.log(`Setting userId: ${newUserId}`);
      setUserId(newUserId);
    } else {
      console.error("No userId found in the URL parameters");
    }
  }, []); // Only runs once on app launch

  if (!userId) {
    return <div>Error: No user ID provided</div>;
  }

  return (
    <StyledApp>
      <AppContainer>
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
            <UserProfile userId={userId} botToken={accessToken} />
          </FlexBoxRow>

          <TransferTon />
        </FlexBoxCol>
      </AppContainer>
    </StyledApp>
  );
}

export default App;
