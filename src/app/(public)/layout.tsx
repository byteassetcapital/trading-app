import Navbar from "@/components/Navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="bg-gradient-spot bg-spot-1"></div>
            <div className="bg-gradient-spot bg-spot-2"></div>
            {children}
        </>
    );
}
