import { Backdrop, Divider, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { selectTaskById } from "../state/Selectors/TaskSelectors";
import { RootState } from "../state/store";
import { Task } from "../types/Task";
import TaskDetailsBody from "./TaskDetailsBody";
import TaskDetailsHeader from "./TaskDetailsHeader";
import React, { useEffect, useRef } from "react";
import BackdropProps from "../props/BackdropProps";

interface TaskDetailsProps extends BackdropProps {
  taskId: number;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ onClose, open, taskId }) => {
  const task: Task = useSelector((state: RootState) =>
    selectTaskById(state, taskId ?? 0)
  );

  const [isEdit, setIsEdit] = React.useState(false);
  const [hasChanged, setHasChanged] = React.useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    const element = e.target as Element;
    if (
      ref.current &&
      !ref.current.contains(e.target as Node) &&
      element.getAttribute("role") !== "option" &&
      element.getAttribute("role") !== "listbox"
    ) {
      onClose();
      setIsEdit(false);
      setHasChanged(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!task) return <></>;
  return (
    <Backdrop open={open}>
      <Paper className="w-3/4 bg-neutral-800" ref={ref}>
        <TaskDetailsHeader
          task={task}
          isEdit={isEdit}
          onChange={() => setHasChanged(true)}
        />
        <Divider orientation="horizontal" flexItem />
        <TaskDetailsBody
          task={task}
          isEdit={isEdit}
          hasChanged={hasChanged}
          setEdit={() => {
            setIsEdit(true);
          }}
          onChange={() => {
            setHasChanged(true);
          }}
          onSaved={() => {
            setIsEdit(false);
            setHasChanged(false);
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
