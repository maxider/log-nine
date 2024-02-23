import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import Team, { UndefinedTeam } from "../../entities/Team";
import TeamEditForm from "./TeamEditForm";
import TeamCreateForm from "./TeamCreateForm";

interface Props {
  teams: Team[];
  isOpen: boolean;
  boardId: string;
  onClose: () => void;
}

const TeamListModal = ({ teams, isOpen, onClose, boardId }: Props) => {
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team>();

  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  teams.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Modal open={isOpen} onClose={onClose}>
      <>
        <Paper sx={style}>
          <Button variant="contained" onClick={() => setIsCreatingTeam(true)}>
            Create
          </Button>
          <Stack spacing={1}>
            {teams.map((team) => (
              <TeamItem
                key={team.id}
                team={team}
                onClickEdit={(team) => {
                  setIsEditingTeam(true);
                  setSelectedTeam(team);
                }}
              />
            ))}
          </Stack>
        </Paper>
        <TeamEditForm
          isOpen={isEditingTeam}
          team={selectedTeam ?? UndefinedTeam}
          key={selectedTeam?.id}
          onClose={() => {
            setIsEditingTeam(false);
            setSelectedTeam(undefined);
          }}
        />
        <TeamCreateForm
          isOpen={isCreatingTeam}
          onClose={() => {
            setIsCreatingTeam(false);
          }}
          boardId={boardId}
        />
      </>
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
  display: "flex",
  flexDirection: "column",
  gap: 2,
  overflowY: "auto",
};

interface TeamItemProps {
  team: Team;
  onClickEdit: (team: Team) => void;
}

const TeamItem = ({ team, onClickEdit }: TeamItemProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography>{team.name}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>
          Sr: {team.srFrequency} Lr: {team.lrFrequency}
        </Typography>
        <Button onClick={() => onClickEdit(team)}>Edit</Button>
      </Box>
    </Box>
  );
};

export default TeamListModal;
