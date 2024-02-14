import { Button } from "@mui/material";

interface HeaderProps {
  onClickShowTeams: () => void;
}

const Header = ({ onClickShowTeams }) => {
  return (
    <div className="flex flex-row items-center justify-center h-10 gap-4 p-2 bg-neutral-900">
      <Button onClick={onClickShowTeams}>Show Teams</Button>
      <Button>Add Task</Button>
    </div>
  );
};

export default Header;
