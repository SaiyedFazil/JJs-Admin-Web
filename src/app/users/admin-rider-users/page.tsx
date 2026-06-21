import { UsersContent } from "@/components/pages/users/UsersContent";

export default function AdminRiderUsersPage() {
  return (
    <UsersContent
      usersOnly={false}
      title="Admin & Rider Users"
      description="Manage staff accounts — super admins, admins and delivery riders."
      breadcrumbLabel="Admin & Rider Users"
    />
  );
}
