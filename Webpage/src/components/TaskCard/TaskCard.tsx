import { Box, Card, Divider, Typography } from "@mui/material";
import Task, { TaskPriority } from "../../entities/Task";
import Team from "../../entities/Team";
import { priorityColor } from "../../helpers/prioToColor";

interface Props {
  task: Task;
  team: Team;
  onClickCard: (taskId: number) => void
}

const TaskCard = ({ task, team, onClickCard }: Props) => {
  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
        onClick={() => {
          onClickCard(task.id);
        }}
      >
        <VisualId visualId={task.visualId} priority={task.priority} />
        <Divider orientation="vertical" flexItem />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%",
            padding: "5px",
            flexWrap: "nowrap",
          }}
        >
          <Typography sx={{ overflowY: "auto" }}>{task.title}</Typography>
          <Divider flexItem orientation="horizontal" />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <Typography>{team.name}:&nbsp;</Typography>
            <Typography>
              {team.srFrequency} - {team.lrFrequency}
            </Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
};

const VisualId = ({
  visualId,
  priority,
}: {
  visualId: number;
  priority: TaskPriority;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: priorityColor(priority),
      }}
    >
      <Typography
        sx={{
          paddingX: "5px",
        }}
      >
        {visualId}
      </Typography>
    </Box>
  );
};

export default TaskCard;
