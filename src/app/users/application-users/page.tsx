import { UsersContent } from "@/components/pages/users/UsersContent";

export default function ApplicationUsersPage() {
  return (
    <UsersContent
      usersOnly
      title="Application Users"
      description="Browse and search every customer using the JJ's Kitchen application."
      breadcrumbLabel="Application Users"
    />
  );
}
