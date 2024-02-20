import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksByBoardId } from "../state/taskSlice";
import { AppDispatch, RootState } from "../state/store";
import { selectTasksByBoardId } from "../state/Selectors/TaskSelectors";
import { TaskStatus } from "../types/Task";
import { Swimlane } from "../components/Swimlane";
import { Divider } from "@mui/material";
import useParamsNumber from "../hooks/useParamsNumber";
import { fetchTeamsByBoardId } from "../state/teamSlice";
import TaskDetails from "../components/TaskDetails/TaskDetails";
import Header from "./Header";
import TeamsListBackdrop from "../components/TeamsListBackdrop";
import TeamEditBackdrop from "../components/TeamEditBackdrop";
import CreateTeamBackdrop from "../components/CreateTeamBackdrop";
import FiveLinerForm from "../components/FiveLinerForm";
import CreateTaskForm from "../components/CreateTaskForm";

const Board = () => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useParamsNumber();

  const tasks = useSelector((state: RootState) =>
    selectTasksByBoardId(state, id)
  );

  const [isEditing, setIsEditing] = React.useState(false);

  const [isViewingTask, setIsViewingTask] = React.useState(false);
  const [lastViewedTaskId, setLastViewedTaskId] = React.useState(-1);

  const [isEditingTeam, setIsEditingTeam] = React.useState(false);
  const [lastEditedTeamId, setLastEditedTeamId] = React.useState(-1);

  const [isCreatingTeam, setIsCreatingTeam] = React.useState(false);

  const [shouldShowTeams, setShouldShowTeams] = React.useState(false);

  const [showFiveLinerForm, setShowFiveLinerForm] = React.useState(false);

  const [isCreatingTask, setIsCreatingTask] = React.useState(false);

  useEffect(() => {
    const fetchState = () => {
      if (isEditing) return;
      dispatch(fetchTasksByBoardId(id));
      dispatch(fetchTeamsByBoardId(id));
    };

    fetchState();
    const intervalId = setInterval(() => {
      fetchState();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch, id, isEditing]);

  const handleShowTeams = () => {
    setShouldShowTeams(true);
  };

  return (
    <>
      <CreateTaskForm
        open={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
      />
      <TeamsListBackdrop
        onClose={() => {
          setShouldShowTeams(false);
        }}
        open={shouldShowTeams}
        onEdit={(id) => {
          setLastEditedTeamId(id);
          setIsEditingTeam(true);
        }}
        onCreate={() => {
          setIsCreatingTeam(true);
        }}
      />
      <TeamEditBackdrop
        teamId={lastEditedTeamId}
        open={isEditingTeam}
        onClose={() => {
          setIsEditingTeam(false);
        }}
      />
      <CreateTeamBackdrop
        open={isCreatingTeam}
        onClose={() => setIsCreatingTeam(false)}
      />
      <FiveLinerForm
        open={showFiveLinerForm}
        onClose={() => setShowFiveLinerForm(false)}
      />
      <div className="flex flex-col h-screen">
        <div className="sticky top-0">
          <Header
            onClickShowTeams={handleShowTeams}
            onClickAddTask={() => setIsCreatingTask(true)}
            onFiveLiner={() => setShowFiveLinerForm(true)}
          />
        </div>
        <div className="flex flex-row justify-center flex-grow bg-neutral-800">
          {/* <TeamsLane />
        <Divider orientation="vertical" flexItem /> */}
          <TaskDetails
            onClose={() => {
              setIsViewingTask(false);
              setIsEditing(false);
            }}
            open={isViewingTask}
            onEditing={() => {
              setIsEditing(true);
            }}
            taskId={lastViewedTaskId}
          />
          {Object.keys(TaskStatus)
            .filter((k) => isNaN(Number(k)))
            .map((s, i) => {
              return (
                <>
                  <Swimlane
                    tasks={tasks
                      .filter((t) => t.status === TaskStatus[s])
                      .sort((a, b) => -1 * (a.priority - b.priority))}
                    key={s}
                    header={s}
                    onClickCard={(id) => {
                      setIsViewingTask(true);
                      setLastViewedTaskId(id);
                    }}
                  />
                  {i !== 5 ? (
                    <Divider
                      key={"divider" + i}
                      sx={{ bgcolor: "white" }}
                      orientation="vertical"
                      flexItem
                    />
                  ) : null}
                </>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Board;
