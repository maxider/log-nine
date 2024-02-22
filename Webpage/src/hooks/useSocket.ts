import { useQueryClient } from "@tanstack/react-query";
import { SignalRContext } from "../App";
import Task from "../entities/Task";

export function useSocket() {
  // react-query context
  const queryClient = useQueryClient();

  const onCreateTask = (projectId: number, newTask: Task) => {
    /**
     * update react-query-cache
     */
    console.log("%cuseSocket -> OnCreateTask", "color: orange");

    const queryKey = ["tasks", projectId];

    // current cache
    const cachedTasks = queryClient.getQueryData<Task[]>(queryKey);

    if (cachedTasks) {
      // Check if the new task already exist in cache
      const taskExist = cachedTasks.some((task) => task.id === newTask.id);

      if (!taskExist) {
        // add new task to cache
        queryClient.setQueryData<Task[]>(queryKey, [...cachedTasks, newTask]);
      }
    } else {
      //  cache is empty
      queryClient.setQueryData<Task[]>(queryKey, [newTask]);
    }
  };

  SignalRContext.useSignalREffect(
    "ReceiveMessage",
    (message) => {
      console.log("📬 message: ", message);
    },
    []
  );

  // useEffect(() => {
  //   // check socket
  //   if (!socket) return undefined;

  //   const onConnectError = () => {
  //     console.log("❌ connection error: ", socket.id);
  //   };

  //   const onCreateTask = (projectId: number, newTask: Task) => {
  //     /**
  //      * update react-query-cache
  //      */
  //     console.log("%cuseSocket -> OnCreateTask", "color: orange");

  //     const queryKey = ["tasks", projectId];

  //     // current cache
  //     const cachedTasks = queryClient.getQueryData<Task[]>(queryKey);

  //     if (cachedTasks) {
  //       // Check if the new task already exist in cache
  //       const taskExist = cachedTasks.some((task) => task.id === newTask.id);

  //       if (!taskExist) {
  //         // add new task to cache
  //         queryClient.setQueryData<Task[]>(queryKey, [...cachedTasks, newTask]);
  //       }
  //     } else {
  //       //  cache is empty
  //       queryClient.setQueryData<Task[]>(queryKey, [newTask]);
  //     }
  //   };

  // const onUpdateTask = (projectId: IProject["_id"], newTask: ITask) => {
  //   /**
  //    * update react-query-cache
  //    */
  //   console.log("%cuseSocket -> OnUpdateTask", "color: orange");

  //   const queryKey = [TASKS_CACHENAME, projectId];

  //   // current cache
  //   let cachedTasks = queryClient.getQueryData<ITask[]>(queryKey);

  //   if (cachedTasks) {
  //     // update task in cache
  //     cachedTasks = cachedTasks.map((task) =>
  //       task._id === newTask._id ? newTask : task
  //     );
  //     queryClient.setQueryData<ITask[]>(queryKey, cachedTasks);
  //   }
  //   //  cache is empty
  //   else {
  //     queryClient.setQueryData<ITask[]>(queryKey, [newTask]);
  //   }
  // };

  // const onUpdateProject = (newProject: IProject) => {
  //   /**
  //    * update react-query-cache
  //    */
  //   console.log("%cuseSocket -> OnUpdateProject", "color: orange");

  //   const queryKey = [PROJECTS_CACHENAME];

  //   // current cache
  //   let cachedProjects = queryClient.getQueryData<IProject[]>(queryKey);

  //   if (cachedProjects) {
  //     // update projects in cache
  //     cachedProjects = cachedProjects.map((project) =>
  //       project._id === newProject._id ? newProject : project
  //     );
  //     queryClient.setQueryData<IProject[]>(queryKey, cachedProjects);
  //   }
  //   //  cache is empty
  //   else {
  //     queryClient.setQueryData<IProject[]>(queryKey, [newProject]);
  //   }
  // };

  // Listeners  📶
  // socket.on("connect", onConnect);
  // socket.on("disconnect", onDisconnect);
  // socket.on("connect_error", onConnectError);
  // // documents
  // // socket.on("project:create", onCreateProject);
  // // socket.on("project:update", onUpdateProject);
  // socket.on("task:create", onCreateTask);
  // // socket.on("task:update", onUpdateTask);

  // ❌ disconnect on unmount
}
