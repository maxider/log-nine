import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { TaskStatus, TaskPriority } from "../entities/Task";
import backendUrl from "../api/BackendUrl";

export type TaskCreationParams = {
  boardId: number;
  title: string;
  description: string;
  targetId?: number;
  status: TaskStatus;
  priority: TaskPriority;
  taskType: 0;
};

const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: createTask } = useMutation({
    mutationFn: async (params: TaskCreationParams) => {
      const response = await fetch(`${backendUrl}/Tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create task');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", 1] });
      enqueueSnackbar("Task created successfully", { variant: "success" });
    },
    onError: (error: Error) => {
      enqueueSnackbar(`Error creating task: ${error.message}`, { variant: "error" });
    },
  });

  return createTask;
};

export default useCreateTask;
