import { useQuery } from "@tanstack/react-query";
import Board from "../components/Board/Board";
import { useSocket } from "../hooks/useSocket";
import { useParams } from "react-router-dom";
import { Box, Button, Divider, Typography } from "@mui/material";
import Task, { UndefinedTask } from "../entities/Task";
import FiveLinerForm from "../components/FiveLinerForm";
import { useState } from "react";
import CreateTaskForm from "../components/CreateTaskForm";
import { fetchTeams } from "../api/api";
import TaskDetailsModal from "../components/TaskDetailsModal/TaskDetailsModal";
import TeamListModal from "../components/TeamList/TeamListModal";
import backendUrl from "../api/BackendUrl";

const BoardPage = () => {
  useSocket();

  const { id: boardId } = useParams();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", boardId],
    queryFn: () =>
      fetch(`${backendUrl}/Boards/${boardId}/tasks`)
        .then((res) => res.json())
        .then((data) => {
          const tasks: Task[] = data.map((task: Task) => ({
            id: task.id,
            visualId: task.visualId,
            boardId: task.boardId,
            targetId: task.targetId,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            teamId: task.targetId,
          }));
          return tasks;
        }),
  });

  const { data: teams } = useQuery({
    queryKey: ["teams", boardId],
    queryFn: fetchTeams(boardId ?? "-1"),
  });

  const [isFiveLinerFormOpen, setIsFiveLinerFormOpen] = useState(false);
  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);
  const [isViewingTask, setIsViewingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number>(-1);

  const [isViewingTeams, setIsViewingTeams] = useState(false);

  if (isLoading) return <Typography variant="h1">Loading...</Typography>;
  if (isError) return <Typography variant="h1">Error</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "38px",
          justifyContent: "center",
          marginBottom: "10px",
          gap: "15px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setIsFiveLinerFormOpen(true)}
        >
          5-Liner
        </Button>
        <Button
          variant="contained"
          onClick={() => setIsCreateTaskFormOpen(true)}
        >
          Create Task
        </Button>
        <Button variant="contained" onClick={() => setIsViewingTeams(true)}>
          View Teams
        </Button>
      </Box>
      <Divider orientation="horizontal" flexItem />
      <Board
        tasks={tasks ?? []}
        teams={teams ?? []}
        onClickCard={(id) => {
          setSelectedTask(tasks?.find((t) => t.id == id)?.id ?? -1);
          setIsViewingTask(true);
        }}
      />
      <FiveLinerForm
        isOpen={isFiveLinerFormOpen}
        boardId={boardId ?? "-1"}
        onClose={() => setIsFiveLinerFormOpen(false)}
      />
      <CreateTaskForm
        isOpen={isCreateTaskFormOpen}
        boardId={boardId ?? "-1"}
        onClose={() => setIsCreateTaskFormOpen(false)}
      />
      <TaskDetailsModal
        isOpen={isViewingTask}
        setIsModalOpen={setIsViewingTask}
        task={tasks?.find((t) => t.id === selectedTask) ?? UndefinedTask}
        teams={teams ?? []}
      />
      <TeamListModal
        teams={teams ?? []}
        isOpen={isViewingTeams}
        onClose={() => setIsViewingTeams(false)}
        boardId={boardId ?? "-1"}
      />
    </Box>
  );
};

export default BoardPage;
