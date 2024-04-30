
const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex items-center justify-center h-full w-full bg-amber-100">
            {
                children
            }
        </div>
    )
}

export default AuthLayout