import { ACTION, AuditLog } from "@prisma/client";


export const generateLogMessage = (log:AuditLog) => {
    const {action,entityTitle,entityType} = log;

    switch (action) {
        case ACTION.CREATE:
            return `created ${entityType.toLowerCase()} "${entityTitle}"`;
            break;
        case ACTION.UPDATE:
            return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
            break;
        case ACTION.DELETE:
            return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
            break;
    
        default:
            return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
            break;
    }

}