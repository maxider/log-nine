import { Box, Stack, styled } from "@mui/material";

export const StyledTaskList = styled(Stack)({
  width: "100%",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(100, 181, 246, 0.2)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
  },
});

export const StyledTaskListHeader = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "8px 12px",
  marginBottom: "8px",
  backgroundColor: "rgba(100, 181, 246, 0.08)",
  borderRadius: "8px",
  border: "1px solid rgba(100, 181, 246, 0.2)",
  
  "& h6": {
    fontWeight: 600,
    fontSize: "1rem",
    color: "#64b5f6",
    letterSpacing: "0.5px",
  },
});
