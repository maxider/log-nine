import { Divider, Paper } from "@mui/material";
import { Team } from "../types/Task";

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <Paper className="flex flex-row items-center justify-center p-1 w-248">
      <h3 className="flex-auto m-2">{team.name}</h3>
      <Divider orientation="vertical" flexItem />
      <p className="m-2">{`Sr: ${team.freqSr} Lr: ${team.freqLr}`}</p>
    </Paper>
  );
};

export default TeamCard;
