import { Button } from "@mui/material";
import { Task } from "../types/Task";
import { useDispatch } from "react-redux";
import { decrementStatus, incrementStatus } from "../state/taskSlice";
import React, { useEffect } from "react";
import EditableText from "./EditableText";

interface TaskDetailsBodyProps {
  task: Task;
  isEdit: boolean;
  setEdit: () => void;
}

const TaskDetailsBody: React.FC<TaskDetailsBodyProps> = ({
  task,
  isEdit,
  setEdit,
}) => {
  const dispatch = useDispatch();

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
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-row gap-4 justify-between m-2">
        <Button
          variant="contained"
          onClick={() => {
            dispatch(decrementStatus(task.id));
          }}
        >
          Status -
        </Button>
        <Button variant="contained" onClick={setEdit}>
          Edit
        </Button>
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
