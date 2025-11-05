import { useState, useEffect, useRef, useContext } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  HttpTransportType,
  IHttpConnectionOptions,
  IHubProtocol,
  ILogger,
  IRetryPolicy,
  LogLevel,
} from "@microsoft/signalr";
import { UserContext } from "@/app/UserContext";
import { useRouter } from "next/navigation";

interface Options {
  onConnected?: (hub: HubConnection) => void;
  onDisconnected?: (error?: Error) => void;
  onReconnecting?: (error?: Error) => void;
  onReconnected?: (connectionId?: string) => void;
  onError?: (error?: Error) => void;
  enabled?: boolean;
  automaticReconnect?: number[] | IRetryPolicy | boolean;
  httpTransportTypeOrOptions?: IHttpConnectionOptions | HttpTransportType;
  hubProtocol?: IHubProtocol;
  logging?: LogLevel | string | ILogger;
}

export default function useSignalR(path: string, handlers: SignalRHandler[]) {
  const router = useRouter();
  const userData = useContext(UserContext);
  const [signalRHub, setSignalRHub] = useState<HubConnection | null>(null);
  const optionsRef = useRef<Options>({
    ...{
      enabled: true,
      httpTransportTypeOrOptions: {
        withCredentials: false,
        accessTokenFactory: async () => userData.getToken(),
      },
      logging: LogLevel.Error
    },
  });

  useEffect(() => {
    optionsRef.current = {
      ...{
        enabled: true,
        httpTransportTypeOrOptions: {
          withCredentials: false,
          accessTokenFactory: async () => userData.getToken(),
        },
        logging: LogLevel.Error
      },
    };
  }, [userData]);

  useEffect(() => {
    if (userData.isReady) {
      if (!userData.token) {
        router.push("/");
        return;
      }

      if (!optionsRef.current.enabled) return;

      let isCanceled = false;

      const hubConnectionSetup = new HubConnectionBuilder();

      if (optionsRef.current.httpTransportTypeOrOptions)
        // @ts-expect-error: We don't need to adhere to the overloads. https://github.com/microsoft/TypeScript/issues/14107
        hubConnectionSetup.withUrl(`${process.env.NEXT_PUBLIC_API}/${path}`, optionsRef.current.httpTransportTypeOrOptions);
      else hubConnectionSetup.withUrl(`${process.env.NEXT_PUBLIC_API}/${path}`);

      if (optionsRef.current.automaticReconnect) {
        if (optionsRef.current.automaticReconnect === true) hubConnectionSetup.withAutomaticReconnect();
        // @ts-expect-error: We don't need to adhere to the overloads. https://github.com/microsoft/TypeScript/issues/14107
        else hubConnectionSetup.withAutomaticReconnect(optionsRef.current.automaticReconnect);
      }

      if (optionsRef.current.logging) hubConnectionSetup.configureLogging(optionsRef.current.logging);

      if (optionsRef.current.hubProtocol) hubConnectionSetup.withHubProtocol(optionsRef.current.hubProtocol);

      const hubConnection = hubConnectionSetup.build();

      for (var handler of handlers) {
        hubConnection.on(handler[0], handler[1]);
      }

      hubConnection
        .start()
        .then(() => {
          if (isCanceled) return hubConnection.stop();

          if (optionsRef.current.onConnected) optionsRef.current.onConnected(hubConnection);

          if (optionsRef.current.onDisconnected) hubConnection.onclose(optionsRef.current.onDisconnected);

          if (optionsRef.current.onReconnecting) hubConnection.onreconnecting(optionsRef.current.onReconnecting);

          if (optionsRef.current.onReconnected) hubConnection.onreconnected(optionsRef.current.onReconnected);

          setSignalRHub(hubConnection);
        })
        .catch((error) => {
          if (isCanceled) return;

          if (optionsRef.current.onError) optionsRef.current.onError(error);
        });

      return () => {
        isCanceled = true;

        if (hubConnection.state === HubConnectionState.Connected) hubConnection.stop();

        setSignalRHub(null);
      };
    }
  }, [path, userData, optionsRef.current.enabled]);

  return signalRHub;
}
