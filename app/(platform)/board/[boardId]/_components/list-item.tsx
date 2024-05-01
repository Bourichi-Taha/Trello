"use client";

import { ListWithCards } from "@/types";
import ListWrapper from "./list-wrapper";
import ListHeader from "./list-header";


interface ListItemProps {
    index: number;
    list: ListWithCards;
}

const ListItem = (props:ListItemProps) => {

    const {index,list} = props;

  return (
    <ListWrapper >
        <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
            <ListHeader list={list} />
        </div>
    </ListWrapper>
  )
}

export default ListItem