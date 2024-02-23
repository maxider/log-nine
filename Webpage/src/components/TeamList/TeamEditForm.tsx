import { Box, Button, Modal, Paper, SxProps, TextField } from "@mui/material";
import Team from "../../entities/Team";
import { useState } from "react";
import { updateTeamFn } from "../../api/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TeamEditFormProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
}

const TeamEditForm = ({ team, isOpen, onClose }: TeamEditFormProps) => {
  const [teamName, setTeamName] = useState(team.name);
  const [srFrequency, setSrFrequency] = useState(team.srFrequency);
  const [lrFrequency, setLrFrequency] = useState(team.lrFrequency);
  const [hasChanges, setHasChanges] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: updateTeam } = useMutation({
    mutationFn: updateTeamFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teams"] }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateTeam({
      id: team.id,
      params: {
        name: teamName,
        boardId: team.boardId,
        srFrequency: srFrequency,
        lrFrequency: lrFrequency,
      },
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
              label={"Name"}
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                setHasChanges(true);
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
                label={"SrFreq"}
                value={srFrequency}
                onChange={(e) => {
                  setSrFrequency(parseFloat(e.target.value));
                  setHasChanges(true);
                }}
              />
              <TextField
                label={"LrFreq"}
                value={lrFrequency}
                onChange={(e) => {
                  setLrFrequency(parseFloat(e.target.value));
                  setHasChanges(true);
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
                disabled={!hasChanges}
                type="submit"
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  setHasChanges(false);
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

export default TeamEditForm;
