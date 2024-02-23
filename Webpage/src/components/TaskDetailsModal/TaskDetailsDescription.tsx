import { Box, TextField, Typography } from "@mui/material";

interface Props {
  description: string;
  onChange: (newDescription: string) => void;
  isEdit: boolean;
}

const TaskDetailsDescription = ({ description, onChange, isEdit }: Props) => {
  return (
    <Box
      sx={{
        height: "100%",
        padding: "20px",
        flexGrow: 1,
        maxHeight: "100%",
        overflowY: "auto",
      }}
    >
      {isEdit ? (
        <TextField
          label={"Description"}
          value={description}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          fullWidth
          multiline
          maxRows={21}
        />
      ) : (
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{description}</Typography>
      )}
    </Box>
  );
};

export default TaskDetailsDescription;
