import { Box, TextField, Typography } from "@mui/material";
import Task from "../../entities/Task";

interface Props {
  task: Task;
  isEdit: boolean;
}

const TaskDetailsDescription = ({ task, isEdit }: Props) => {
  return (
    <Box sx={{ height: "100%", padding: "20px", flexGrow: 1 }}>
      {isEdit ? (
        <TextField
          label={"Description"}
          value={task.description}
          fullWidth
          multiline
        />
      ) : (
        <Typography sx={{}}>{task.description}</Typography>
      )}
    </Box>
  );
};

export default TaskDetailsDescription;
