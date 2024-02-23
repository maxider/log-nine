import { Autocomplete, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchTeams } from "../helpers/api";

interface Props {
  boardId: string;
  setTargetId: (id: number) => void;
  required: boolean;
}

const TeamComboBox = ({ boardId, setTargetId, required }: Props) => {
  const { data: teams } = useQuery({
    queryKey: ["teams", 1],
    queryFn: fetchTeams(boardId),
  });

  const teamOptions = useMemo(() => {
    if (!teams) return [];
    return teams.map((team) => {
      return { label: team.name, id: team.id };
    });
  }, [teams]);

  return (
    <Autocomplete
      onChange={(e, v) => setTargetId(v?.id ?? -1)}
      renderInput={(params) => (
        <TextField {...params} label={"Target"} required={required} />
      )}
      options={teamOptions}
    />
  );
};

export default TeamComboBox;
