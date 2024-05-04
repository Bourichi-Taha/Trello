"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { CreateAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType):Promise<ReturnType> => {

    const {userId,orgId} = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized!",
        }
    }

    const {id} = data;

    let board;

    try {
        board = await db.board.delete({
            where: {
                id,
                orgId
            }
        });

        await CreateAuditLog({
            action:ACTION.DELETE,
            entityId:board.id,
            entityTitle:board.title,
            entityType:ENTITY_TYPE.BOARD
        });

    } catch (error) {
        return {
            error: "Internal Error."
        }
    }

    revalidatePath(`/organisation/${orgId}`);
    return {
        data:board
    }

}

export const deleteBoard = createSafeAction(DeleteBoard,handler);
