"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Header from "./header";
import Descreption from "./description";
import Actions from "./actions";


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
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                <div className="col-span-3">
                    <div className="w-full space-y-6">
                        {
                            !card ? (
                                <Descreption.Skeleton />
                            ) : (
                                <Descreption card={card} />
                            )
                        }
                    </div>
                </div>
                {
                    !card ? (
                        <Actions.Skeleton />
                    ) : (
                        <Actions card={card} />
                    )
                }
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default CardModal