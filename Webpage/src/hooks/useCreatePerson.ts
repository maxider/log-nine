import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import backendUrl from "../api/BackendUrl";

export type PersonCreationParams = {
  boardId: number;
  name: string;
};

const useCreatePerson = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: createPerson } = useMutation({
    mutationFn: async (params: PersonCreationParams) => {
      const response = await fetch(`${backendUrl}/People`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create person');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people", 1] });
      enqueueSnackbar("Person created successfully", { variant: "success" });
    },
    onError: (error: Error) => {
      enqueueSnackbar(`Error creating person: ${error.message}`, { variant: "error" });
    },
  });

  return createPerson;
};

export default useCreatePerson;
