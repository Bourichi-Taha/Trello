"use client";

import ActivityItem from "@/components/common/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";

interface ActivityProps {
    auditLogs: AuditLog[];
}

const Activity = (props:ActivityProps) => {

    const {auditLogs} = props;

    return (
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Activity
                </p>
                <ol className="mt-2 space-y-4">
                    {auditLogs.map((log) => (
                        <ActivityItem log={log} key={log.id} />
                    ))}
                </ol>
            </div>
        </div>
    )
}

export default Activity

Activity.Skeleton = function ActivitySkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
                <Skeleton className="h-10 w-full bg-neutral-200" />
            </div>
        </div>
    )
}