import { Backdrop, Divider, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { selectTaskById } from "../../state/Selectors/TaskSelectors";
import { RootState } from "../../state/store";
import { Task, Team } from "../../types/Task";
import React, { useEffect } from "react";
import BackdropProps from "../../props/BackdropProps";
import { selectTeamById } from "../../state/Selectors/TeamSelectors";
import TaskDetailsHeader, { EditableInputProps } from "./TaskDetailsHeader";
import TaskDetailsFotter from "./TaskDetailsFotter";
import InputField from "../InputField";
import useAppDispatch from "../../hooks/useAppDispatch";
import { EditTask } from "../../state/taskSlice";

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

  const [editTitle, setEditTitle] = React.useState(task?.title);
  const [editDescription, setEditDescription] = React.useState(
    task?.description
  );
  const [editTargetId, setEditTargetId] = React.useState(task?.targetId ?? -1);

  const dispatch = useAppDispatch();

  const handleSave = () => {
    dispatch(
      EditTask({
        id: task?.id,
        creationParams: {
          boardId: task?.boardId,
          title: editTitle,
          description: editDescription,
          targetId: editTargetId,
          status: task?.status,
          priority: task?.priority,
          taskType: 0,
        },
      })
    );
  };

  const seedState = () => {
    setEditTitle(task?.title);
    setEditDescription(task?.description);
    setEditTargetId(task?.targetId ?? -1);
  };

  useEffect(() => {
    seedState();
  }, [task]);

  return (
    <Backdrop open={open}>
      <Paper className="flex flex-col w-3/4 overflow-hidden bg-neutral-800">
        <TaskDetailsHeader
          visualId={task?.visualId ?? -1}
          title={editTitle}
          target={target}
          priority={task?.priority ?? 1}
          editMode={editMode}
          setEditTitle={setEditTitle}
          setEditTargetId={setEditTargetId}
          onChange={() => setHasChanges(true)}
        />
        <Divider orientation="horizontal" flexItem />
        <EditableDescription
          value={editDescription}
          label="Description"
          editMode={editMode}
          setDescription={setEditDescription}
          onChange={() => setHasChanges(true)}
        />
        <Divider orientation="horizontal" flexItem />
        <TaskDetailsFotter
          editMode={editMode}
          setEditMode={setEditMode}
          hasChanges={hasChanges}
          onClose={onClose}
          onCancel={() => seedState()}
          onSave={() => handleSave()}
          taskId={task?.id ?? -1}
        />
      </Paper>
    </Backdrop>
  );
};

export default TaskDetails;

interface EditableDescriptionProps extends EditableInputProps {
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const EditableDescription: React.FC<EditableDescriptionProps> = ({
  value,
  label,
  editMode,
  setDescription,
  onChange,
}) => {
  return (
    <div className="px-2 my-2 grow">
      {editMode ? (
        <InputField
          label={label}
          value={value}
          fullWidth
          multiline
          onChange={(e) => {
            setDescription(e.target.value);
            onChange();
          }}
        />
      ) : (
        <p className="whitespace-pre-wrap">{value}</p>
      )}
    </div>
  );
};
