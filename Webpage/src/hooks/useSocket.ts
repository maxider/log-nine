import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { SignalRContext } from "../App";

export function useSocket() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  SignalRContext.useSignalREffect(
    "ReceiveMessage",
    (message) => {
      console.log("📬 message: ", message);
      const messageType = message.split(":")[0];
      const messageArg = message.split(":")[1];

      parseMessage({ type: messageType, arg: messageArg });
    },
    []
  );

  // Handle connection state changes
  useEffect(() => {
    const connection = SignalRContext.connection;
    
    if (!connection) return;

    const handleReconnecting = () => {
      console.log("SignalR: Reconnecting...");
    };

    const handleReconnected = () => {
      console.log("SignalR: Reconnected");
      enqueueSnackbar("Connection restored", { variant: "success" });
      // Refresh all queries on reconnection
      queryClient.invalidateQueries();
    };

    const handleClose = (error?: Error) => {
      console.error("SignalR: Connection closed", error);
      if (error) {
        enqueueSnackbar("Connection lost. Attempting to reconnect...", { 
          variant: "warning",
          autoHideDuration: 5000 
        });
      }
    };

    connection.onreconnecting(handleReconnecting);
    connection.onreconnected(handleReconnected);
    connection.onclose(handleClose);

    return () => {
      connection.off("onreconnecting", handleReconnecting);
      connection.off("onreconnected", handleReconnected);
      connection.off("onclose", handleClose);
    };
  }, [queryClient, enqueueSnackbar]);

  type Message = {
    type: string;
    arg: string;
  };

  const parseMessage = (message: Message) => {
    if (message.type === "TaskUpdated" || message.type === "TaskCreated") {
      queryClient.invalidateQueries({ queryKey: ["tasks", message.arg] });
    }
    if (message.type === "TeamCreated" || message.type === "TeamUpdated") {
      queryClient.invalidateQueries({
        queryKey: ["teams", message.arg],
      });
    }
    if (message.type === "PersonCreated" || message.type === "PersonUpdated") {
      queryClient.invalidateQueries({
        queryKey: ["people", message.arg],
      });
    }
  };
}
