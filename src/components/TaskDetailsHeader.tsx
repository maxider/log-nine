import { Divider } from "@mui/material";
import { Task } from "../types/Task";
import { useSelector } from "react-redux";
import { selectTeamById } from "../state/Selectors/TeamSelectors";
import { RootState } from "../state/store";
import { prioToColor } from "../Helpers";

interface TaskDetailsHeaderProps {
  task: Task;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({ task }) => {
  const target = useSelector((state: RootState) =>
    selectTeamById(state, task.targetId ?? 0)
  );

  const color = prioToColor(task.priority);

  return (
    <div className="flex flex-col m-0 p-2">
      <div className="flex flex-row gap-4 font-semibold m-2 items-center">
        <div
          className={`flex flex-col items-center min-w-16 p-2 flex-none ${color}`}
        >
          <h2 className="m-0">#{task.visualId}</h2>
          <p className="m-0">Status: {task.status}</p>
        </div>
        <Divider orientation="vertical" flexItem />
        <h2 className="whitesmoke m-0 flex-grow"> {task.title}</h2>
        <Divider orientation="vertical" flexItem />
        <div className="flex flex-col items-center min-w-24 flex-none">
          <h2 className="m-0">{target?.name ?? ""}</h2>
          <p className="m-0">
            SR: {target?.freqSr ?? ""} LR: {target?.freqLr ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsHeader;