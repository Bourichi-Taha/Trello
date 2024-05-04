"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";
import { CreateAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId,orgId} = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized!",
        }
    }

    const {items,boardId} = data;

    let updatedCards;

    try {

        const transaction = items.map((card) => db.card.update({
            where: {
                id: card.id,
                list: {
                    board: {
                        id:boardId,
                        orgId
                    }
                },
            },
            data: {
                order: card.order,
                listId: card.listId,
            },
        }));

        updatedCards = await db.$transaction(transaction);

        // await CreateAuditLog({
        //     action:ACTION.UPDATE,
        //     entityId:updatedCards.id,
        //     entityTitle:updatedCards.title,
        //     entityType:ENTITY_TYPE.CARD
        // });

    } catch (error) {
        return {
            error: "Internal Error."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data:updatedCards
    }

}

export const updateCardOrder = createSafeAction(UpdateCardOrder,handler);