"use client";

import { updateBoard } from "@/actions/update-board";
import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";


interface BoardTitleFormProps {
    board: Board;
}

const BoardTitleForm = (props:BoardTitleFormProps) => {

    const { board } = props;
    const [isEditing,setIsEditing] = useState(false);
    const [titleState,setTitleState] = useState(board.title);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const {execute} = useAction(updateBoard,{
        onSuccess: (data) => {
            toast.success(`Board "${data.title}" updated✨`);
            setTitleState(data.title);
            toggleEditing();
        },
        onError: (error) => {
            toast.error(error);
            toggleEditing();
        }
    })

    const toggleEditing = () =>{
        if (isEditing) {
            setIsEditing(false);
            return;
        }
        setIsEditing(true);
        setTimeout(()=>{
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    }

    const onSubmit = (formData:FormData) => {
        const title = formData.get("title") as string;
        execute({title,id:board.id});
    }

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    if (isEditing) {
        return (
            <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
                <FormInput ref={inputRef} id="title" onBlur={onBlur} defaultValue={titleState} className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none" />    
            </form>
        );
    };

  return (
    <Button onClick={toggleEditing} variant={"transparent"} className="font-bold text-lg h-auto w-auto p-1 px-2" >
        {titleState}
    </Button>
  )
}

export default BoardTitleForm