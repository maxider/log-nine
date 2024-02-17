import { Backdrop, Divider, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { selectTaskById } from "../../state/Selectors/TaskSelectors";
import { RootState } from "../../state/store";
import { Task, Team } from "../../types/Task";
import React from "react";
import BackdropProps from "../../props/BackdropProps";
import { selectTeamById } from "../../state/Selectors/TeamSelectors";
import TaskDetailsHeader from "./TaskDetailsHeader";
import TaskDetailsFotter from "./TaskDetailsFotter";

interface TaskDetailsProps extends BackdropProps {
  taskId: number;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ onClose, open, taskId }) => {
  const task: Task = useSelector((state: RootState) =>
    selectTaskById(state, taskId)
  );

  const target: Team = useSelector((state: RootState) =>
    selectTeamById(state, task?.targetId ?? 0)
  );

  const [editMode, setEditMode] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  return (
    <Backdrop open={open}>
      <Paper className="flex flex-col w-3/4 overflow-hidden bg-neutral-800">
        <TaskDetailsHeader task={task} target={target} editMode={editMode} />
        <Divider orientation="horizontal" flexItem />
        <p className="px-3">{task?.description}</p>
        <Divider orientation="horizontal" flexItem />
        <TaskDetailsFotter
          editMode={editMode}
          setEditMode={setEditMode}
          hasChanges={hasChanges}
          setHasChanges={setHasChanges}
          onClose={onClose} taskId={task?.id ?? -1}/>
      </Paper>
    </Backdrop>
  );
};

export default TaskDetails;
