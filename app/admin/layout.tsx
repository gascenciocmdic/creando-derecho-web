import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  // Check if we're on the login page
  // The layout will apply to all admin routes
  // Only redirect if there's no session and we're not on login
  if (!session) {
    // Let login page render
    return <>{children}</>;
  }

  return <>{children}</>;
}
