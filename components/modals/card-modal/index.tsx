"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Header from "./header";


const CardModal = () => {

    const {isOpen,onClose,onOpen,id} = useCardModal();

    const {data:card} = useQuery<CardWithList>({
        queryKey: ["Card",id],
        queryFn: () => fetcher(`/api/cards/${id}`),
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger>

        </DialogTrigger>
        <DialogContent>
            {
                !card ? (
                    <Header.Skeleton />
                ) : (
                    <Header card={card} />
                )
            }
        </DialogContent>
    </Dialog>
  )
}

export default CardModal