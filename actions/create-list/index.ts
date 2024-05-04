"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";
import { CreateAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId,orgId} = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized!",
        }
    }

    const {title,boardId} = data;

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

        const order = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
            data: {
                title,
                boardId,
                order
            }
        });

        await CreateAuditLog({
            action:ACTION.CREATE,
            entityId:list.id,
            entityTitle:list.title,
            entityType:ENTITY_TYPE.LIST
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

export const createList = createSafeAction(CreateList,handler);