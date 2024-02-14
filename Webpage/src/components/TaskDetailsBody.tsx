import { Button } from "@mui/material";
import { Task } from "../types/Task";
import { useDispatch } from "react-redux";
import { decrementStatus, incrementStatus } from "../state/taskSlice";
import React, { useEffect } from "react";
import { EditableText } from "./EditableText";
import { AppDispatch } from "../state/store";

interface TaskDetailsBodyProps {
  task: Task;
  isEdit: boolean;
  hasChanged: boolean;
  setEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaved: () => void;
}

const TaskDetailsBody: React.FC<TaskDetailsBodyProps> = ({
  task,
  isEdit,
  hasChanged,
  setEdit,
  onChange,
  onSaved,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [description, setDescription] = React.useState(task.description);

  useEffect(() => {
    setDescription(task.description);
  }, [task]);

  return (
    <>
      <div className="mx-3">
        <EditableText 
          value={description}
          isEdit={isEdit}
          onChange={(e) => {
            setDescription(e.target.value);
            onChange(e);
          }}
        />
      </div>
      <div className="flex flex-row justify-between gap-4 m-2">
        <Button
          variant="contained"
          onClick={() => {
            dispatch(decrementStatus(task.id));
          }}
        >
          Status -
        </Button>
        {isEdit ? (
          <Button
            variant="contained"
            onClick={() => {
              setEdit();
              onSaved();
            }}
            disabled={!hasChanged}
          >
            Save
          </Button>
        ) : (
          <Button variant="contained" onClick={setEdit}>
            Edit
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => {
            dispatch(incrementStatus(task.id));
          }}
        >
          Status +
        </Button>
      </div>
    </>
  );
};

export default TaskDetailsBody;
