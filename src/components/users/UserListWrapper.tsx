// UserListWrapper.tsx (client component)
"use client";
import { Suspense } from "react";
import UserList from "./user-list";

export default function UserListWrapper() {
  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <UserList />
    </Suspense>
  );
}
