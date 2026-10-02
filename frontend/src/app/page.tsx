export default function Home() {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 bg-gray-50">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Meeting Room Booking
                </h1>
                <p className="mt-2 text-gray-600">
                    Select or create a meeting room to manage bookings.
                </p>
            </div>
        </main>
    );
}