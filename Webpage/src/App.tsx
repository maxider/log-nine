import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { selectTasksByBoardId } from "./state/Selectors/TaskSelectors";
import React from "react";
import "./App.css";
import { selectTeams } from "./state/Selectors/TeamSelectors";
import { Routes, Route } from "react-router-dom";
import Board from "./routes/Board";
import Home from "./routes/Home";

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

  function addTasks(): void {}

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Board/:id" element={<Board />} />
    </Routes>
  );
};

export default App;
