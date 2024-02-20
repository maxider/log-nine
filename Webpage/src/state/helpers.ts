import { useSelector } from "react-redux";
import useAppDispatch from "../hooks/useAppDispatch";
import { selectTaskById } from "./Selectors/TaskSelectors";
import { RootState, store } from "./store";
import { EditTask, TaskCreationParams } from "./taskSlice";

export const IncrementPriority = (id: number) => {
  const task = store.getState().tasks.tasks[id];

  const newPrio = Math.min(task.priority + 1, 2);
  if (newPrio === task.priority) return;
  const params: TaskCreationParams = {
    boardId: task.boardId,
    title: task.title,
    description: task.description,
    targetId: task.targetId,
    status: task.status,
    priority: newPrio,
    taskType: 0,
  };
  store.dispatch(EditTask({ id: id, creationParams: params }));
};

export const DecrementPriority = (id: number) => {
  const task = store.getState().tasks.tasks[id];

  const newPrio = Math.max(task.priority - 1, 0);
  if (newPrio === task.priority) return;
  const params: TaskCreationParams = {
    boardId: task.boardId,
    title: task.title,
    description: task.description,
    targetId: task.targetId,
    status: task.status,
    priority: newPrio,
    taskType: 0,
  };
  store.dispatch(EditTask({ id: id, creationParams: params }));
};
