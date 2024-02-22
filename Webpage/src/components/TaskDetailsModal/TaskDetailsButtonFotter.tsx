import { Box, Button } from "@mui/material";
import Task from "../../entities/Task";

interface Props {
  task: Task;
  setIsModalOpen: (isOpen: boolean) => void;
  incrementStat: (task: Task) => void;
  decrementStat: (task: Task) => void;
}

const TaskDetailButtonFotter = ({
  task,
  setIsModalOpen,
  incrementStat,
  decrementStat,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Button variant="contained" onClick={() => decrementStat(task)}>
        Decrement
      </Button>
      <Button variant="contained" onClick={() => setIsModalOpen(false)}>
        Close
      </Button>
      <Button variant="contained">Edit</Button>
      <Button variant="contained" onClick={() => incrementStat(task)}>
        Increment
      </Button>
    </Box>
  );
};

export default TaskDetailButtonFotter;
