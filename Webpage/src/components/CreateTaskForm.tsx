import { Box, Button, Modal, Paper, SxProps, TextField } from "@mui/material";
import FormProps from "../helpers/FormProps";
import TeamComboBox from "./TeamComboBox";
import { useState } from "react";
import useCreateTask from "../hooks/useCreateTask";

const CreateTaskForm = ({ isOpen, boardId, onClose }: FormProps) => {
  //state for the form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetId, setTargetId] = useState(-1);

  const resetState = () => {
    setTitle("");
    setDescription("");
    setTargetId(-1);
  }

  const createTask = useCreateTask();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createTask({
      title: title,
      boardId: parseInt(boardId),
      description: description,
      targetId: targetId,
      status: 0,
      priority: 1,
      taskType: 0,
    });

    resetState();
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper sx={style}>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TeamComboBox
              boardId={boardId}
              setTargetId={setTargetId}
              required={true} value={targetId}            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              maxRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              sx={{
                width: "60px",
                margin: "auto",
              }}
              type="submit"
              variant="contained"
              fullWidth
            >
              Create
            </Button>
          </Box>
        </form>
      </Paper>
    </Modal>
  );
};

const style: SxProps = {
  position: "absolute",
  p: "10px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "33%",
  height: "33%",
  maxHeight: "80%",
  overflow: "auto",
  ":focus-visible": {
    outline: "none",
  },
};

export default CreateTaskForm;
