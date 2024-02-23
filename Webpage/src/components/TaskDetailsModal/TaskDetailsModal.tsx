import { Divider, Modal, Paper, SxProps } from "@mui/material";
import Task from "../../entities/Task";

import TaskDetailsHeader from "./TaskDetailsHeader";
import {
  UpdateTaskParams,
  decrementStatus,
  incrementStatus,
  updateTaskFn,
} from "../../api/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TaskDetailButtonFooter from "./TaskDetailsButtonFooter";
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

  const { mutateAsync: updateTask } = useMutation({
    mutationFn: updateTaskFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title);
      setEditDescription(task.description);
    }
  }, [task, isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const params: UpdateTaskParams = {
      id: task.id,
      params: {
        boardId: task.boardId,
        title: editTitle,
        description: editDescription,
        targetId: task.targetId,
        priority: task.priority,
        status: task.status,
        taskType: 0,
        visualId: task.visualId,
      },
    };
    updateTask(params);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsModalOpen(false);
        setIsEditing(false);
      }}
    >
      <Paper sx={TaskDetailsModalStyle}>
        <TaskDetailsHeader
          task={task}
          title={editTitle}
          isEditMode={isEditing}
          onChange={(t) => setEditTitle(t)}
        />
        <Divider orientation="horizontal" flexItem />
        <TaskDetailsDescription
          description={editDescription}
          onChange={(d) => setEditDescription(d)}
          isEdit={isEditing}
        />
        <Divider orientation="horizontal" flexItem />
        <TaskDetailButtonFooter
          task={task}
          incrementStat={incrementStat}
          decrementStat={decrementStat}
          onEditButton={() => setIsEditing(true)}
          onCancelEdit={() => setIsEditing(false)}
          onSave={handleSave}
          isEditMode={isEditing}
        />
      </Paper>
    </Modal>
  );
};

const TaskDetailsModalStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  maxHeight: "80%",
  ":focus-visible": {
    outline: "none",
  },
};

export default TaskDetailsModal;
