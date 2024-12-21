import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getUsers } from "../../serverFunctions/users";

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const populateUsers = async () => {
      console.log("populating users");
      const users: User[] = await getUsers();
      console.log("users", users);
      setUsers(users);
    };

    populateUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export const Route = createFileRoute("/users/")({
  component: UserList,
});
