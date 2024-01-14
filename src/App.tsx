import Paper from "@mui/material/Paper";
import "./App.css";
import { DraggableExample } from "./DraggableExample";
import { Backdrop, Button, Divider } from "@mui/material";
import { loremIpsum, name } from "react-lorem-ipsum";
import React, { useEffect, useMemo, useState } from "react";
import { Priority, Task, TaskStatus } from "./Task";
import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  addTasks,
  decrementStatus,
  incrementStatus,
  selectTaskById,
  selectTaskByStatus,
} from "./redux/store";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

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
  onClick: (e: React.MouseEvent, id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const color = useMemo(() => prioToColor(task.priority), [task]);

  return (
    <Paper
      className="bg-slate-600 w-248 flex flex-col hover:bg-slate-700"
      onClick={(e) => onClick(e, task.id)}
    >
      <div className="flex flex-row items-center">
        <div className={`h-full ${color} flex items-center`}>
          <p className="font-semibold text-base px-3">{task.id}</p>
        </div>
        <Divider orientation="vertical" flexItem />
        <p className="px-3 text-sm font-semibold my-2">{task.titel}</p>
      </div>
      <Divider />
      <p className="m-2 flex justify-center">
        {task.target.name}: {task.target.sr} - {task.target.lr}
      </p>
    </Paper>
  );
};

interface TaskDetailsProps {
  onClose: () => void;
  open: boolean;
  task: Task;
}

const TaskDetails: React.FC<TaskDetailsProps> = (props) => {
  const dispatch = useDispatch();

  if (!props.open) return <></>;

  const task = props.task;
  const color = prioToColor(task.priority);
  return (
    <Backdrop open={props.open} onClick={props.onClose}>
      <Paper className="bg-slate-600 flex flex-row w-3/4">
        {/* header */}
        <div className="flex flex-col m-0 p-2">
          <div className="flex flex-row gap-4 font-semibold m-2 items-center">
            <div
              className={`flex flex-col items-center min-w-16 p-2 flex-none ${color}`}
            >
              <h2 className="m-0">#{task.id}</h2>
              <p className="m-0">Status: {task.status}</p>
            </div>
            <Divider orientation="vertical" flexItem />
            <h2 className="whitesmoke m-0 flex-grow"> {task.titel}</h2>
            <Divider orientation="vertical" flexItem />
            <div className="flex flex-col items-center min-w-24 flex-none">
              <h2 className="m-0">{task.target.name}</h2>
              <p className="m-0">
                SR: {task.target.sr} LR: {task.target.lr}
              </p>
            </div>
          </div>
          <Divider orientation="horizontal" flexItem />
          {/* body */}
          <p className="mx-3">{task.description}</p>
          <div className="flex flex-row gap-4 justify-between">
            <Button
              variant="contained"
              onClick={() => {
                dispatch(decrementStatus(task.id));
              }}
            >
              Status -
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                dispatch(incrementStatus(task.id));
              }}
            >
              Status +
            </Button>
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        {/* Side
        <div>Hello World</div> */}
      </Paper>
    </Backdrop>
  );
};

const useTasksByStatus = (status: TaskStatus) => {
  return useSelector((state: RootState) => selectTaskByStatus(state, status));
};

let isSeeded = false;

function App() {
  const [open, setOpen] = useState(false);
  const [viewedTaskId, setViewedTaskId] = useState(-1);

  const dispatch = useDispatch();

  const tasks_0 = useTasksByStatus(0).sort(sortByPrio);
  const tasks_1 = useTasksByStatus(1).sort(sortByPrio);
  const tasks_2 = useTasksByStatus(2).sort(sortByPrio);
  const tasks_3 = useTasksByStatus(3).sort(sortByPrio);

  const selectedTask = useSelector((state: RootState) =>
    selectTaskById(state, viewedTaskId)
  );

  useEffect(() => {
    if (!isSeeded) {
      seedData(dispatch);
    }
  }, []);

  return (
    <div className="flex flex-row w-screen justify-center bg-slate-900 text-whitesmoke">
      <TaskDetails
        task={selectedTask}
        onClose={() => {
          setOpen(false);
          setViewedTaskId(-1);
        }}
        open={open}
      />
      <StatusColumn
        header={"ToDo"}
        status={0}
        tasks={tasks_0}
        onClickCard={(e, id) => {
          setOpen(true);
          setViewedTaskId(id);
        }}
      />
      <Divider orientation="vertical" flexItem />
      <StatusColumn
        header={"En-Route"}
        status={1}
        tasks={tasks_1}
        onClickCard={(e, id) => {
          setOpen(true);
          setViewedTaskId(id);
        }}
      />
      <Divider orientation="vertical" flexItem />
      <StatusColumn
        header={"On Site"}
        status={2}
        tasks={tasks_2}
        onClickCard={(e, id) => {
          setOpen(true);
          setViewedTaskId(id);
        }}
      />
      <Divider orientation="vertical" flexItem />
      <StatusColumn
        header={"Returning"}
        status={3}
        tasks={tasks_3}
        onClickCard={(e, id) => {
          setOpen(true);
          setViewedTaskId(id);
        }}
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
    priority:
      Math.floor(Math.random() * 2) === 0
        ? Math.floor(Math.random() * 2)
        : undefined,
  };

  return info;
};

export interface StatusColumnProps {
  header: string;
  status: TaskStatus;
  tasks: Task[];
  onClickCard: (e: React.MouseEvent, id: number) => void;
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
        return <TaskCard key={t.id} onClick={onClickCard} task={t} />;
      })}
    </div>
  );
};

const seedData = (dispatcher: Dispatch<UnknownAction>) => {
  isSeeded = true;
  dispatcher(addTasks(generateInfos(0, 4)));
  dispatcher(addTasks(generateInfos(1, 4)));
  dispatcher(addTasks(generateInfos(2, 4)));
  dispatcher(addTasks(generateInfos(3, 4)));
};

function prioToColor(prio?: Priority): string {
  switch (prio) {
    case Priority.Urgent:
      return "bg-red-900";
    case Priority.Low:
      return "bg-sky-900";
  }

  return "";
}

function sortByPrio(a: Task, b: Task): number {
  const prioA = a.priority ?? 0.5;
  const prioB = b.priority ?? 0.5;

  if (prioA === prioB) return 0;

  return prioA > prioB ? -1 : 1;
}
