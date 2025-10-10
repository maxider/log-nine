import { useState } from "react";
import FormProps from "../helpers/FormProps";
import useCreatePerson from "../hooks/useCreatePerson";
import { Box, Button, Modal, Paper, SxProps, TextField } from "@mui/material";

const CreatePersonForm = ({ isOpen, boardId, onClose }: FormProps) => {
  const [name, setName] = useState("");

  const resetState = () => {
    setName("");
  };

  const createPerson = useCreatePerson();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || name.trim().length > 100) {
      return;
    }

    try {
      await createPerson({
        name: name.trim(),
        boardId: parseInt(boardId),
      });

      resetState();
      onClose();
    } catch (error) {
      console.error("Error creating person:", error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper sx={style}>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              inputProps={{ maxLength: 100 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </Box>
        </form>
      </Paper>
    </Modal>
  );
};

const style: SxProps = {
  position: "absolute",
  p: "10px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "33%",
  height: "33%",
  maxHeight: "80%",
  overflow: "auto",
  ":focus-visible": {
    outline: "none",
  },
};

export default CreatePersonForm;
