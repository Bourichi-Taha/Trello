import { OrganizationProfile } from "@clerk/nextjs"



const SettingsPage = () => {
    return (
        <div className="w-full">
            <OrganizationProfile
            
                routing="hash"
                appearance={{
                    elements: {
                        rootBox: {
                            boxShadow: "none",
                            width: "auto",
                        },
                        card: {
                            border: "1px solid #e5e5e5",
                            boxShadow: "none",
                            width: "auto",
                        }
                    }
                }}
            />
        </div>
    )
}

export default SettingsPage