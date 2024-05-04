"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";


interface ActionsProps {
    card: CardWithList;
}

const Actions = (props:ActionsProps) => {

    const {card} = props;

    const {onClose} = useCardModal();

    const queryClient = useQueryClient();

    const params = useParams();

    const {execute:executeCopy,isLoading:isLoadingCopy} = useAction(copyCard,{
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey:["card",data.id]
            });
            toast.success(`Card "${data.title}" copied✨`);
            onClose();
        },
        onError: (error) => {
            toast.error(error);
        }
    });
    const {execute:executeDelete,isLoading:isLoadingDelete} = useAction(deleteCard,{
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey:["card",data.id]
            });
            toast.success(`Card "${data.title}" deleted✨`);
            onClose();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onCopy = () => {
        const boardId = params.boardId as string;
        const id = card.id;
        const listId = card.listId;
        executeCopy({boardId,id,listId});
    }
    const onDelete = () => {
        const boardId = params.boardId as string;
        const id = card.id;
        const listId = card.listId;
        executeDelete({boardId,id,listId});
    }

  return (
    <div className="space-y-2 mt-2">
        <p className="text-xs font-semibold">
            Actions
        </p>
        <Button disabled={isLoadingCopy} onClick={onCopy} variant={"gray"} className="w-full justify-start" size={"inline"} >
            <Copy className="h-4 w-4 mr-2" />
            Copy
        </Button>
        <Button disabled={isLoadingDelete} onClick={onDelete} variant={"gray"} className="w-full justify-start" size={"inline"} >
            <Trash className="h-4 w-4 mr-2" />
            Delete
        </Button>
    </div>
  )
}

export default Actions

Actions.Skeleton = function ActionsSkeleton () {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
        </div>
    )
}