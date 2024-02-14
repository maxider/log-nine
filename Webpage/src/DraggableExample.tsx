import Paper from "@mui/material/Paper";
import { useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type Item = {
  name: string;
  status: number;
  id: number;
};

interface ItemProps {
  item: Item;
}

export const SortableItem: React.FC<ItemProps> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      className="p-4"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p className="text-center">{item.name}</p>
    </Paper>
  );
};

export function DraggableExample() {
  const [items, setItems] = useState([
    { name: "ItemA1", status: 0, id: 1 },
    { name: "ItemA2", status: 0, id: 2 },
    { name: "ItemA3", status: 0, id: 3 },
    { name: "ItemB1", status: 1, id: 4 },
    { name: "ItemB2", status: 1, id: 5 },
    { name: "ItemB3", status: 1, id: 6 },
  ]);

  const itemsA: Item[] = useMemo(
    () => items.filter((i) => i.status === 0),
    [items]
  );
  const itemsB: Item[] = useMemo(
    () => items.filter((i) => i.status === 1),
    [items]
  );

  const handleDragEnd = (event) => {
    // const { active, over } = event;
    // if (!over) return;
    // if (active.id !== over.id) {
    //   console.log(`${active.id}-${over.id}`);
    //   setItems((items) => {
    //     const oldIndex = items.findIndex((i) => i.id === active.id);
    //     const newIndex = items.findIndex((i) => i.id === over.id);
    //     const moved = arrayMove(items, oldIndex, newIndex);
    //     return moved;
    //   });
    // }
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    if (active.id === over.id) return;

    const activeIndex = items.findIndex((i) => i.id == active.id);
    const activeItem = items[activeIndex];

    const newStatus = items.find((i) => i.id === over.id)?.status ?? 0;
    const newItem = activeItem;
    newItem.status = newStatus;

    setItems((items) =>
      items.map((i) =>
        i.id === active.id ? { ...activeItem, status: newStatus } : i
      )
    );
  };

  return (
    <DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-row gap-4 justify-center items-center">
        <Paper className="w-32 p-4 flex flex-col gap-4 items-center">
          <SortableContext items={itemsA}>
            {itemsA.map((i) => {
              return <SortableItem key={i.id} item={i} />;
            })}
          </SortableContext>
        </Paper>
        <Paper className="w-32 p-4 flex flex-col gap-4 items-center">
          <SortableContext items={itemsB}>
            {itemsB.map((i) => {
              return <SortableItem key={i.id} item={i} />;
            })}
          </SortableContext>
        </Paper>
      </div>
    </DndContext>
  );
}
