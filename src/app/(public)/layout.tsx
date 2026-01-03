import Navbar from "@/components/Navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div className="bg-gradient-spot bg-spot-1"></div>
                <div className="bg-gradient-spot bg-spot-2"></div>
            </div>
            <Navbar />
            {children}
        </div>
    );
}
