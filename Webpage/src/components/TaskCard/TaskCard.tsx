import { Box, Card, Divider, Icon, Typography } from "@mui/material";
import Task, { TaskPriority } from "../../entities/Task";
import Team from "../../entities/Team";
import { priorityColor } from "../../helpers/prioToColor";

import wisch9 from "../../../public/WischNine.png";

interface Props {
  task: Task;
  team: Team;
  onClickCard: (taskId: number) => void;
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
          <Box sx={{ overflowY: "auto", maxHeight: "200px" }}>
            <Typography>{task.title}</Typography>
          </Box>

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
        width: "30px",
        minWidth: "30px",
        backgroundColor: priorityColor(priority),
      }}
    >
      <Typography
        sx={{
          paddingX: "5px",
        }}
      >
        {memefyVisualId(visualId)}
      </Typography>
    </Box>
  );
};

const memefyVisualId = (visualId: number) => {
  switch (visualId) {
    case 9:
      return <Icon>
        <img src={wisch9} alt="wisch9" height={32} width={32}/>
      </Icon>;
    case 69:
      return "♋";
    case 100:
      return "💯";
    default:
      return visualId;
  }
};

export default TaskCard;
