import { Box, Button } from "@mui/material";
import Task, { TaskStatus } from "../../entities/Task";

interface Props {
  task: Task;
  incrementStat: (task: Task) => void;
  decrementStat: (task: Task) => void;
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
          onClickCancle={onCancelEdit}
          onClickSave={onSave}
          hasChanges={hasChanges}
        />
      ) : (
        <NormalButtonGroup onClickEdit={onEditButton} />
      )}
      <OptionalButton
        onClick={() => incrementStat(task)}
        text={nextStatus(task.status).replace("_", " ")}
      />
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
  if (status + 1 > 5) return "";
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
  onClickCancle: onClickCancle,
  onClickSave,
  hasChanges,
}: {
  onClickCancle: () => void;
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
        onClick={onClickCancle}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default TaskDetailButtonFooter;
