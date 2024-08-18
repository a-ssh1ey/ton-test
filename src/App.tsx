import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import UserProfile from "./components/UserProfile";
import "@twa-dev/sdk";

const accessToken = '7528353122:AAHXZoQ8OAeWa3IIm0rWdwmKl9NeifDI7Po'; // Define accessToken

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

  // Extract userId from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId) {
    return <div>Error: No user ID provided</div>;
  }

  return (
    <StyledApp>
      <AppContainer>
        <FlexBoxCol>
          <FlexBoxRow>
            <UserProfile userId={userId} botToken={accessToken} />
            <TonConnectButton />
            <Button>
              {network
                ? network === CHAIN.MAINNET
                  ? "mainnet"
                  : "testnet"
                : "N/A"}
            </Button>
          </FlexBoxRow>
     
          <TransferTon />
    
        </FlexBoxCol>
      </AppContainer>
    </StyledApp>
  );
}


export default App;
