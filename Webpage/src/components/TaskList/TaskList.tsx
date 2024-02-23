import { Typography } from "@mui/material";
import { StyledTaskList, StyledTaskListHeader } from "./styles";
import Task from "../../entities/Task";
import TaskCard from "../TaskCard/TaskCard";
import Team, { UndefinedTeam } from "../../entities/Team";

interface Props {
  header: string;
  tasks: Task[];
  teams: Team[];
  onClickCard: (taskId: number) => void;
}

const TaskList = ({ header, tasks, teams, onClickCard }: Props) => {
  const tasksSorted = tasks.sort((a, b) => (a.priority - b.priority) * -1);

  return (
    <StyledTaskList>
      <StyledTaskListHeader>
        <Typography variant="h6">{header}</Typography>
      </StyledTaskListHeader>
      {tasksSorted.map((task) => (
        <TaskCard
          task={task}
          team={
            teams.find((team) => team.id === task.targetId) ?? UndefinedTeam
          }
          key={task.id}
          onClickCard={onClickCard}
        />
      ))}
    </StyledTaskList>
  );
};

export default TaskList;
