import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksByBoardId } from "../state/taskSlice";
import { AppDispatch, RootState } from "../state/store";
import { selectTasksByBoardId } from "../state/Selectors/TaskSelectors";
import { TaskStatus } from "../types/Task";
import { Swimlane } from "../components/Swimlane";
import { Divider } from "@mui/material";
import useParamsNumber from "../hooks/useParamsNumber";
import { fetchTeamsByBoardId } from "../state/teamSlice";
import TaskDetails from "../components/TaskDetails";
import Header from "./Header";
import TeamsListBackdrop from "../components/TeamsListBackdrop";
import TeamEditBackdrop from "../components/TeamEditBackdrop";
import CreateTeamBackdrop from "../components/CreateTeamBackdrop";

const Board = () => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useParamsNumber();

  const tasks = useSelector((state: RootState) =>
    selectTasksByBoardId(state, id)
  );

  const [isViewingTask, setIsViewingTask] = React.useState(false);
  const [lastViewedTaskId, setLastViewedTaskId] = React.useState(-1);

  const [isEditingTeam, setIsEditingTeam] = React.useState(false);
  const [lastEditedTeamId, setLastEditedTeamId] = React.useState(-1);

  const [isCreatingTeam, setIsCreatingTeam] = React.useState(false);

  const [shouldShowTeams, setShouldShowTeams] = React.useState(false);

  useEffect(() => {
    dispatch(fetchTasksByBoardId(id));
    dispatch(fetchTeamsByBoardId(id));
  }, [dispatch, id]);

  const handleShowTeams = () => {
    setShouldShowTeams(true);
  };

  return (
    <>
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
      <div className="flex flex-col h-screen">
        <div className="sticky top-0">
          <Header onClickShowTeams={handleShowTeams} />
        </div>
        <div className="flex flex-row justify-center flex-grow bg-neutral-800">
          {/* <TeamsLane />
        <Divider orientation="vertical" flexItem /> */}
          <TaskDetails
            onClose={() => setIsViewingTask(false)}
            open={isViewingTask}
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
