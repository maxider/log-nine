import { MouseEvent } from "react";
import { Task } from "../types/Task";
import TaskCard from "./TaskCard";

interface SwimlaneProps {
  tasks: Task[];
  header: string;
  onClickCard: (id: number) => void;
}

export const Swimlane: React.FC<SwimlaneProps> = ({
  tasks,
  header,
  onClickCard,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 m-2 place-content-start w-72">
      <h1>{header}</h1>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => {
            onClickCard(task.id);
          }}
        />
      ))}
    </div>
  );
};
