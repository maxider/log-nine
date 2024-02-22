import { Box, Stack, styled } from "@mui/material";

export const StyledTaskList = styled(Stack)({
  width: "248px",
  padding: "10px",
  minHeight: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  // outline: "1px solid red",
});

export const StyledTaskListHeader = styled(Box)({
  display: "flex",
  justifyContent: "center",
});
