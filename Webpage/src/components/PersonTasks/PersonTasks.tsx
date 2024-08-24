import { Box, Typography } from "@mui/material";
import Person from "../../entities/Person";
import Task from "../../entities/Task";
import TaskCard from "../TaskCard/TaskCard";
import Team, { UndefinedTeam } from "../../entities/Team";

export interface PersonTasksProps {
  person: Person;
  tasks: Task[];
  teams: Team[];
  onClickCard: (taskId: number) => void;
}

const PersonTasks = ({ person, tasks, teams, onClickCard }: PersonTasksProps) => {
  return (
    <Box>
      <Typography variant="h4">{person.name}</Typography>
      <Box>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            team={teams.find((team) => task.targetId === team.id) ?? UndefinedTeam}
            onClickCard={onClickCard}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PersonTasks;
