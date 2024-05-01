import { auth } from "@clerk/nextjs/server";
import OrgControl from "./_components/org-control";
import { startCase } from "lodash";

export async function generateMetadata() {
    const {orgSlug} = auth();
    return {
        title: startCase(orgSlug || "organization"),
    };
};

const OrganisationIdLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <OrgControl />
            {children}
        </>
    )
}

export default OrganisationIdLayout