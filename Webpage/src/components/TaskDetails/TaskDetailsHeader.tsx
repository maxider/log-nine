import { Divider, TextField } from "@mui/material";
import { Task, Team } from "../../types/Task";
import { prioToColor } from "../../Helpers";
import React from "react";

interface TaskDetailsHeaderProps {
  task: Task;
  target: Team;
  editMode: boolean;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = (
  props: TaskDetailsHeaderProps
) => {
  const { task, target, editMode } = props;

  const color = prioToColor(task?.priority);

  return (
    <div className="flex flex-row">
      <div className={`w-3 px-2 ${color}`}>
        <p className="font-bold text-center">{task?.visualId}</p>
      </div>
      <Divider orientation="vertical" flexItem />
      <EditableTitle
        editMode={editMode}
        value={task?.title ?? ""}
        label={"lable"}
        onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
          throw new Error("Function not implemented.");
        }}
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

interface EditableTitleProps {
  editMode: boolean;
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  editMode,
  value,
  label,
}) => {
  return (
    <div className="my-2 grow">
      {editMode ? (
        <TextField
          label={label}
          className="border-white"
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "before:border-white" }}
        />
      ) : (
        <p className="px-2 font-bold">{value}</p>
      )}
    </div>
  );
};

export default TaskDetailsHeader;
