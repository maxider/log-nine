import { Box, Button, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Task, { TaskStatus } from "../../entities/Task";

interface Props {
  task: Task;
  incrementStat: (task: Task) => void;
  decrementStat: (task: Task) => void;
  cancelTask: (task: Task) => void;
  onEditButton: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  isEditMode: boolean;
  hasChanges: boolean;
}

const TaskDetailButtonFooter = ({
  task,
  incrementStat,
  decrementStat,
  cancelTask,
  onEditButton,
  onCancelEdit,
  onSave,
  isEditMode,
  hasChanges,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <OptionalButton
        onClick={() => decrementStat(task)}
        text={prevStatus(task.status).replace("_", " ")}
      />
      {isEditMode ? (
        <EditButtonGroup
          onClickCancel={onCancelEdit}
          onClickSave={onSave}
          hasChanges={hasChanges}
        />
      ) : (
        <NormalButtonGroup onClickEdit={onEditButton} />
      )}
      <Box>
        <IconButton onClick={() => cancelTask(task)} disabled={task.status == TaskStatus.CANCELLED}>
          <DeleteIcon />
        </IconButton>
        <OptionalButton
          onClick={() => incrementStat(task)}
          text={nextStatus(task.status).replace("_", " ")}
        />
      </Box>
    </Box>
  );
};

interface OptionalButtonProps {
  onClick: () => void;
  text: string;
}

const OptionalButton = ({ onClick, text }: OptionalButtonProps) => {
  return (
    <Button disabled={text === ""} variant="contained" onClick={onClick}>
      {text}
    </Button>
  );
};

const prevStatus = (status: TaskStatus) => {
  if (status - 1 < 0) return "";
  return TaskStatus[status - 1];
};

const nextStatus = (status: TaskStatus) => {
  if (status + 1 > 4) return "";
  return TaskStatus[status + 1];
};

const NormalButtonGroup = ({ onClickEdit }: { onClickEdit: () => void }) => {
  return (
    <>
      <Button variant="contained" onClick={onClickEdit}>
        Edit
      </Button>
    </>
  );
};

const EditButtonGroup = ({
  onClickCancel,
  onClickSave,
  hasChanges,
}: {
  onClickCancel: () => void;
  onClickSave: () => void;
  hasChanges: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "13%",
      }}
    >
      <Button
        sx={{ width: "64px" }}
        variant="contained"
        onClick={onClickSave}
        disabled={!hasChanges}
      >
        Save
      </Button>
      <Button
        sx={{ width: "64px" }}
        variant="contained"
        onClick={onClickCancel}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default TaskDetailButtonFooter;
