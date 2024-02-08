import { Backdrop, Button, Paper } from "@mui/material";
import BackdropProps from "../props/BackdropProps";
import { useSelector } from "react-redux";
import { selectTeamById } from "../state/Selectors/TeamSelectors";
import { RootState } from "../state/store";

interface TeamEditBackdropProps extends BackdropProps {
  teamId: number;
}

const TeamEditBackdrop: React.FC<TeamEditBackdropProps> = ({
  onClose,
  open,
  teamId,
}) => {
  const team = useSelector((state: RootState) => selectTeamById(state, teamId));

  return (
    <Backdrop open={open}>
      <Paper className="flex flex-col bg-neutral-800">
        <h1>Team Edit</h1>
        <h1>{team?.name}</h1>
        <div className="flex flex-row justify-between">
          <Button>Save</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Paper>
    </Backdrop>
  );
};

export default TeamEditBackdrop;
