import { Divider } from "@mui/material";
import { Task } from "../types/Task";
import { useSelector } from "react-redux";
import { selectTeamById, selectTeams } from "../state/Selectors/TeamSelectors";
import { RootState } from "../state/store";
import { prioToColor } from "../Helpers";
import { EditableHeader } from "./EditableText";
import { ChangeEvent, useEffect } from "react";
import React from "react";
import teamSlice from "../state/teamSlice";

interface TaskDetailsHeaderProps {
  task: Task;
  isEdit: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({
  task,
  isEdit,
  onChange,
}) => {
  const target = useSelector((state: RootState) =>
    selectTeamById(state, task.targetId ?? 0)
  );

  const [title, setTitle] = React.useState(task.title);
  const teams = useSelector(selectTeams);

  useEffect(() => {
    setTitle(task.title);
  }, [task]);

  const color = prioToColor(task.priority);

  return (
    <div className="flex flex-col m-0 p-2">
      <div className="flex flex-row gap-4 font-semibold m-2 items-center">
        <div
          className={`flex flex-col items-center min-w-16 p-2 flex-none ${color}`}
        >
          <h2 className="m-0">#{task.visualId}</h2>
          <p className="m-0">Status: {task.status}</p>
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="m-0 flex-grow">
          <EditableHeader
            value={title}
            isEdit={isEdit}
            onChange={(e) => {
              setTitle(e.target.value);
              onChange(e);
            }}
          />
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="flex flex-col items-center min-w-24 flex-none">
          {/* <EditableHeader
            value={target?.name ?? ""}
            isEdit={isEdit}
            autocomplete
            options={teams.map((t) => ({
              label: t.name,
              id: t.id,
            }))}
            onChange={(e) => {
              setTitle(e.target.value);
              onChange(e);
            }}
          /> */}
          <h2 className="m-0">{target?.name ?? ""}</h2>
          <p className="m-0">
            SR: {target?.freqSr ?? ""} LR: {target?.freqLr ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsHeader;
