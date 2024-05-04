"use client";

import { ListWithCards } from "@/types";
import ListHeader from "./list-header";
import { ElementRef, useRef, useState } from "react";
import CardForm from "./card-form";
import { cn } from "@/lib/utils";
import CardItem from "./card-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";



interface ListItemProps {
  index: number;
  list: ListWithCards;
}

const ListItem = (props: ListItemProps) => {

  const { index, list } = props;

  const [isEditing, setIsEditing] = useState(false);

  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const disableEditing = () => {
    setIsEditing(false);
  }

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }




  return (
    <Draggable draggableId={list.id} index={index}>
      {
        (provided) => (
          <li className="shrink-0 h-full w-[272px] select-none" {...provided.draggableProps} ref={provided.innerRef}>
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2" {...provided.dragHandleProps}>
              <ListHeader onAddCard={enableEditing} list={list} />
              <Droppable droppableId={list.id} type="card">
                {(provided) => (
                  <ol className={cn("mx-1 px-1 py-0.5 flex flex-col gap-y-2", list.cards.length > 0 ? "mt-2" : "mt-0")} {...provided.droppableProps} ref={provided.innerRef}>
                    {list.cards?.map((card, index) => (
                      <CardItem index={index} key={card.id} card={card} />
                    ))}
                    {
                      provided.placeholder
                    }
                  </ol>

                )}
              </Droppable>
              <CardForm ref={textareaRef} isEditing={isEditing} enableEditing={enableEditing} disableEditing={disableEditing} listId={list.id} />
            </div>
          </li>
        )
      }
    </Draggable>
  )
}

export default ListItem