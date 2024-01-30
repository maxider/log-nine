import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { addNewTask } from "./state/taskSlice";
import TaskCard from "./components/TaskCard";
import { Button } from "@mui/material";
import { selectTasksByBoardId } from "./state/Selectors/TaskSelectors";
import React from "react";
import TaskDetails from "./components/TaskDetails";
import "./App.css";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isViewingTask, setIsViewingTask] = React.useState(false);
  const [lastViedTaskId, setLastViewedTaskId] = React.useState(0);

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
        targetId: undefined,
        status: 0,
      })
    );
  }

  return (
    <div className="w-screen h-screen m-0 flex flex-col gap-4 items-center bg-slate-900">
      <Button variant="contained" onClick={addTasks}>
        Add Task
      </Button>
      <TaskDetails
        onClose={() => setIsViewingTask(false)}
        open={isViewingTask}
        taskId={lastViedTaskId}
      />
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          onClick={() => {
            setIsViewingTask(true);
            setLastViewedTaskId(t.id);
          }}
        />
      ))}
    </div>
  );
};

export default App;
