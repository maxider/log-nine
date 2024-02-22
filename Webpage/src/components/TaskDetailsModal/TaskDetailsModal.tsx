import { Box, Button, Divider, Modal, Paper, Typography } from "@mui/material";
import Task from "../../entities/Task";

import TaskDetailsHeader from "./TaskDetailsHeader";
import { decrementStatus, incrementStatus } from "../../api/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import TaskDetailButtonFotter from "./TaskDetailsButtonFotter";
import TaskDetailsDescription from "./TaskDetailsDescription";

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  task: Task;
}
const TaskDetailsModal = ({ isOpen, setIsModalOpen, task }: Props) => {
  const queryClient = useQueryClient();

  const { mutateAsync: incrementStat } = useMutation({
    mutationFn: incrementStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutateAsync: decrementStat } = useMutation({
    mutationFn: decrementStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsModalOpen(false);
      }}
    >
      <Paper sx={TaskDetailsModalStyle}>
        <TaskDetailsHeader task={task} />
        <Divider orientation="horizontal" flexItem />
        <TaskDetailsDescription task={task} isEdit/>
        <Divider orientation="horizontal" flexItem />
        <TaskDetailButtonFotter
          task={task}
          setIsModalOpen={setIsModalOpen}
          incrementStat={incrementStat}
          decrementStat={decrementStat}
        />
      </Paper>
    </Modal>
  );
};

const TaskDetailsModalStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  overflow: "auto",
  ":focus-visible": {
    outline: "none",
  },
};

export default TaskDetailsModal;
