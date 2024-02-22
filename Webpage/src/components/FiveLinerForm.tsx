import { Button, Modal, Paper, TextField } from "@mui/material";

const FiveLinerForm = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <Modal open={isOpen}>
      <Paper sx={style}>
        <form>
          <TextField label={"Ortsangabe"} required />
        </form>
        <Button>Meep</Button>
      </Paper>
    </Modal>
  );
};

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "33%",
  height: "80%",
  overflow: "auto",
  ":focus-visible": {
    outline: "none",
  },
};

export default FiveLinerForm;
