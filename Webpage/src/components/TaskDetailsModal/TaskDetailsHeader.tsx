import { Box, Typography, Divider } from "@mui/material";
import Task from "../../entities/Task";
import { priorityColor } from "../../helpers/prioToColor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decrementPriority, incrementPriority } from "../../api/mutations";

const TaskDetailsHeader = ({ task }: { task: Task }) => {
  const color = priorityColor(task.priority);

  const queryClient = useQueryClient();

  const { mutateAsync: incrementPrio } = useMutation({
    mutationFn: incrementPriority,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutateAsync: decrementPrio } = useMutation({
    mutationFn: decrementPriority,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: color,
          paddingX: "20px",
        }}
      >
        <KeyboardArrowUpIcon
          sx={arrowStyle}
          onClick={() => incrementPrio(task)}
        />
        <Typography sx={{ textAlign: "center" }}>{task.visualId}</Typography>
        <KeyboardArrowDownIcon
          sx={arrowStyle}
          onClick={() => decrementPrio(task)}
        />
      </Box>
      <Divider orientation="vertical" flexItem />
      <Typography
        sx={{
          flexGrow: 1,
          textAlign: "center",
        }}
      >
        {task.title}
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Typography sx={{ padding: "20px" }}>{task.priority}</Typography>
    </Box>
  );
};

const arrowStyle = {
  opacity: "25%",
  ":hover": { opacity: "100%", transition: "opacity 0.3s" },
};

export default TaskDetailsHeader;
