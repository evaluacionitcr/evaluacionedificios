"use client";
import { useEffect, useState } from "react";
import UserItem from "./user-item";
import { getFormattedUsers } from "~/server/actions/users";

// Define the user type
interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export default function UserList() {
  // Properly type the state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const formattedUsers = await getFormattedUsers();
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <UserItem
          key={user.id || index}
          user={{
            name: user.name,
            role: user.role,
            initials: user.initials,
          }}
        />
      ))}
    </div>
  );
}
