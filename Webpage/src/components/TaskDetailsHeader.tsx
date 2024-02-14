import { Divider } from "@mui/material";
import { Task } from "../types/Task";
import { useSelector } from "react-redux";
import { selectTeamById, selectTeams } from "../state/Selectors/TeamSelectors";
import { RootState } from "../state/store";
import { prioToColor } from "../Helpers";
import { EditableCombobox, EditableHeader } from "./EditableText";
import { ChangeEvent, useEffect } from "react";
import React from "react";

interface TaskDetailsHeaderProps {
  task: Task;
  isEdit: boolean;
  onChange: () => void;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({
  task,
  isEdit,
  onChange,
}) => {
  const target = useSelector((state: RootState) =>
    selectTeamById(state, task.targetId ?? 0)
  );

  const [editTitle, setEditTitle] = React.useState(task.title);
  const teams = useSelector(selectTeams);

  const [editTarget, setEditTarget] = React.useState(target);

  useEffect(() => {
    setEditTitle(task.title);
    setEditTarget(target);
  }, [task]);

  const color = prioToColor(task.priority);

  return (
    <div className="flex flex-col p-2 m-0">
      <div className="flex flex-row items-center gap-4 m-2 font-semibold">
        <div
          className={`flex flex-col items-center min-w-16 p-2 flex-none ${color}`}
        >
          <h2 className="m-0">#{task.visualId}</h2>
          <p className="m-0">Status: {task.status}</p>
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="flex-grow m-0">
          <EditableHeader
            value={editTitle}
            isEdit={isEdit}
            onChange={(e) => {
              setEditTitle(e.target.value);
              onChange();
            }}
          />
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="flex flex-col items-center flex-none min-w-24">
          <EditableCombobox
            target={editTarget}
            isEdit={isEdit}
            options={teams}
            onChange={(target) => {
              setEditTarget(target);
              onChange();
            }}
          />
          <p className="m-0">
            {target ? `SR: ${target.srFrequency}  LR: ${target.lrFrequency}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsHeader;
