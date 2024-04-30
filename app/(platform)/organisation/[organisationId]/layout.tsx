import OrgControl from "./_components/org-control";



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