import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { selectTeamsByBoardId } from "../state/Selectors/TeamSelectors";
import TeamCard from "./TeamCard";
import useParamsNumber from "../hooks/useParamsNumber";

interface TeamsLaneProps {}

const TeamsLane: React.FC<TeamsLaneProps> = () => {
  const boardId = useParamsNumber();
  const teams = useSelector((state: RootState) =>
    selectTeamsByBoardId(state, boardId)
  );

  return (
    <div className="flex flex-col items-center flex-grow gap-1 m-2">
      <h1>Teams</h1>
      {teams.map((t) => (
        <TeamCard key={t.id} team={t} />
      ))}
    </div>
  );
};

export default TeamsLane;
