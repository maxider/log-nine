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
      className="flex flex-col w-248 hover:bg-slate-700"
      onClick={(e) => onClick(e, task.visualId)}
    >
      <div className="flex flex-row items-center">
        <div className={`h-full ${color} flex items-center`}>
          <p className="px-2 my-0 text-base font-semibold">{task.visualId}</p>
        </div>
        <Divider orientation="vertical" flexItem />
        <p className="px-3 my-0 font-semibold">{task.title}</p>
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

  if (!team) return <p className="flex justify-center m-2">No Target</p>;
  return (
    <p className="flex justify-center m-0">    
      {team?.name}: {team?.srFrequency} - {team?.lrFrequency}
    </p>
  );
};

export default TaskCard;
