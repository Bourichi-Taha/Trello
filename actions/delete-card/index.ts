"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
import { CreateAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType):Promise<ReturnType> => {

    const {userId,orgId} = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized!",
        }
    }

    const {id,boardId,listId} = data;

    let card;

    try {

        card = await db.card.delete({
            where: {
                listId,
                id,
                list: {
                    board:{
                        orgId
                    }
                }
            },
        });

        await CreateAuditLog({
            action:ACTION.DELETE,
            entityId:card.id,
            entityTitle:card.title,
            entityType:ENTITY_TYPE.CARD
        });


    } catch (error) {
        return {
            error: "Internal Error."
        }
    }

    revalidatePath(`/organisation/${orgId}`);
    return {
        data:card
    }

}

export const deleteCard = createSafeAction(DeleteCard,handler);
