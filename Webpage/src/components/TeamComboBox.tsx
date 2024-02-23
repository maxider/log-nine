import { Autocomplete, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchTeams } from "../api/api";

interface Props {
  boardId: string;
  setTargetId: (id: number) => void;
  required: boolean;
  value: number;
}

const TeamComboBox = ({ boardId, setTargetId, required, value }: Props) => {
  const { data: teams } = useQuery({
    queryKey: ["teams", boardId],
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
      onChange={(_, v) => setTargetId(v?.id ?? -1)}
      value={teamOptions.find((team) => team.id === value)}
      renderInput={(params) => (
        <TextField {...params} label={"Target"} required={required} />
      )}
      options={teamOptions}
    />
  );
};

export default TeamComboBox;
