"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";
import { CreateAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType):Promise<ReturnType> => {

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
                error:"Board not found",
            }
        }

        list = await db.list.delete({
            where: {
                boardId,
                id,
                board: {
                    orgId,
                }
            },
        });

        await CreateAuditLog({
            action:ACTION.DELETE,
            entityId:list.id,
            entityTitle:list.title,
            entityType:ENTITY_TYPE.LIST
        });

    } catch (error) {
        return {
            error: "Internal Error."
        }
    }

    revalidatePath(`/organisation/${orgId}`);
    return {
        data:list
    }

}

export const deleteList = createSafeAction(DeleteList,handler);
