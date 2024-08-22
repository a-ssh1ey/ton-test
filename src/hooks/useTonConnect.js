import { CHAIN } from "@tonconnect/protocol";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  return {
    sender: {
      send: async (args) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 минут для одобрения пользователем
        });
      },
    },
    connected: !!wallet?.account.address, // Проверяем, подключен ли кошелек
    wallet: wallet?.account.address ?? null, // Если кошелек подключен, возвращаем его адрес, иначе null
    network: wallet?.account.chain ?? null, // Если кошелек подключен, возвращаем сеть, иначе null
  };
}
