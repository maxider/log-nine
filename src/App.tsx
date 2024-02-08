import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { addNewTask } from "./state/taskSlice";
import TaskCard from "./components/TaskCard";
import { Button } from "@mui/material";
import { selectTasksByBoardId } from "./state/Selectors/TaskSelectors";
import React from "react";
import TaskDetails from "./components/TaskDetails";
import "./App.css";
import { selectTeams } from "./state/Selectors/TeamSelectors";
import { Routes, Route } from "react-router-dom";
import Board from "./routes/Board";
import Header from "./routes/Header";

const Nav = () => {
  return (
    <div className="sticky top-0 h-4">
      <h1>Home</h1>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isViewingTask, setIsViewingTask] = React.useState(false);
  const [lastViedTaskId, setLastViewedTaskId] = React.useState(0);

  const tasks = useSelector((state: RootState) =>
    selectTasksByBoardId(state, 1)
  );
  const taskStatus = useSelector((state: RootState) => state.tasks.status);

  const teams = useSelector(selectTeams);

  const options = teams.map((t) => {
    return { label: t.name, id: t.id };
  });

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
    <Routes>
      <Route path="/Board/:id" element={<Board />} />
    </Routes>
  );

  return (
    <div className="flex flex-col items-center w-screen h-screen gap-4 m-0 bg-slate-900">
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
