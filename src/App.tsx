import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { MouseEvent, useEffect } from "react";
import { addNewTask, fetchTasks, selectTasks, selectTasksByBoardId } from "./state/taskSlice";
import { Task } from "./types/Task";
import TaskCard from "./components/TaskCard";
import { Button } from "@mui/material";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => 
    selectTasksByBoardId(state, 1)
  );
  const taskStatus = useSelector((state: RootState) => state.tasks.status);

  function addTasks(): void {
    dispatch(
      addNewTask({
        title: "New Task",
        description: "New Description",
        priority: 0,
        id: 0,
        visualId: 42,
        boardId: 1,
        workers: [],
        target: {
          name: "",
          sr: 0,
          lr: 0,
        },
        status: 0,
      })
    );
  }

  return (
    <div className="w-full m-2 flex flex-col gap-4 items-center">
      <Button variant="contained" onClick={addTasks}>
        Add Task
      </Button>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onClick={() => {}} />
      ))}
    </div>
  );
};

export default App;
