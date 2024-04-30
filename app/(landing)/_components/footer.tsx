import Logo from "@/components/common/logo"
import { Button } from "@/components/ui/button"



const Footer = () => {
    return (
        <footer className="fixed bottom-0 w-full shadow-sm px-4 border-t h-14 flex items-center bg-white">
            <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                <Logo />
                <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                    <Button size={"sm"} variant={"ghost"}>
                        Privacy Policy
                    </Button>
                    <Button size={"sm"} variant={"ghost"}>
                        Terms of Service
                    </Button>
                </div>
            </div>
        </footer>
    )
}

export default Footer