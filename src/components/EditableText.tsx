import { Autocomplete, Box, TextField } from "@mui/material";
import { Task, Team } from "../types/Task";

interface EditableTextProps {
  value: string;
  isEdit: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  isEdit,
  onChange,
}) => {
  if (isEdit)
    return (
      <TextField
        InputProps={{ className: "text-white" }}
        fullWidth
        multiline
        value={value}
        onChange={onChange}
      />
    );

  return <p>{value}</p>;
};

export const EditableHeader: React.FC<EditableTextProps> = ({
  value,
  isEdit,
  onChange,
}) => {
  if (isEdit)
    return (
      <TextField
        InputProps={{ className: "text-white text-2xl font-bold" }}
        multiline
        value={value}
        onChange={onChange}
      />
    );

  return <h2>{value}</h2>;
};

interface EditableComboboxProps {
  target: Team;
  onChange: (target: Team) => void;
  isEdit: boolean;
  options?: Team[];
}

export const EditableCombobox: React.FC<EditableComboboxProps> = ({
  target,
  onChange,
  isEdit,
  options,
}) => {
  const value = target
    ? { label: target.name, id: target.id, team: target }
    : undefined;
  const opts =
    options?.map((team) => ({ label: team.name, id: team.id, team: team })) ??
    [];

  return isEdit ? (
    <Autocomplete
      onChange={(e, newValue) => {
        if (newValue) onChange(newValue.team);
      }}
      value={value}
      sx={{
        width: 150,
        color: "success.main",
        groupUl: { color: "red" },
      }}
      options={opts}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => (
        <Box component="li" sx={{ color: "black" }} {...props}>
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            style: {
              color: "white",
            },
          }}
        />
      )}
      autoHighlight
    />
  ) : (
    <h2>{target?.name ?? "-"}</h2>
  );
};
