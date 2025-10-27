import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Grid,
  Modal,
  Paper,
  TextField,
  IconButton,
  Fade,
  Chip,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import backendUrl from "../api/BackendUrl";

interface Board {
  id: number;
  title: string;
  isPasswordProtected: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardPassword, setNewBoardPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinBoardId, setJoinBoardId] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [showJoinPassword, setShowJoinPassword] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Admin state
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);

  // Edit Board state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editBoardTitle, setEditBoardTitle] = useState("");
  const [editBoardPassword, setEditBoardPassword] = useState("");
  const [editBoardNewPassword, setEditBoardNewPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showEditNewPassword, setShowEditNewPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all boards
  const { data: boards, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/Boards`);
      if (!response.ok) throw new Error("Failed to fetch boards");
      return response.json() as Promise<Board[]>;
    },
  });

  // Create board mutation
  const createBoardMutation = useMutation({
    mutationFn: async (params: { title: string; password?: string }) => {
      const response = await fetch(`${backendUrl}/Boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: params.title,
          password: params.password || null
        }),
      });
      if (!response.ok) throw new Error("Failed to create board");
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      const message = variables.password 
        ? "Board created successfully with password protection" 
        : "Board created successfully";
      enqueueSnackbar(message, { variant: "success" });
      
      // Store password in session storage for later viewing
      if (variables.password) {
        sessionStorage.setItem(`board_${data.id}_unlocked`, "true");
        sessionStorage.setItem(`board_${data.id}_password`, variables.password);
      }
      
      setIsCreateModalOpen(false);
      setNewBoardTitle("");
      setNewBoardPassword("");
      setShowPassword(false);
      
      navigate(`/board/${data.id}`);
    },
    onError: () => {
      enqueueSnackbar("Failed to create board", { variant: "error" });
    },
  });

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      createBoardMutation.mutate({
        title: newBoardTitle.trim(),
        password: newBoardPassword.trim() || undefined
      });
    }
  };

  const handleJoinBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinBoardId.trim()) {
      enqueueSnackbar("Please enter a Board ID", { variant: "warning" });
      return;
    }

    setIsJoining(true);

    try {
      // First check if board exists
      const boardResponse = await fetch(`${backendUrl}/Boards/${joinBoardId}`);
      
      if (!boardResponse.ok) {
        enqueueSnackbar("Board not found", { variant: "error" });
        setIsJoining(false);
        return;
      }

      const boardData = await boardResponse.json();

      // If board is password protected, verify password
      if (boardData.isPasswordProtected) {
        if (!joinPassword.trim()) {
          enqueueSnackbar("This board requires a password", { variant: "warning" });
          setIsJoining(false);
          return;
        }

        const verifyResponse = await fetch(`${backendUrl}/Boards/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            boardId: parseInt(joinBoardId), 
            password: joinPassword 
          }),
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResponse.ok || !verifyResult.success) {
          enqueueSnackbar(verifyResult.message || "Invalid password", { variant: "error" });
          setJoinPassword("");
          setIsJoining(false);
          return;
        }

        // Store in session with password for later viewing
        sessionStorage.setItem(`board_${joinBoardId}_unlocked`, "true");
        sessionStorage.setItem(`board_${joinBoardId}_password`, joinPassword);
      }

      // Success - navigate to board
      enqueueSnackbar(`Joining board: ${boardData.title}`, { variant: "success" });
      setIsJoinModalOpen(false);
      setJoinBoardId("");
      setJoinPassword("");
      setShowJoinPassword(false);
      navigate(`/board/${joinBoardId}`);
      
    } catch (error) {
      enqueueSnackbar("Failed to join board", { variant: "error" });
    } finally {
      setIsJoining(false);
    }
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      enqueueSnackbar(`${label} copied to clipboard!`, { variant: "success" });
    }).catch(() => {
      enqueueSnackbar(`Failed to copy ${label}`, { variant: "error" });
    });
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminPassword.trim()) {
      enqueueSnackbar("Please enter admin password", { variant: "warning" });
      return;
    }

    setIsVerifyingAdmin(true);

    try {
      const response = await fetch(`${backendUrl}/api/Admin/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_password", adminPassword);
        setIsAdminMode(true);
        setIsAdminModalOpen(false);
        setAdminPassword("");
        setShowAdminPassword(false);
        enqueueSnackbar("Admin mode activated", { variant: "success" });
      } else {
        enqueueSnackbar(result.message || "Invalid admin password", { variant: "error" });
        setAdminPassword("");
      }
    } catch (error) {
      enqueueSnackbar("Failed to verify admin password", { variant: "error" });
    } finally {
      setIsVerifyingAdmin(false);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_password");
    setIsAdminMode(false);
    enqueueSnackbar("Admin mode deactivated", { variant: "info" });
  };

  const handleDeleteBoard = async (boardId: number, boardTitle: string) => {
    if (!window.confirm(`Wirklich Board "${boardTitle}" löschen?\n\nAlle Tasks, Teams und Personen werden ebenfalls gelöscht!`)) {
      return;
    }

    try {
      const adminPass = sessionStorage.getItem("admin_password");
      const response = await fetch(`${backendUrl}/Boards/${boardId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword: adminPass }),
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["boards"] });
        enqueueSnackbar(`Board "${boardTitle}" deleted successfully`, { variant: "success" });
      } else {
        const error = await response.json();
        enqueueSnackbar(error.message || "Failed to delete board", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to delete board", { variant: "error" });
    }
  };

  const handleBoardClick = (boardId: number) => {
    // If admin mode, bypass password protection
    if (isAdminMode) {
      const adminPass = sessionStorage.getItem("admin_password");
      sessionStorage.setItem(`board_${boardId}_admin_access`, "true");
      sessionStorage.setItem(`board_${boardId}_admin_password`, adminPass || "");
    }
    navigate(`/board/${boardId}`);
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setEditBoardTitle(board.title);
    
    // Try to get the current password from sessionStorage (for display only)
    const storedPassword = sessionStorage.getItem(`board_${board.id}_password`);
    setEditBoardPassword(storedPassword || "");
    
    // Clear new password field
    setEditBoardNewPassword("");
    
    setShowEditPassword(false);
    setShowEditNewPassword(false);
    setIsEditModalOpen(true);
  };

  const handleUpdateBoard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBoard) return;

    if (!editBoardTitle.trim()) {
      enqueueSnackbar("Board title cannot be empty", { variant: "warning" });
      return;
    }

    setIsUpdating(true);

    try {
      const adminPass = sessionStorage.getItem("admin_password");
      const response = await fetch(`${backendUrl}/Boards/${editingBoard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          adminPassword: adminPass,
          title: editBoardTitle.trim(),
          password: editBoardNewPassword || null
        }),
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["boards"] });
        
        // Update stored password if a new one was set
        if (editBoardNewPassword) {
          sessionStorage.setItem(`board_${editingBoard.id}_password`, editBoardNewPassword);
        }
        
        const message = editBoardNewPassword 
          ? `Board "${editBoardTitle}" updated with new password` 
          : `Board "${editBoardTitle}" updated`;
        enqueueSnackbar(message, { variant: "success" });
        setIsEditModalOpen(false);
        setEditingBoard(null);
        setEditBoardTitle("");
        setEditBoardPassword("");
        setEditBoardNewPassword("");
      } else {
        const error = await response.json();
        enqueueSnackbar(error.message || "Failed to update board", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to update board", { variant: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1a2e 100%)",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Header Bar - Full Width */}
      <Box
        sx={{
          background: "rgba(30, 33, 57, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(100, 181, 246, 0.2)",
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src="/Logo.png"
            alt="Log-Nine Logo"
            sx={{
              height: 50,
              width: "auto",
              objectFit: "contain",
            }}
          />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #64b5f6 30%, #42a5f5 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Log-Nine
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Logistics Kanban Planning Tool
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {isAdminMode && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                paddingX: 2,
                paddingY: 1,
                borderRadius: "8px",
                backgroundColor: "rgba(255, 87, 34, 0.15)",
                border: "1px solid rgba(255, 87, 34, 0.5)",
              }}
            >
              <AdminPanelSettingsIcon sx={{ color: "#ff5722", fontSize: 24 }} />
              <Typography variant="body2" sx={{ color: "#ff5722", fontWeight: 600 }}>
                Admin Mode
              </Typography>
            </Box>
          )}
          
          {isAdminMode ? (
            <Button
              variant="outlined"
              size="large"
              startIcon={<LogoutIcon />}
              onClick={handleAdminLogout}
              sx={{
                paddingX: 3,
                paddingY: 1.5,
                fontSize: "1rem",
                borderColor: "#ff5722",
                color: "#ff5722",
                "&:hover": {
                  borderColor: "#f4511e",
                  backgroundColor: "rgba(255, 87, 34, 0.1)",
                },
              }}
            >
              Admin Logout
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => setIsAdminModalOpen(true)}
              sx={{
                paddingX: 3,
                paddingY: 1.5,
                fontSize: "1rem",
                borderColor: "#ff5722",
                color: "#ff5722",
                "&:hover": {
                  borderColor: "#f4511e",
                  backgroundColor: "rgba(255, 87, 34, 0.1)",
                },
              }}
            >
              Admin Login
            </Button>
          )}
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<LoginIcon />}
            onClick={() => setIsJoinModalOpen(true)}
            sx={{
              paddingX: 3,
              paddingY: 1.5,
              fontSize: "1rem",
              borderColor: "#64b5f6",
              color: "#64b5f6",
              "&:hover": {
                borderColor: "#42a5f5",
                backgroundColor: "rgba(100, 181, 246, 0.1)",
              },
            }}
          >
            Join Board
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
            sx={{
              paddingX: 4,
              paddingY: 1.5,
              fontSize: "1rem",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 10px 2px rgba(33, 203, 243, .3)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976d2 30%, #1cb5e0 90%)",
                boxShadow: "0 5px 15px 4px rgba(33, 203, 243, .4)",
              },
            }}
          >
            Create New Board
          </Button>
        </Box>
      </Box>

      {/* Boards Grid - Full Width */}
      <Box sx={{ 
        flex: 1, 
        padding: { xs: "16px", sm: "24px", md: "32px", lg: "40px" },
        overflowY: "auto", 
        width: "100%",
        boxSizing: "border-box",
        maxWidth: "1920px",
        margin: "0 auto",
      }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
            <Typography variant="h6" color="text.secondary">
              Loading boards...
            </Typography>
          </Box>
        ) : boards && boards.length > 0 ? (
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              "& .MuiGrid-item": {
                display: "flex",
              }
            }}
          >
            {boards.map((board) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3} 
                xl={3}
                key={board.id}
                sx={{ display: "flex" }}
              >
                <Fade in timeout={500} style={{ width: "100%", display: "flex" }}>
                  <Card
                    sx={{
                      height: "100%",
                      width: "100%",
                      minHeight: 240,
                      background: "linear-gradient(135deg, #1e2139 0%, #252a44 100%)",
                      border: isAdminMode 
                        ? "2px solid rgba(255, 87, 34, 0.6)" 
                        : "1px solid rgba(100, 181, 246, 0.2)",
                      transition: "all 0.3s ease-in-out",
                      position: "relative",
                      borderRadius: "16px",
                      overflow: "visible",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        border: isAdminMode 
                          ? "2px solid rgba(255, 87, 34, 0.9)" 
                          : "1px solid rgba(100, 181, 246, 0.5)",
                        boxShadow: isAdminMode 
                          ? "0 16px 40px rgba(255, 87, 34, 0.4)" 
                          : "0 16px 40px rgba(33, 150, 243, 0.4)",
                      },
                    }}
                  >
                    {isAdminMode && (
                      <>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBoard(board);
                          }}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 56,
                            zIndex: 10,
                            backgroundColor: "rgba(255, 152, 0, 0.9)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(245, 124, 0, 1)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBoard(board.id, board.title);
                          }}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 10,
                            backgroundColor: "rgba(244, 67, 54, 0.9)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(211, 47, 47, 1)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                    <CardActionArea
                      onClick={() => handleBoardClick(board.id)}
                      sx={{ height: "100%", padding: 4 }}
                    >
                      <CardContent sx={{ padding: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 3 }}>
                          <Box
                            component="img"
                            src="/Board-Card.png"
                            alt="Board Icon"
                            sx={{
                              height: 48,
                              width: 48,
                              objectFit: "contain",
                              flexShrink: 0,
                              filter: "drop-shadow(0 2px 8px rgba(100, 181, 246, 0.3))",
                            }}
                          />
                          {board.isPasswordProtected && (
                            <LockIcon sx={{ color: "#ffa726", fontSize: 28 }} />
                          )}
                        </Box>
                        <Typography 
                          variant="h5" 
                          component="div" 
                          sx={{ 
                            fontWeight: 600,
                            marginBottom: 2,
                            wordBreak: "break-word",
                            fontSize: "1.5rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {board.title}
                        </Typography>
                        <Divider sx={{ marginY: 2, borderColor: "rgba(100, 181, 246, 0.1)" }} />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                          <Chip
                            label={`ID: ${board.id}`}
                            size="small"
                            icon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(board.id.toString(), "Board ID");
                            }}
                            sx={{
                              backgroundColor: "rgba(100, 181, 246, 0.1)",
                              color: "#64b5f6",
                              fontWeight: 500,
                              border: "1px solid rgba(100, 181, 246, 0.3)",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "rgba(100, 181, 246, 0.2)",
                                border: "1px solid rgba(100, 181, 246, 0.5)",
                              },
                              "& .MuiChip-icon": {
                                color: "#64b5f6",
                              },
                            }}
                          />
                          {board.isPasswordProtected && (
                            <Chip
                              icon={<LockIcon />}
                              label="Protected"
                              size="small"
                              sx={{
                                backgroundColor: "rgba(255, 167, 38, 0.1)",
                                color: "#ffa726",
                                fontWeight: 500,
                                border: "1px solid rgba(255, 167, 38, 0.3)",
                                "& .MuiChip-icon": {
                                  color: "#ffa726",
                                },
                              }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
            <Box
              component="img"
              src="/Board-Card.png"
              alt="No Boards"
              sx={{
                height: 80,
                width: 80,
                objectFit: "contain",
                opacity: 0.1,
                marginBottom: 2,
              }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No boards yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
              Create your first board to get started
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateModalOpen(true)}
              sx={{
                borderColor: "#64b5f6",
                color: "#64b5f6",
                "&:hover": {
                  borderColor: "#42a5f5",
                  backgroundColor: "rgba(100, 181, 246, 0.1)",
                },
              }}
            >
              Create Your First Board
            </Button>
          </Box>
        )}
      </Box>

      {/* Create Board Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isCreateModalOpen}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              background: "linear-gradient(135deg, #1e2139 0%, #252a44 100%)",
              border: "1px solid rgba(100, 181, 246, 0.3)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Create New Board
              </Typography>
              <IconButton onClick={() => setIsCreateModalOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <form onSubmit={handleCreateBoard}>
              <TextField
                fullWidth
                label="Board Title"
                variant="outlined"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                required
                inputProps={{ maxLength: 200 }}
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#64b5f6",
                    },
                  },
                }}
                autoFocus
              />
              
              <TextField
                fullWidth
                label="Password (Optional)"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={newBoardPassword}
                onChange={(e) => setNewBoardPassword(e.target.value)}
                placeholder="Leave empty for no password protection"
                inputProps={{ maxLength: 100 }}
                sx={{
                  marginBottom: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#64b5f6",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                  startAdornment: newBoardPassword ? (
                    <LockIcon sx={{ marginRight: 1, color: "#64b5f6" }} />
                  ) : (
                    <LockOpenIcon sx={{ marginRight: 1, color: "text.secondary" }} />
                  ),
                }}
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", marginBottom: 3 }}>
                {newBoardPassword 
                  ? "🔒 This board will be password protected" 
                  : "🔓 This board will be accessible to everyone"}
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewBoardTitle("");
                    setNewBoardPassword("");
                    setShowPassword(false);
                  }}
                  variant="outlined"
                  sx={{ paddingX: 3 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    paddingX: 3,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  }}
                  disabled={createBoardMutation.isPending}
                >
                  {createBoardMutation.isPending ? "Creating..." : "Create Board"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Modal>

      {/* Join Board Modal */}
      <Modal
        open={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isJoinModalOpen}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              background: "linear-gradient(135deg, #1e2139 0%, #252a44 100%)",
              border: "1px solid rgba(100, 181, 246, 0.3)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LoginIcon sx={{ color: "#64b5f6", fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Join Board
                </Typography>
              </Box>
              <IconButton onClick={() => {
                setIsJoinModalOpen(false);
                setJoinBoardId("");
                setJoinPassword("");
                setShowJoinPassword(false);
              }} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
              Enter the Board ID and password (if required) to join an existing board.
            </Typography>
            <form onSubmit={handleJoinBoard}>
              <TextField
                fullWidth
                label="Board ID"
                variant="outlined"
                type="number"
                value={joinBoardId}
                onChange={(e) => setJoinBoardId(e.target.value)}
                required
                placeholder="e.g. 1, 2, 3..."
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#64b5f6",
                    },
                  },
                }}
                autoFocus
              />
              
              <TextField
                fullWidth
                label="Password (if protected)"
                variant="outlined"
                type={showJoinPassword ? "text" : "password"}
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
                placeholder="Leave empty if board is not protected"
                inputProps={{ maxLength: 100 }}
                sx={{
                  marginBottom: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#64b5f6",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowJoinPassword(!showJoinPassword)}
                      edge="end"
                      size="small"
                    >
                      {showJoinPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                  startAdornment: joinPassword ? (
                    <LockIcon sx={{ marginRight: 1, color: "#64b5f6" }} />
                  ) : (
                    <LockOpenIcon sx={{ marginRight: 1, color: "text.secondary" }} />
                  ),
                }}
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", marginBottom: 3 }}>
                💡 Tip: You can find the Board ID on the board cards or in the URL
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setIsJoinModalOpen(false);
                    setJoinBoardId("");
                    setJoinPassword("");
                    setShowJoinPassword(false);
                  }}
                  variant="outlined"
                  sx={{ paddingX: 3 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    paddingX: 3,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  }}
                  disabled={isJoining}
                >
                  {isJoining ? "Joining..." : "Join Board"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Modal>

      {/* Admin Login Modal */}
      <Modal
        open={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isAdminModalOpen}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 450 },
              background: "linear-gradient(135deg, #1e2139 0%, #252a44 100%)",
              border: "2px solid rgba(255, 87, 34, 0.5)",
              boxShadow: "0 24px 48px rgba(255, 87, 34, 0.3)",
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AdminPanelSettingsIcon sx={{ color: "#ff5722", fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#ff5722" }}>
                  Admin Login
                </Typography>
              </Box>
              <IconButton onClick={() => {
                setIsAdminModalOpen(false);
                setAdminPassword("");
                setShowAdminPassword(false);
              }} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
              🔐 Enter the admin password to access administrator functions (delete boards, bypass password protection).
            </Typography>
            <form onSubmit={handleAdminLogin}>
              <TextField
                fullWidth
                label="Admin Password"
                variant="outlined"
                type={showAdminPassword ? "text" : "password"}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                inputProps={{ maxLength: 100 }}
                sx={{
                  marginBottom: 3,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#ff5722",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff5722",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff5722",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      edge="end"
                      size="small"
                    >
                      {showAdminPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                  startAdornment: (
                    <LockIcon sx={{ marginRight: 1, color: "#ff5722" }} />
                  ),
                }}
                autoFocus
              />
              
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setIsAdminModalOpen(false);
                    setAdminPassword("");
                    setShowAdminPassword(false);
                  }}
                  variant="outlined"
                  sx={{ 
                    paddingX: 3,
                    borderColor: "#ff5722",
                    color: "#ff5722",
                    "&:hover": {
                      borderColor: "#f4511e",
                      backgroundColor: "rgba(255, 87, 34, 0.1)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{
                    paddingX: 3,
                    background: "linear-gradient(45deg, #ff5722 30%, #f4511e 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #f4511e 30%, #e64a19 90%)",
                    },
                  }}
                  disabled={isVerifyingAdmin}
                >
                  {isVerifyingAdmin ? "Verifying..." : "Login as Admin"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Modal>

      {/* Edit Board Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isEditModalOpen}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              background: "linear-gradient(135deg, #1e2139 0%, #252a44 100%)",
              border: "2px solid rgba(255, 152, 0, 0.5)",
              boxShadow: "0 24px 48px rgba(255, 152, 0, 0.3)",
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <EditIcon sx={{ color: "#ff9800", fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Edit Board
                </Typography>
              </Box>
              <IconButton onClick={() => {
                setIsEditModalOpen(false);
                setEditingBoard(null);
                setEditBoardTitle("");
                setEditBoardPassword("");
                setEditBoardNewPassword("");
                setShowEditPassword(false);
                setShowEditNewPassword(false);
              }} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
              ✏️ Update board title and/or password.
            </Typography>
            <form onSubmit={handleUpdateBoard}>
              <TextField
                fullWidth
                label="Board Title"
                variant="outlined"
                value={editBoardTitle}
                onChange={(e) => setEditBoardTitle(e.target.value)}
                required
                inputProps={{ maxLength: 200 }}
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#ff9800",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff9800",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff9800",
                  },
                }}
                autoFocus
              />

              {/* Current Password Info */}
              <Box
                sx={{
                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                  border: "1px solid rgba(255, 152, 0, 0.3)",
                  borderRadius: "8px",
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                  {editingBoard?.isPasswordProtected ? (
                    <LockIcon sx={{ color: "#ff9800", fontSize: 20 }} />
                  ) : (
                    <LockOpenIcon sx={{ color: "#ff9800", fontSize: 20 }} />
                  )}
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#ff9800" }}>
                    Current Status: {editingBoard?.isPasswordProtected ? "Password Protected" : "No Password"}
                  </Typography>
                </Box>
                
                {editingBoard?.isPasswordProtected && (
                  <>
                    {editBoardPassword && sessionStorage.getItem(`board_${editingBoard.id}_password`) ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Password:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontFamily: "monospace", color: "#ff9800" }}>
                            {showEditPassword ? editBoardPassword : "•".repeat(editBoardPassword.length)}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => setShowEditPassword(!showEditPassword)}
                            sx={{ padding: "2px" }}
                          >
                            {showEditPassword ? <VisibilityOffIcon sx={{ fontSize: 16 }} /> : <VisibilityIcon sx={{ fontSize: 16 }} />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleCopyToClipboard(editBoardPassword, "Password")}
                            sx={{ padding: "2px" }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        ⚠️ Current password is not available (securely hashed). You can set a new password below.
                      </Typography>
                    )}
                  </>
                )}
              </Box>
              
              <TextField
                fullWidth
                label="New Password (Optional)"
                variant="outlined"
                type={showEditNewPassword ? "text" : "password"}
                value={editBoardNewPassword}
                onChange={(e) => setEditBoardNewPassword(e.target.value)}
                placeholder="Leave empty to keep current password"
                inputProps={{ maxLength: 100 }}
                sx={{
                  marginBottom: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#ff9800",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff9800",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff9800",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowEditNewPassword(!showEditNewPassword)}
                      edge="end"
                      size="small"
                    >
                      {showEditNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                  startAdornment: editBoardNewPassword ? (
                    <LockIcon sx={{ marginRight: 1, color: "#ff9800" }} />
                  ) : (
                    <LockOpenIcon sx={{ marginRight: 1, color: "text.secondary" }} />
                  ),
                }}
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", marginBottom: 3 }}>
                💡 Tip: Leave password field empty to keep the current password unchanged
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingBoard(null);
                    setEditBoardTitle("");
                    setEditBoardPassword("");
                    setEditBoardNewPassword("");
                    setShowEditPassword(false);
                    setShowEditNewPassword(false);
                  }}
                  variant="outlined"
                  sx={{ 
                    paddingX: 3,
                    borderColor: "#ff9800",
                    color: "#ff9800",
                    "&:hover": {
                      borderColor: "#f57c00",
                      backgroundColor: "rgba(255, 152, 0, 0.1)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    paddingX: 3,
                    background: "linear-gradient(45deg, #ff9800 30%, #f57c00 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #f57c00 30%, #ef6c00 90%)",
                    },
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Home;
