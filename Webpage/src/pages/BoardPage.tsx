import { useQuery } from "@tanstack/react-query";
import Board from "../components/Board/Board";
import { useSocket } from "../hooks/useSocket";
import { useParams } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import Task from "../entities/Task";
import Team from "../entities/Team";
import FiveLinerForm from "../components/FiveLinerForm";
import { useState } from "react";

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
    queryFn: () =>
      fetch(`http://localhost:5174/Boards/${boardId}/teams`)
        .then((res) => res.json())
        .then((data) => {
          const teams: Team[] = data.map((team: Team) => ({
            id: team.id,
            boardId: team.boardId,
            name: team.name,
            srFrequency: team.srFrequency,
            lrFrequency: team.lrFrequency,
          }));

          return teams;
        }),
  });

  const [isFiveLinerFormOpen, setIsFiveLinerFormOpen] = useState(false);

  if (isLoading) return <Typography variant="h1">Loading...</Typography>;
  if (isError) return <Typography variant="h1">Error</Typography>;

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "30px",
          justifyContent: "center",
        }}
      >
        <Button variant="contained">5-Liner</Button>
      </Box>
      <Board tasks={data ?? []} teams={teams ?? []} />
    </Container>
  );
};

export default BoardPage;
