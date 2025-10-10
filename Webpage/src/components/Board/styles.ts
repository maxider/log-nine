import styled from "@emotion/styled";
import Box from "@mui/material/Box";

const StyledBoard = styled(Box)({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gridAutoRows: "auto",
  alignItems: "start",
  gap: "16px",
  overflowX: "auto",
  
  // Smooth scrolling for mobile
  scrollBehavior: "smooth",
  
  // Responsive grid
  "@media (max-width: 1600px)": {
    gridTemplateColumns: "repeat(5, minmax(260px, 1fr))",
  },
  "@media (max-width: 1200px)": {
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  },
  "@media (max-width: 900px)": {
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
  
  // Custom scrollbar styling
  "&::-webkit-scrollbar": {
    height: "8px",
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
});

export default StyledBoard;