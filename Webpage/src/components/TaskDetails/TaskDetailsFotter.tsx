import { Button } from "@mui/material";
import React from "react";
import { decrementStatus, incrementStatus } from "../../state/taskSlice";
import { useDispatch } from "react-redux";
import useAppDispatch from "../../hooks/useAppDispatch";

interface TaskDetailsFotterProps {
  editMode?: boolean;
  hasChanges?: boolean;
  taskId: number;
  onClose: () => void;
  onCancel: () => void;
  setEditMode: (editMode: boolean) => void;
  onEditing: () => void;
  onSave: () => void;
}

const TaskDetailsFotter: React.FC<TaskDetailsFotterProps> = (
  props: TaskDetailsFotterProps
) => {
  const {
    editMode,
    hasChanges,
    onClose,
    setEditMode,
    taskId,
    onCancel,
    onSave,
    onEditing,
  } = props;

  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-row justify-between p-2">
      <Button onClick={() => dispatch(decrementStatus(taskId))}>
        Decrement
      </Button>
      <div className="flex flex-row justify-between gap-10">
        {editMode ? (
          <EditButtonGroup
            hasChanges={hasChanges ?? false}
            onCancel={() => {
              setEditMode(false);
              onCancel();
            }}
            onSave={() => {
              setEditMode(false);
              onSave();
            }}
          />
        ) : (
          <DefaultButtonGroup
            onClose={onClose}
            onEdit={() => {
              setEditMode(true);
              onEditing();
            }}
          />
        )}
      </div>
      <Button onClick={() => dispatch(incrementStatus(taskId))}>
        Increment
      </Button>
    </div>
  );
};

interface DefaultButtonGroupProps {
  onClose: () => void;
  onEdit: () => void;
}

const DefaultButtonGroup: React.FC<DefaultButtonGroupProps> = ({
  onClose,
  onEdit,
}) => {
  return (
    <>
      <Button onClick={onEdit}>Edit</Button>
      <Button onClick={onClose}>Close</Button>
    </>
  );
};

interface EditButtonGroupProps {
  hasChanges: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const EditButtonGroup: React.FC<EditButtonGroupProps> = ({
  hasChanges,
  onCancel,
  onSave,
}) => {
  return (
    <>
      <Button disabled={!hasChanges} onClick={onSave}>
        Save
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </>
  );
};

export default TaskDetailsFotter;
