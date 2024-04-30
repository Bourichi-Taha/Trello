import { OrganizationList } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return <OrganizationList hidePersonal afterCreateOrganizationUrl={"/organisation/:id"} afterSelectOrganizationUrl={"/organisation/:id"} />;
}

export default Page