"use client";
import { ListWithCards } from "@/types";
import ListForm from "./list-form";


interface ListContainerProps {
    boardId: string;
    lists: ListWithCards[];
}

const ListContainer = (props:ListContainerProps) => {

    const {boardId,lists} = props;

  return (
    <ol>
        <ListForm />
        <div className="flex shrink-0 w-1"/>
    </ol>
  )
}

export default ListContainer