"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId,orgId} = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized!",
        }
    }

    const {id,boardId} = data;

    let list;



    try {

        const board = await db.board.findUnique({
            where: {
                id:boardId,
                orgId
            }
        });

        if (!board) {
            return {
                error: "Board not found!",
            }
        }

        const lastList = await db.list.findFirst({
            where: {
                boardId:board.id,
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true,
            }
        });

        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                }
            },
            include:{
                cards:true,
            }
        });

        if (!listToCopy) {
            return {
                error: "List to be copied not found!",
            }
        }

        const order = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
            data: {
                title:`${listToCopy.title} - Copy`,
                boardId:listToCopy.boardId,
                order,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map((card)=>({
                            title:card.title,
                            description:card.description,
                            order:card.order,
                        })),
                    },
                },
            },
            include:{
                cards: true,
            }
        });

    } catch (error) {
        return {
            error: "Internal Error."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data:list
    }

}

export const copyList = createSafeAction(CopyList,handler);