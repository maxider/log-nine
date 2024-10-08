import { Box, Typography, Divider, TextField } from "@mui/material";
import Task from "../../entities/Task";
import { priorityColor } from "../../helpers/prioToColor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decrementPriority, incrementPriority } from "../../api/mutations";
import Team from "../../entities/Team";
import TeamComboBox from "../TeamComboBox";
import PersonComboBox from "../PersonComboBox";
import Person from "../../entities/Person";

interface Props {
  task: Task;
  target: Team;
  person: Person;
  title: string;
  onChange: (newTitle: string) => void;
  onChangeTargetId: (newTargetId: number) => void;
  onChangeAssignedToId: (newPersonId: number) => void;
  isEditMode: boolean;
}

const TaskDetailsHeader = ({
  task,
  target,
  person,
  title,
  isEditMode,
  onChange,
  onChangeTargetId,
  onChangeAssignedToId,
}: Props) => {
  const color = priorityColor(task.priority);
  const queryClient = useQueryClient();

  const { mutateAsync: incrementPrio } = useMutation({
    mutationFn: incrementPriority,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutateAsync: decrementPrio } = useMutation({
    mutationFn: decrementPriority,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        maxHeight: "100px",
      }}
    >
      <Box
        sx={{
          backgroundColor: color,
          paddingX: "20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <KeyboardArrowUpIcon
          sx={arrowStyle}
          onClick={() => incrementPrio(task)}
        />
        <Typography sx={{ textAlign: "center" }}>{task.visualId}</Typography>
        <KeyboardArrowDownIcon
          sx={arrowStyle}
          onClick={() => decrementPrio(task)}
        />
      </Box>
      <Divider orientation="vertical" flexItem />
      <EditableTitle
        title={title}
        isEditMode={isEditMode}
        onChange={(newTitle) => {
          onChange(newTitle);
        }}
      />
      <Divider orientation="vertical" flexItem />
      <EditablePersonInfo
        person={person}
        boardId={task.boardId}
        isEditMode={isEditMode}
        setAssignedToId={onChangeAssignedToId}
      />
      <Divider orientation="vertical" flexItem />
      <EditableTargetInfo
        team={target}
        isEditMode={isEditMode}
        setTargetId={onChangeTargetId}
      />
    </Box>
  );
};

interface EditableTitleProps {
  title: string;
  isEditMode: boolean;
  onChange: (newTitle: string) => void;
}
const EditableTitle = ({ title, isEditMode, onChange }: EditableTitleProps) => {
  return isEditMode ? (
    <TextField
      sx={{ paddingX: "20px" }}
      label={"Title"}
      value={title}
      fullWidth
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  ) : (
    <Typography
      sx={{
        flexGrow: 1,
        textAlign: "center",
        padding: "20px",
        overflowY: "auto",
        maxHeight: "100%",
      }}
    >
      {title}
    </Typography>
  );
};

interface EditableTargetInfoProps {
  team: Team;
  isEditMode: boolean;
  setTargetId: (id: number) => void;
}

interface EditablePersonInfoProps {
  person: Person;
  boardId: number;
  isEditMode: boolean;
  setAssignedToId: (id: number) => void;
}

const EditableTargetInfo = ({
  team,
  isEditMode,
  setTargetId,
}: EditableTargetInfoProps) => {
  return (
    <Box
      sx={{
        width: "300px",
        minWidth: "200px",
        paddingX: "20px",
      }}
    >
      {isEditMode ? (
        <TeamComboBox
          boardId={team.boardId.toString()}
          setTargetId={setTargetId}
          required={false}
          value={team.id}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingX: "20px",
          }}
        >
          <Typography>{team.name}</Typography>
          <Typography>
            Sr: {team.srFrequency} Lr: {team.lrFrequency}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const EditablePersonInfo = ({
  person,
  boardId,
  isEditMode,
  setAssignedToId,
}: EditablePersonInfoProps) => {
  return (
    <Box
      sx={{
        width: "300px",
        minWidth: "200px",
        paddingX: "20px",
      }}
    >
      {isEditMode ? (
        <PersonComboBox
          boardId={boardId.toString()}
          setPersonId={setAssignedToId}
          required={false}
          value={person.id}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingX: "20px",
          }}
        >
          <Typography>{person.name}</Typography>
        </Box>
      )}
    </Box>
  );
};

const arrowStyle = {
  opacity: "25%",
  ":hover": { opacity: "100%", transition: "opacity 0.3s" },
};

export default TaskDetailsHeader;
