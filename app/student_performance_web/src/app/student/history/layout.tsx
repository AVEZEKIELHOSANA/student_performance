import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { StudentHeader } from '@/components/layout/StudentHeader';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 ml-0 lg:ml-64">
        <StudentHeader />
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}