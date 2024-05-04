"use client";
import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  boardId: string;
  lists: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}


const ListContainer = (props: ListContainerProps) => {

  const { boardId, lists } = props;

  const [listsState, setListsState] = useState(lists);

  const { execute:executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success(`List reordered✨`);
    },
    onError: (error) => {
      toast.error(error);
    }
  });
  const { execute:executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success(`Card reordered✨`);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  useEffect(() => {
    setListsState(lists)
  }, [lists]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    //Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    //user moves a list
    if (type === "list") {
      const items = reorder(listsState, source.index, destination.index).map((item, index) => ({ ...item, order: index }));
      setListsState(items);
      executeUpdateListOrder({items,boardId});
    }

    //user moves a card
    if (type === "card") {
      let stateCopy = [...listsState];
      const sourceList = stateCopy.find(list => list.id === source.droppableId);
      const destList = stateCopy.find(list => list.id === destination.droppableId);

      if (!sourceList || !destList) {
        return;
      }

      //if cards exists on source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      //if cards exists in destination list
      if (!destList.cards) {
        destList.cards = [];
      }

      //moving cards in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(sourceList.cards, source.index, destination.index);
        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setListsState(stateCopy);

        executeUpdateCardOrder({boardId,items:reorderedCards});
      } else {//user moves card to another list
        //1.remove card from source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        //2.assign new listId to the moved card
        movedCard.listId = destination.droppableId;
        //3.add card to destination list
        destList.cards.splice(destination.index, 0, movedCard);
        //4.update the order in the source list
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });
        //5.update the order in the destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });
        setListsState(stateCopy);

        executeUpdateCardOrder({boardId,items:destList.cards});

      }

    }
  }


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {
          (provided) => (
            <ol className="flex gap-x-3 h-full" {...provided.droppableProps} ref={provided.innerRef}>
              {
                listsState.map((list, index) => (
                  <ListItem key={list.id} index={index} list={list} />
                ))
              }
              {provided.placeholder}
              <ListForm />
              <div className="flex shrink-0 w-1" />
            </ol>
          )
        }
      </Droppable>
    </DragDropContext>
  )
}

export default ListContainer