import { useQueryClient } from "@tanstack/react-query";
import { SignalRContext } from "../App";

export function useSocket() {
  const queryClient = useQueryClient();

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
  };
}
