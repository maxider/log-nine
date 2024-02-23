import { Box, Button, Modal, Paper, SxProps, TextField } from "@mui/material";
import FormProps from "../../helpers/FormProps";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createTeamFn } from "../../api/mutations";

const TeamCreateForm = ({ isOpen, onClose, boardId }: FormProps) => {
  const [teamName, setTeamName] = useState<string>();
  const [srFrequency, setSrFrequency] = useState<number>();
  const [lrFrequency, setLrFrequency] = useState<number>();

  const queryClient = useQueryClient();

  const { mutateAsync: createTeam } = useMutation({
    mutationFn: createTeamFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teams"] }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createTeam({
      name: teamName ?? "",
      boardId: parseInt(boardId),
      srFrequency: srFrequency ?? 0,
      lrFrequency: lrFrequency ?? 0,
    });

    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper sx={style}>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              required
              label={"Name"}
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
              }}
              fullWidth
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <TextField
                required
                label={"SrFreq"}
                value={srFrequency}
                onChange={(e) => {
                  setSrFrequency(parseInt(e.target.value));
                }}
              />
              <TextField
                required
                label={"LrFreq"}
                value={lrFrequency}
                onChange={(e) => {
                  setLrFrequency(parseInt(e.target.value));
                }}
              />
            </Box>
            <Box
              sx={{
                alignSelf: "center",
              }}
            >
              <Button
                sx={{
                  width: "60px",
                }}
                variant="contained"
                type="submit"
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Modal>
  );
};

const style: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: "80vh",
  p: 4,
};

export default TeamCreateForm;
