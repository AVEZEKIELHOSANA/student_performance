import { InstructorSidebar } from '@/components/layout/InstructorSidebar';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <InstructorSidebar />
      <div className="flex-1 lg:ml-64">
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
