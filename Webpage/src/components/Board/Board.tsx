import StyledBoard from "./styles";
import TaskList from "../TaskList/TaskList";
import { Divider } from "@mui/material";
import Task, { TaskStatus } from "../../entities/Task";
import { useMemo } from "react";
import Team from "../../entities/Team";

interface Props {
  tasks: Task[];
  teams: Team[];
  onClickCard: (taskId: number) => void;
}

const Board = ({ tasks, teams, onClickCard }: Props) => {
  const tasksByStatus = useMemo(
    () =>
      tasks.reduce(
        (prev, task) => {
          prev.get(task.status)?.push(task);

          return prev;
        },
        new Map<Task["status"], Task[]>([
          [TaskStatus.TODO, []],
          [TaskStatus.EN_ROUTE, []],
          [TaskStatus.ON_SITE, []],
          [TaskStatus.RETURNING, []],
          [TaskStatus.DONE, []],
          [TaskStatus.CANCELLED, []],
        ])
      ),
    [tasks]
  );

  const tasksStatus: Task["status"][] = [...tasksByStatus.keys()];

  return (
    <StyledBoard>
      <Divider orientation="vertical" flexItem />
      {tasksStatus.map((status) => (
        <>
          <TaskList
            header={statusToString(status)}
            tasks={tasksByStatus.get(status) ?? []}
            teams={teams}
            key={status}
            onClickCard={onClickCard}
          />
          <Divider orientation="vertical" flexItem />
        </>
      ))}
    </StyledBoard>
  );
};

const statusToString = (status: Task["status"]) => {
  switch (status) {
    case TaskStatus.TODO:
      return "To Do";
    case TaskStatus.EN_ROUTE:
      return "En Route";
    case TaskStatus.ON_SITE:
      return "On Site";
    case TaskStatus.RETURNING:
      return "Returning";
    case TaskStatus.DONE:
      return "Done";
    case TaskStatus.CANCELLED:
      return "Cancelled";
  }
};

export default Board;
