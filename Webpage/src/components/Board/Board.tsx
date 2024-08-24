import StyledBoard from "./styles";
import TaskList from "../TaskList/TaskList";
import { Box, Divider} from "@mui/material";
import Task, { TaskStatus } from "../../entities/Task";
import { useMemo } from "react";
import Team from "../../entities/Team";
import React from "react";
import Person from "../../entities/Person";
import PersonTasks from "../PersonTasks/PersonTasks";

interface Props {
  tasks: Task[];
  teams: Team[];
  people: Person[];
  onClickCard: (taskId: number) => void;
}

const Board = ({ tasks, teams, people, onClickCard }: Props) => {
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
        ])
      ),
    [tasks]
  );

  const tasksStatus: Task["status"][] = [...tasksByStatus.keys()];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          height: "100%",
          marginRight: "20px",
        }}
      >
        {people.map((person) => (
          <PersonTasks
            key={person.id}
            person={person}
            tasks={tasks.filter((t) => t.assignedToId === person.id)}
            teams={teams}
            onClickCard={onClickCard}
          />
        ))}
      </Box>
      <StyledBoard>
        <Divider orientation="vertical" flexItem />
        {tasksStatus.map((status) => (
          <React.Fragment key={status}>
            <TaskList
              header={statusToString(status)}
              tasks={tasksByStatus.get(status) ?? []}
              teams={teams}
              key={status}
              onClickCard={onClickCard}
            />
            <Divider
              orientation="vertical"
              flexItem
              key={`divider-${status}`}
            />
          </React.Fragment>
        ))}
      </StyledBoard>
    </Box>
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
