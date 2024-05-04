"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { CreateAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId,orgId} = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized!",
        }
    }

    const {title,listId,boardId} = data;

    let card;



    try {

        const list = await db.list.findUnique({
            where: {
                id:listId,
                board: {
                    id: boardId,
                    orgId
                }
            }
        });

        if (!list) {
            return {
                error: "List not found",
            }
        }

        const lastCard = await db.card.findFirst({
            where: {
                listId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order:true,
            }
        });

        const order = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data: {
                order,title,listId
            }
        });

        await CreateAuditLog({
            action:ACTION.CREATE,
            entityId:card.id,
            entityTitle:card.title,
            entityType:ENTITY_TYPE.CARD
        });

        
    } catch (error) {
        return {
            error: "Internal Error."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data:card
    }

}

export const createCard = createSafeAction(CreateCard,handler);