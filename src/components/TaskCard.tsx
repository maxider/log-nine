import { useMemo } from "react";
import { Priority, Task } from "../types/Task";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

interface TaskCardProps {
  task: Task;
  onClick: (e: React.MouseEvent, id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const color = useMemo(() => prioToColor(task.priority), [task]);

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
      <p className="m-2 flex justify-center">
        {task.target?.name}: {task.target?.sr} - {task.target?.lr}
      </p>
    </Paper>
  );
};

function prioToColor(priority: Priority): any {
  return "";
}

export default TaskCard;
