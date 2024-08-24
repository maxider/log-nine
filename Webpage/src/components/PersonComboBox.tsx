import { Autocomplete, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchPeople } from "../api/api";

interface Props {
  boardId: string;
  setPersonId: (id: number) => void;
  required: boolean;
  value: number;
}

const PersonComboBox = ({ boardId, setPersonId, required, value }: Props) => {
  const { data: people } = useQuery({
    queryKey: ["people", boardId],
    queryFn: fetchPeople(boardId),
  });

  const peopleOptions = useMemo(() => {
    if (!people) return [];
    return people.map((person) => {
      return { label: person.name, id: person.id };
    });
  }, [people]);

  return (
    <Autocomplete
      onChange={(_, v) => setPersonId(v?.id ?? -1)}
      value={peopleOptions.find((person) => person.id === value)}
      renderInput={(params) => (
        <TextField {...params} label={"Person"} required={required} />
      )}
      options={peopleOptions}
    />
  );
};

export default PersonComboBox;
