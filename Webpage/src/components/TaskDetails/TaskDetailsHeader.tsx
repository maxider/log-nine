import { Divider, TextField } from "@mui/material";
import { Task, Team } from "../../types/Task";
import { prioToColor } from "../../Helpers";
import React from "react";
import InputField from "../InputField";

interface TaskDetailsHeaderProps {
  visualId: number;
  title: string;
  target: Team;
  priority: number;
  editMode: boolean;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditTargetId: React.Dispatch<React.SetStateAction<number>>;
  onChange: () => void;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = (
  props: TaskDetailsHeaderProps
) => {
  const {
    visualId,
    title,
    target,
    priority,
    editMode,
    setEditTitle,
    setEditTargetId,
    onChange,
  } = props;

  const color = prioToColor(priority);

  return (
    <div className="flex flex-row">
      <div className={`px-2 ${color} flex justify-center items-center w-10`}>
        <p className="font-bold text-center">{visualId}</p>
      </div>
      <Divider orientation="vertical" flexItem />
      <EditableTitle
        editMode={editMode}
        value={title}
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

export default TaskDetailsHeader;
