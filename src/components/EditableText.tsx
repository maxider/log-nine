import { Autocomplete, TextField } from "@mui/material";

interface EditableTextProps {
  value: string;
  isEdit: boolean;
  autocomplete?: boolean;
  options?: { label: string; id: number }[];
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
  autocomplete,
  options,
  onChange,
}) => {
  const useAutocomplete = autocomplete ?? false;

  options = options ?? [];

  if (isEdit)
    if (useAutocomplete)
      return (
        <Autocomplete
          disablePortal
          options={options}
          renderInput={(params) => (
            <TextField
              InputProps={{ className: "text-white text-2xl font-bold" }}
              value={value}
            />
          )}
        ></Autocomplete>
      );
    else
      return (
        <TextField
          InputProps={{ className: "text-white text-2xl font-bold" }}
          fullWidth
          multiline
          value={value}
          onChange={onChange}
        />
      );

  return <h2>{value}</h2>;
};