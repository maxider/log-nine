import Paper from "@mui/material/Paper";
import "./App.css";
import { DraggableExample } from "./DraggableExample";
import { Backdrop, Divider } from "@mui/material";
import { loremIpsum, name } from "react-lorem-ipsum";
import { useState } from "react";
import { Task, TaskStatus } from "./Task";

export type Worker = {
  name: string;
};

export type Trupp = {
  name: string;
  sr: number;
  lr: number;
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task: info, onClick }) => {
  return (
    <Paper
      className="bg-slate-600 w-248 flex flex-col hover:bg-slate-700"
      onClick={onClick}
    >
      <div className="flex flex-row items-center">
        <p className="font-semibold text-base px-3">{info.id}</p>
        <Divider orientation="vertical" flexItem />
        <p className="px-3 text-sm font-semibold">{info.titel}</p>
      </div>
      <Divider />
      <p className="m-2 flex justify-center">
        {info.target.name}: {info.target.sr} - {info.target.lr}
      </p>
    </Paper>
  );
};

interface TaskDetailsProps {
  onClose: () => void;
  open: boolean;
}

const TaskDetails: React.FC<TaskDetailsProps> = (props) => {
  return <Backdrop open={props.open} onClick={props.onClose}></Backdrop>;
};

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row w-screen justify-center ">
      <TaskDetails onClose={() => setOpen(false)} open={open} />
      <StatusColumn
        header={"ToDo"}
        status={0}
        tasks={generateInfos(0,4)}
        onClickCard={() => setOpen(true)}
      />
      <Divider orientation="vertical" flexItem />
      <StatusColumn
        header={"En-Route"}
        status={1}
        tasks={generateInfos(1,4)}
        onClickCard={() => setOpen(true)}
      />
      <Divider orientation="vertical" flexItem />
      <StatusColumn
        header={"On Site"}
        status={2}
        tasks={generateInfos(2,4)}
        onClickCard={() => setOpen(true)}
      />
      <Divider orientation="vertical" flexItem />
      <StatusColumn
        header={"Returning"}
        status={3}
        tasks={generateInfos(3,4)}
        onClickCard={() => setOpen(true)}
      />
    </div>
  );
}

export default App;

const generateInfos = (status: TaskStatus, amount: number): Task[] => {
  const arr: Task[] = [];
  [...Array(amount)].forEach((i) => arr.push(generateInfo(status)));
  return arr;
};

const generateInfo = (status: TaskStatus): Task => {
  const info: Task = {
    titel: loremIpsum({
      avgWordsPerSentence: 10,
      avgSentencesPerParagraph: 1,
      random: true,
      startWithLoremIpsum: false,
    })[0],
    description: loremIpsum()[0],
    workers: [{ name: "peter" }, { name: "Hannes" }],
    id: Math.floor(Math.random() * 100),
    target: {
      name: name(),
      sr: Math.floor(Math.random() * 100),
      lr: Math.floor(Math.random() * 100),
    },
    status,
  };

  return info;
};

export interface StatusColumnProps {
  header: string;
  status: TaskStatus;
  tasks: Task[];
  onClickCard: () => void;
}

export const StatusColumn: React.FC<StatusColumnProps> = ({
  header,
  onClickCard,
  tasks,
  status,
}) => {
  return (
    <div className="flex flex-col place-content-start gap-4 h-screen w-72 items-center">
      <h2 className="basis-2 flex-none">{header}</h2>
      {tasks.map((t) => {
        return <TaskCard onClick={onClickCard} task={t} />;
      })}
    </div>
  );
};
// {
//   titel: loremIpsum({
//     avgWordsPerSentence: 10,
//     avgSentencesPerParagraph: 1,
//     random: true,
//     startWithLoremIpsum: false,
//   })[0],
//   description: loremIpsum()[0],
//   workers: [{ name: "peter" }, { name: "Hannes" }],
//   id: Math.floor(Math.random() * 100),
// }
