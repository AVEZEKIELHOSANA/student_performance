import { StudentSidebar } from '@/components/layout/StudentSidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}