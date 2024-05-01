"use client";

import { updateList } from "@/actions/update-list";
import { UpdateList } from "@/actions/update-list/schema";
import FormInput from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { ListWithCards } from "@/types";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";

interface ListHeaderProps {
    list: ListWithCards;
}

const ListHeader = (props: ListHeaderProps) => {

    const { list } = props;
    const [title, setTitle] = useState(list.title);


    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const enableEdit = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter") {
            formRef.current?.requestSubmit();
        };
    };

    useEventListener("keydown", onKeyDown);

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    const {execute,fieldErrors} = useAction(updateList,{
        onSuccess: (data) => {
            toast.success(`List "${data.title}" updated`);
            setTitle(data.title);
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onSubmit = (formData:FormData) => {
        const title = formData.get("title") as string;
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;
        execute({title,id,boardId});
    } 



    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-w-2">
            {
                isEditing ? (
                    <form ref={formRef} action={onSubmit} className="flex-1 px-[2px]">
                        <input hidden id="id" name="id" value={list.id}/>
                        <input hidden id="boardId" name="boardId" value={list.boardId}/>
                        <FormInput errors={fieldErrors} id="title" ref={inputRef} onBlur={onBlur} placeholder="Enter list title..." defaultValue={title} className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white" />
                    </form>
                ) : (
                    <div onClick={enableEdit} className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                        {
                            title
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ListHeader