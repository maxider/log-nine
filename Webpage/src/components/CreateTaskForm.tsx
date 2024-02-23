import { Modal, Paper, SxProps } from "@mui/material";
import FormProps from "../helpers/FormProps";

const CreateTaskForm = ({ isOpen, boardId, onClose }: FormProps) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper sx={style}>
        <div>
          <h1>Create Task Form</h1>
        </div>
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
  maxHeight: "80%",
  overflow: "auto",
  ":focus-visible": {
    outline: "none",
  },
};

export default CreateTaskForm;
