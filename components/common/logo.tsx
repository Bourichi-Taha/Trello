import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href={"/"}>
        <div className="hover:opacity-75 transition items-center gap-x-1 hidden md:flex">
            <Image src={"/logo.svg"} alt="Logo" height={50} width={50} priority />
            <p className="text-lg text-neutral-700 pb-1 font-bold">
                Taskify
            </p>
        </div>
    </Link>
  )
}

export default Logo