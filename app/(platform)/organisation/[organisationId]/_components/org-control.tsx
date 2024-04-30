"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";


const OrgControl = () => {

    const {organisationId} = useParams();
    const {setActive} = useOrganizationList();

    useEffect(()=>{
        if (!setActive || !organisationId) {
            return;
        }
        setActive({
            organization:organisationId as string,
        })
    },[setActive,organisationId])


  return null;
}

export default OrgControl