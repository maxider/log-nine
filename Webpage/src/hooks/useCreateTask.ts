import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TaskStatus, TaskPriority } from "../entities/Task";

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

  const { mutateAsync: createTask } = useMutation({
    mutationFn: (params: TaskCreationParams) =>
      fetch("http://localhost:5174/Tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", 1] });
    },
  });

  return createTask;
};

export default useCreateTask;
