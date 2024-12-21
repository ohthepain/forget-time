import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getUser } from "../../serverFunctions/users";
import { getRouterParam } from "vinxi/http";

export const UserInfo = () => {
    const params = useParams({ from: '/users/$userId' })
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = params.userId;
      const user: User | null = await getUser({ data: userId });
      
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>User</h1>
      <div>{user?.email || "no email"}</div>
      <div>{user?.id || "no userId"}</div>
    </div>
  );
};

export const Route = createFileRoute("/users/$userId")({
  component: UserInfo,
});
