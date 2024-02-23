import { useQuery } from "@tanstack/react-query";
import Board from "../components/Board/Board";
import { useSocket } from "../hooks/useSocket";
import { useParams } from "react-router-dom";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import Task from "../entities/Task";
import Team from "../entities/Team";
import FiveLinerForm from "../components/FiveLinerForm";
import { useState } from "react";
import CreateTaskForm from "../components/CreateTaskForm";
import { fetchTeams } from "../helpers/api";

const BoardPage = () => {
  useSocket();

  const { id: boardId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", boardId],
    queryFn: () =>
      fetch(`http://localhost:5174/Boards/${boardId}/tasks`)
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
      </Box>
      <Divider orientation="horizontal" flexItem />
      <Board tasks={data ?? []} teams={teams ?? []} />
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
    </Box>
  );
};

export default BoardPage;
