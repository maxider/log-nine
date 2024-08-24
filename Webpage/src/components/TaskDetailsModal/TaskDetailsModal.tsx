import { Divider, Modal, Paper, SxProps } from "@mui/material";
import Task from "../../entities/Task";

import TaskDetailsHeader from "./TaskDetailsHeader";
import {
  UpdateTaskParams,
  cancleTaskFn,
  decrementStatus,
  incrementStatus,
  updateTaskFn,
} from "../../api/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TaskDetailButtonFooter from "./TaskDetailsButtonFooter";
import TaskDetailsDescription from "./TaskDetailsDescription";
import Team, { UndefinedTeam } from "../../entities/Team";
import Person, { UndefinedPerson } from "../../entities/Person";

interface Props {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  task: Task;
  teams: Team[];
  people: Person[];
}
const TaskDetailsModal = ({
  isOpen,
  setIsModalOpen,
  task,
  teams,
  people,
}: Props) => {
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

  const { mutateAsync: cancleTask } = useMutation({
    mutationFn: cancleTaskFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const [editTargetId, setEditTargetId] = useState(task.targetId);
  const [editAssignedToId, setEditAssignedToId] = useState(task.assignedToId);

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title);
      setEditDescription(task.description);
      setEditTargetId(task.targetId);
      setEditAssignedToId(task.assignedToId);
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
        targetId: editTargetId,
        priority: task.priority,
        status: task.status,
        taskType: 0,
        visualId: task.visualId,
        assignedToId: editAssignedToId,
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
          target={teams.find((t) => t.id === editTargetId) ?? UndefinedTeam}
          person={
            people.find((p) => p.id === editAssignedToId) ?? UndefinedPerson
          }
          title={editTitle}
          isEditMode={isEditing}
          onChange={(t) => {
            setEditTitle(t);
            setHasChanges(true);
          }}
          onChangeTargetId={(id) => {
            setEditTargetId(id);
            setHasChanges(true);
          }}
          onChangeAssignedToId={(id) => {
            setEditAssignedToId(id);
            setHasChanges(true);
          }}
        />
        <Divider orientation="horizontal" flexItem />
        <TaskDetailsDescription
          description={editDescription}
          onChange={(d) => {
            setEditDescription(d);
            setHasChanges(true);
          }}
          isEdit={isEditing}
        />
        <Divider orientation="horizontal" flexItem />
        <TaskDetailButtonFooter
          task={task}
          incrementStat={incrementStat}
          decrementStat={decrementStat}
          cancelTask={cancleTask}
          onEditButton={() => setIsEditing(true)}
          onCancelEdit={() => {
            setIsEditing(false);
            setHasChanges(false);
          }}
          onSave={handleSave}
          isEditMode={isEditing}
          hasChanges={hasChanges}
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
