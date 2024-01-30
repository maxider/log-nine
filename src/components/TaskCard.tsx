import { useMemo } from "react";
import { Task } from "../types/Task";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { useSelector } from "react-redux";
import { selectTeamById } from "../state/Selectors/TeamSelectors";
import { RootState } from "../state/store";
import { prioToColor } from "../Helpers";

interface TaskCardProps {
  task: Task;
  onClick: (e: React.MouseEvent, id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const color = useMemo(() => prioToColor(task.priority), [task]);

  const target = useSelector((state: RootState) =>
    selectTeamById(state, task.targetId ?? 0)
  );

  return (
    <Paper
      className="bg-slate-600 w-248 flex flex-col hover:bg-slate-700"
      onClick={(e) => onClick(e, task.visualId)}
    >
      <div className="flex flex-row items-center">
        <div className={`h-full ${color} flex items-center`}>
          <p className="font-semibold text-base px-3">{task.visualId}</p>
        </div>
        <Divider orientation="vertical" flexItem />
        <p className="px-3 text-sm font-semibold my-2">{task.title}</p>
      </div>
      <Divider />
      <TeamFotter teamId={task.targetId} />
    </Paper>
  );
};

const TeamFotter: React.FC<{ teamId?: number }> = ({ teamId }) => {
  const team = useSelector((state: RootState) =>
    selectTeamById(state, teamId ?? 0)
  );

  if (!team) return <p className="m-2 flex justify-center">No Target</p>;

  return (
    <p className="m-2 flex justify-center">
      {team?.name}: {team?.freqSr} - {team?.freqLr}
    </p>
  );
};

export default TaskCard;
