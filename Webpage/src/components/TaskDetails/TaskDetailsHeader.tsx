import { Button, Divider, TextField } from "@mui/material";
import { Task, Team } from "../../types/Task";
import { prioToColor } from "../../Helpers";
import React from "react";
import InputField from "../InputField";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { DecrementPriority, IncrementPriority } from "../../state/helpers";
import { useSelector } from "react-redux";
import { selectTeamById } from "../../state/Selectors/TeamSelectors";
import { RootState } from "../../state/store";
import { decrementStatus } from "../../state/taskSlice";

interface TaskDetailsHeaderProps {
  task: Task;
  editMode: boolean;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditTargetId: React.Dispatch<React.SetStateAction<number>>;
  onChange: () => void;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = (
  props: TaskDetailsHeaderProps
) => {
  const { task, editMode, setEditTitle, setEditTargetId, onChange } = props;

  const color = prioToColor(task?.priority);

  const target = useSelector((state: RootState) =>
    selectTeamById(state, task?.targetId ?? -1)
  );

  return (
    <div className="flex flex-row">
      <VisualIdComponent
        id={task?.id}
        label={"Visual Id"}
        onChange={() => {}}
        value={task?.visualId.toString()}
        color={color}
        editMode={editMode}
      />
      <Divider orientation="vertical" flexItem />
      <EditableTitle
        editMode={editMode}
        value={task?.title}
        label={"Title"}
        setEditTitle={setEditTitle}
        onChange={onChange}
      />
      <Divider orientation="vertical" flexItem />
      <div className="flex flex-col items-center p-2 font-bold">
        <p className="m-0">{target?.name}</p>
        <p className="m-0">
          Sr: {target?.srFrequency} Lr: {target?.lrFrequency}
        </p>
      </div>
    </div>
  );
};

export interface EditableInputProps {
  editMode: boolean;
  value: string;
  label: string;
  onChange: () => void;
}

interface EditableTitleProps extends EditableInputProps {
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  editMode,
  value,
  label,
  setEditTitle,
  onChange,
}) => {
  return (
    <div className="px-2 my-2 grow">
      {editMode ? (
        <InputField
          label={label}
          value={value}
          fullWidth
          onChange={(e) => {
            setEditTitle(e.target.value);
            onChange();
          }}
        />
      ) : (
        <p className="font-bold">{value}</p>
      )}
    </div>
  );
};

interface VisualIdComponentProps extends EditableInputProps {
  color: string;
  id: number;
}

const VisualIdComponent: React.FC<VisualIdComponentProps> = ({
  color,
  value,
  id,
}) => {
  return (
    <div
      className={`px-2 ${color} flex flex-col justify-center items-center w-10`}
    >
      <KeyboardArrowUpIcon
        onClick={() => IncrementPriority(id)}
        className="m-0 transition-opacity rounded opacity-25 hover:opacity-100"
        fontSize="small"
      />
      <p className="m-0 font-bold text-center">{value}</p>
      <KeyboardArrowDownIcon
        onClick={() => DecrementPriority(id)}
        className="m-0 transition-opacity rounded opacity-25 hover:opacity-100"
        fontSize="small"
      />
    </div>
  );
};

export default TaskDetailsHeader;
