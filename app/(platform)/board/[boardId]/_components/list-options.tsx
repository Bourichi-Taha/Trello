"use client";

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { Copy, MoreHorizontal, Plus, Trash, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";


interface ListOptionsProps {
    list: List;
    onAddCard: () => void;
}

const ListOptions = (props: ListOptionsProps) => {

    const { list, onAddCard } = props;

    const closeRef = useRef<ElementRef<"button">>(null);

    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" deleted✨`);
            closeRef.current?.click();

        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onDeleteSubmit = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;
        executeDelete({ id, boardId });
    }


    const { execute: executeCopy } = useAction(copyList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" copied✨`);
            closeRef.current?.click();

        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onCopySubmit = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;
        executeCopy({ id, boardId });
    }


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant={"ghost"}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="center" sideOffset={20}>
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List actions
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button variant={"ghost"} className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600">
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <Button variant={"ghost"} onClick={onAddCard} className="flex items-center rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Card...
                </Button>
                <form action={onCopySubmit}>
                    <input hidden name="id" id="id" value={list.id} />
                    <input hidden name="boardId" id="boardId" value={list.boardId} />
                    <FormSubmit variant="ghost" className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy list...
                    </FormSubmit>
                </form>
                <Separator />
                <form action={onDeleteSubmit}>
                    <input hidden name="id" id="id" value={list.id} />
                    <input hidden name="boardId" id="boardId" value={list.boardId} />
                    <FormSubmit variant="ghost" className="flex items-center rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm hover:bg-rose-500/20 hover:text-rose-500">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete list...
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}

export default ListOptions