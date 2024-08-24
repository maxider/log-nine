import { useQueryClient, useMutation } from "@tanstack/react-query";
import backendUrl from "../api/BackendUrl";

export type PersonCreationParams = {
  boardId: number;
  name: string;
};

const useCreatePerson = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createTask } = useMutation({
    mutationFn: (params: PersonCreationParams) =>
      fetch(`${backendUrl}/People`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["People", 1] });
    },
  });

  return createTask;
};

export default useCreatePerson;
