

interface OrganisationIdPageProps {
    params: {
        organisationId:string;
    }
}

const OrganisationIdPage = (props:OrganisationIdPageProps) => {

    const {organisationId} = props.params;

  return (
    <div>OrganisationIdPage {organisationId}</div>
  )
}

export default OrganisationIdPage