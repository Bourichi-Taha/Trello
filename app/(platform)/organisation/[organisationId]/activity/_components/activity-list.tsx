import ActivityItem from '@/components/common/activity-item';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const ActivityList = async() => {

  const  {orgId} = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const logs = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc"
    },
  });

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization
      </p>
      {
        logs.map((log) => (
          <ActivityItem log={log} key={log.id} />
        ))
      }
    </ol>
  )
}

export default ActivityList

ActivityList.Skeleton = function ActivityListSkeleton(){
  return(
    <ol className="space-y-4 mt-4">
      <Skeleton className='w-[80%] h-14'/>
      <Skeleton className='w-[60%] h-14'/>
      <Skeleton className='w-[68%] h-14'/>
      <Skeleton className='w-[90%] h-14'/>
      <Skeleton className='w-[70%] h-14'/>
      <Skeleton className='w-[75%] h-14'/>
      <Skeleton className='w-[80%] h-14'/>
    </ol>
  )
}