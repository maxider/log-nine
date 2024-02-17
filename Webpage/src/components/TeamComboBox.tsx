import { useSelector } from "react-redux";
import useParamsNumber from "../hooks/useParamsNumber";
import { selectTeamsByBoardId } from "../state/Selectors/TeamSelectors";
import { RootState } from "../state/store";
import { Autocomplete } from "@mui/material";
import { InputField } from "./FiveLinerForm";

interface TeamComboBoxProps {}

const TeamComboBox: React.FC<TeamComboBoxProps> = () => {
  const boardId = useParamsNumber();
  const teams = useSelector((state: RootState) =>
    selectTeamsByBoardId(state, boardId)
  );

  return (
    <Autocomplete
      options={teams.map((t) => {
        return {
          label: t.name,
          id: t.id,
        };
      })}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <InputField {...params} required label={"Team"} />
      )}
    />
  );
};

export default TeamComboBox;
