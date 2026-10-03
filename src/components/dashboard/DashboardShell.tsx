type Props = {
  children: React.ReactNode;
  user: {
    email: string | null;
    binzeo_user_id: string | null;
    display_name: string | null;
    first_name: string | null;
    account_status: string | null;
    email_verified: boolean;
  };
};

export default function DashboardShell({ children }: Props) {
  return (
    <div className="flex min-h-[calc(100dvh-68px)] flex-col bg-[#f3f3f3]">
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
