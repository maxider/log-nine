import { useQuery } from "@tanstack/react-query";
import Board from "../components/Board/Board";
import { useSocket } from "../hooks/useSocket";
import { useParams } from "react-router-dom";
import { Box, Button, Divider, Typography } from "@mui/material";
import Task, { UndefinedTask } from "../entities/Task";
import FiveLinerForm from "../components/FiveLinerForm";
import { useState } from "react";
import CreateTaskForm from "../components/CreateTaskForm";
import { fetchPeople, fetchTeams } from "../api/api";
import TaskDetailsModal from "../components/TaskDetailsModal/TaskDetailsModal";
import TeamListModal from "../components/TeamList/TeamListModal";
import backendUrl from "../api/BackendUrl";
import PersonTasks from "../components/PersonTasks/PersonTasks";
import CreatePersonForm from "../components/CreatePersonForm";

const BoardPage = () => {
  useSocket();

  const { id: boardId } = useParams();

  let {
    data: tasks,
    // eslint-disable-next-line prefer-const
    isLoading,
    // eslint-disable-next-line prefer-const
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
            assignedToId: task.assignedToId,
          }));
          return tasks;
        }),
  });

  let { data: teams } = useQuery({
    queryKey: ["teams", boardId],
    queryFn: fetchTeams(boardId ?? "-1"),
  });

  let { data: people } = useQuery({
    queryKey: ["people", boardId],
    queryFn: fetchPeople(boardId ?? "-1"),
  });

  const [isFiveLinerFormOpen, setIsFiveLinerFormOpen] = useState(false);
  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);
  const [isCreatePersonFormOpen, setIsCreatePersonFormOpen] = useState(false);
  const [isViewingTask, setIsViewingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<number>(-1);

  const [isViewingTeams, setIsViewingTeams] = useState(false);

  if (isLoading) return <Typography variant="h1">Loading...</Typography>;
  if (isError) return <Typography variant="h1">Error</Typography>;

  people = people ?? [];
  tasks = tasks ?? [];
  teams = teams ?? [];

  const handleClickCard = (id: number): void => {
    setSelectedTask(tasks?.find((t) => t.id == id)?.id ?? -1);
    setIsViewingTask(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#171717",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          padding: "10px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setIsCreatePersonFormOpen(true)}
        >
          Add Person
        </Button>
        {people.map((person) => (
          <PersonTasks
            key={person.id}
            person={person}
            tasks={tasks.filter((t) => t.assignedToId === person.id)}
            teams={teams}
            onClickCard={handleClickCard}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "calc(100% - 250px)", // Adjust width to account for the fixed left component
          marginLeft: "250px", // Ensure the right component starts after the left component
          flexGrow: 1,
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
          people={people ?? []}
          onClickCard={handleClickCard}
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
        <CreatePersonForm
          isOpen={isCreatePersonFormOpen}
          boardId={boardId ?? "-1"}
          onClose={() => setIsCreatePersonFormOpen(false)}
        />
        <TaskDetailsModal
          isOpen={isViewingTask}
          setIsModalOpen={setIsViewingTask}
          task={tasks?.find((t) => t.id === selectedTask) ?? UndefinedTask}
          teams={teams ?? []}
          people={people ?? []}
        />
        <TeamListModal
          teams={teams ?? []}
          isOpen={isViewingTeams}
          onClose={() => setIsViewingTeams(false)}
          boardId={boardId ?? "-1"}
        />
      </Box>
    </Box>
  );
};

export default BoardPage;
