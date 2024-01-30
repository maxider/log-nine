import { Backdrop, Divider, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { selectTaskById } from "../state/Selectors/TaskSelectors";
import { RootState } from "../state/store";
import { Task } from "../types/Task";
import TaskDetailsBody from "./TaskDetailsBody";
import TaskDetailsHeader from "./TaskDetailsHeader";
import React, { useEffect, useRef } from "react";

interface TaskDetailsProps {
  onClose: () => void;
  open: boolean;
  taskId: number;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ onClose, open, taskId }) => {
  const task: Task = useSelector((state: RootState) =>
    selectTaskById(state, taskId ?? 0)
  );

  const [isEdit, setIsEdit] = React.useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    console.log(e.target)
    if (ref.current && !ref.current.contains(e.target as Node)) {
      onClose();
      setIsEdit(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!task) return <></>;
  return (
    <Backdrop
      open={open}
      onClick={() => {
        // onClose();
        // setIsEdit(false);

      }}
    >
      <Paper className="bg-slate-600 w-3/4" ref={ref}>
        <TaskDetailsHeader task={task} />
        <Divider orientation="horizontal" flexItem />
        <TaskDetailsBody
          task={task}
          isEdit={isEdit}
          setEdit={() => {
            setIsEdit(true);
          }}
        />
        <Divider orientation="vertical" flexItem />
        {/* Side
        <div>Hello World</div> */}
      </Paper>
    </Backdrop>
  );
};

export default TaskDetails;
