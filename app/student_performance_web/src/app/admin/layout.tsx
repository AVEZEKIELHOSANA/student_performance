import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
