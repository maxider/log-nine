import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import Board from "../components/Board/Board";
import { useSocket } from "../hooks/useSocket";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Modal, 
  Paper, 
  TextField 
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Task, { TaskStatus, UndefinedTask } from "../entities/Task";
import FiveLinerForm from "../components/FiveLinerForm";
import { useState, useEffect } from "react";
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
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showBoardPassword, setShowBoardPassword] = useState(false);
  const [boardPassword, setBoardPassword] = useState<string | null>(null);

  // Check if board info exists and if it's password protected
  const { data: boardInfo } = useQuery({
    queryKey: ["board", boardId],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/Boards/${boardId}`);
      if (!response.ok) throw new Error("Failed to fetch board");
      return response.json();
    },
    enabled: !!boardId,
  });

  // Check session storage for unlocked status, password, and admin access
  useEffect(() => {
    if (boardId) {
      // Check for admin access first
      const adminAccess = sessionStorage.getItem(`board_${boardId}_admin_access`);
      const adminPassword = sessionStorage.getItem(`board_${boardId}_admin_password`);
      
      if (adminAccess === "true" && adminPassword) {
        // Admin bypass - verify with backend
        const verifyAdminAccess = async () => {
          try {
            const response = await fetch(`${backendUrl}/Boards/${boardId}/admin-access`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ adminPassword }),
            });

            if (response.ok) {
              setIsUnlocked(true);
              setBoardPassword("(Admin Access)");
              return;
            }
          } catch (error) {
            console.error("Admin access verification failed:", error);
          }
          
          // If admin verification fails, fall through to normal password check
          sessionStorage.removeItem(`board_${boardId}_admin_access`);
          sessionStorage.removeItem(`board_${boardId}_admin_password`);
        };
        
        verifyAdminAccess();
        return;
      }
      
      // Normal password check
      const unlocked = sessionStorage.getItem(`board_${boardId}_unlocked`);
      const storedPassword = sessionStorage.getItem(`board_${boardId}_password`);
      
      if (storedPassword) {
        setBoardPassword(storedPassword);
      }
      
      if (unlocked === "true") {
        setIsUnlocked(true);
      }
    }
  }, [boardId, boardInfo]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const response = await fetch(`${backendUrl}/Boards/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId: parseInt(boardId!), password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        sessionStorage.setItem(`board_${boardId}_unlocked`, "true");
        sessionStorage.setItem(`board_${boardId}_password`, password);
        setBoardPassword(password);
        setIsUnlocked(true);
        setPassword("");
        enqueueSnackbar("Access granted", { variant: "success" });
      } else {
        enqueueSnackbar(result.message || "Invalid password", { variant: "error" });
        setPassword("");
      }
    } catch (error) {
      enqueueSnackbar("Failed to verify password", { variant: "error" });
    } finally {
      setIsVerifying(false);
    }
  };

  // Only fetch data if board is unlocked or not password protected
  const canLoadData = isUnlocked || (boardInfo && !boardInfo.isPasswordProtected);

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
    enabled: canLoadData,
  });

  let { data: teams } = useQuery({
    queryKey: ["teams", boardId],
    queryFn: fetchTeams(boardId ?? "-1"),
    enabled: canLoadData,
  });

  let { data: people } = useQuery({
    queryKey: ["people", boardId],
    queryFn: fetchPeople(boardId ?? "-1"),
    enabled: canLoadData,
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

  // If board is password protected and not unlocked, show only password modal
  if (boardInfo?.isPasswordProtected && !isUnlocked) {
    return (
      <Modal
        open={true}
        onClose={() => {}}
        disableEscapeKeyDown
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#1e293b",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <LockIcon sx={{ fontSize: 48, color: "#ffa726", mb: 2 }} />
            <Typography variant="h5" component="h2" sx={{ color: "#fff", fontWeight: 600 }}>
              Protected Board
            </Typography>
            <Typography sx={{ mt: 2, color: "#94a3b8" }}>
              This board is password protected. Please enter the password to continue.
            </Typography>
          </Box>

          <form onSubmit={handlePasswordSubmit}>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "#475569",
                  },
                  "&:hover fieldset": {
                    borderColor: "#64b5f6",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#64b5f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#94a3b8",
                },
              }}
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#94a3b8" }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Box>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  color: "#94a3b8",
                  borderColor: "#475569",
                  "&:hover": {
                    borderColor: "#64b5f6",
                    backgroundColor: "rgba(100, 181, 246, 0.1)",
                  },
                }}
              >
                Go Back
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isVerifying || !password.trim()}
                sx={{
                  bgcolor: "#64b5f6",
                  "&:hover": {
                    bgcolor: "#42a5f5",
                  },
                }}
              >
                {isVerifying ? "Verifying..." : "Unlock"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Modal>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        overflow: "hidden",
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
          padding: "16px",
          overflowY: "auto",
          overflowX: "hidden",
          
          // Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(100, 181, 246, 0.3)",
            borderRadius: "4px",
            "&:hover": {
              background: "rgba(100, 181, 246, 0.5)",
            },
          },
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
            tasks={(tasks ?? []).filter((t) =>  t.status != TaskStatus.DONE && t.status != TaskStatus.CANCELLED && t.assignedToId === person.id).sort((a,b) => b.priority - a.priority)}
            teams={teams ?? []}
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
          overflowY: "auto",
          overflowX: "hidden",
          
          // Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(100, 181, 246, 0.3)",
            borderRadius: "4px",
            "&:hover": {
              background: "rgba(100, 181, 246, 0.5)",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "row",
            width: "100%",
            minHeight: "auto",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: 3,
            paddingY: 2,
            background: "linear-gradient(135deg, rgba(30, 33, 57, 0.9) 0%, rgba(37, 42, 68, 0.95) 100%)",
            borderBottom: "1px solid rgba(100, 181, 246, 0.2)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(10px)",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: "0 1 auto" }}>
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                color: "#64b5f6",
                backgroundColor: "rgba(100, 181, 246, 0.08)",
                border: "1px solid rgba(100, 181, 246, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(100, 181, 246, 0.15)",
                  borderColor: "rgba(100, 181, 246, 0.4)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <HomeIcon />
            </IconButton>
            {boardInfo && (
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  {boardInfo.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  ID: {boardId}
                </Typography>
                {boardInfo.isPasswordProtected && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LockIcon sx={{ color: "#ffa726", fontSize: 20 }} />
                    {boardPassword && (
                      <Box sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        backgroundColor: "rgba(255, 167, 38, 0.08)",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        gap: 0.5,
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: "#ffa726",
                            fontFamily: "monospace",
                            fontSize: "0.8rem",
                            minWidth: showBoardPassword ? "auto" : `${boardPassword.length * 8}px`,
                            display: "inline-block",
                          }}
                        >
                          {showBoardPassword ? boardPassword : "•".repeat(boardPassword.length)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setShowBoardPassword(!showBoardPassword)}
                          sx={{
                            padding: "2px",
                            color: "#ffa726",
                            "&:hover": {
                              backgroundColor: "rgba(255, 167, 38, 0.15)",
                            },
                          }}
                        >
                          {showBoardPassword ? (
                            <VisibilityOffIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box sx={{ 
            display: "flex", 
            gap: 1.5,
            flex: "0 1 auto",
          }}>
            <Button
              variant="contained"
              onClick={() => setIsFiveLinerFormOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                padding: "8px 20px",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a4190 100%)",
                  boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              5-Liner
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsCreateTaskFormOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                padding: "8px 20px",
                boxShadow: "0 4px 12px rgba(100, 181, 246, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)",
                  boxShadow: "0 6px 16px rgba(100, 181, 246, 0.4)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Create Task
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setIsViewingTeams(true)}
              sx={{
                borderColor: "rgba(100, 181, 246, 0.5)",
                color: "#64b5f6",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                padding: "8px 20px",
                "&:hover": {
                  borderColor: "#64b5f6",
                  backgroundColor: "rgba(100, 181, 246, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              View Teams
            </Button>
          </Box>
        </Box>
        <Box sx={{ 
          display: "flex",
          padding: "16px",
          paddingBottom: "32px",
        }}>
          <Board
            tasks={tasks ?? []}
            teams={teams ?? []}
            onClickCard={handleClickCard}
          />
        </Box>
        <FiveLinerForm
          isOpen={isFiveLinerFormOpen}
          boardId={boardId ?? "-1"}
          onClose={() => setIsFiveLinerFormOpen(false)}
        />
        <CreateTaskForm
          isOpen={isCreateTaskFormOpen}
          boardId={boardId ?? "-1"}
          onClose={() => setIsCreateTaskFormOpen(false)}
          nextVisulId={tasks.length === 0 ? 0 : tasks[tasks.length - 1].visualId + 1}
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
