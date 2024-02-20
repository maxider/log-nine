import { Backdrop, Button, Paper } from "@mui/material";
import { useState } from "react";
import BackdropProps from "../props/BackdropProps";
import InputField from "./InputField";
import TeamComboBox from "./TeamComboBox";
import useAppDispatch from "../hooks/useAppDispatch";
import { TaskCreationParams, addNewTask } from "../state/taskSlice";
import useParamsNumber from "../hooks/useParamsNumber";

const CreateTaskForm: React.FC<BackdropProps> = (props) => {
  const { open, onClose } = props;

  const [targetId, setTargetId] = useState<number>(-1);

  const boardId = useParamsNumber();

  const dispatch = useAppDispatch();

  const resetForm = () => {
    (document.getElementById("create-task-form") as HTMLFormElement).reset();
    setTargetId(-1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const params: TaskCreationParams = {
      boardId: boardId,
      title: formData.get("Title") as string,
      description: formData.get("Description") as string,
      targetId: targetId,
      status: 0,
      priority: 0,
      taskType: 0,
    };

    dispatch(addNewTask(params));
    onClose();
    resetForm();
  };

  return (
    <Backdrop open={open}>
      <Paper className="flex flex-col items-center w-1/3 p-4 bg-neutral-800">
        <h1 className="m-0 mb-4 text-center">Add Task</h1>
        <form
          id="create-task-form"
          onSubmit={handleSubmit}
          className="flex flex-col justify-center w-full gap-4"
        >
          <div className="flex flex-row justify-between gap-2">
            <InputField name="Title" fullWidth required label={"Title"} />
            <TeamComboBox onChange={(id) => setTargetId(id)} label="Target" />
          </div>
          <InputField name="Description" label={"Description"} multiline />
          <div className="flex flex-row justify-around w-full">
            <Button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="w-4"
            >
              Close
            </Button>
            <Button type="submit" className="w-4">
              Add
            </Button>
          </div>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default CreateTaskForm;
