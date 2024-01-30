import { TextField } from "@mui/material";

interface EditableTextProps {
  value: string;
  isEdit: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
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

export default EditableText;
