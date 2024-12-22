import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getUser } from "../../serverFunctions/users";

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
    <div className="flex flex-col w-full p-4">
      <div className="flex flex-row w-full mb-4">
        <div className="flex flex-1 font-bold">User</div>
        <div className="flex flex-1">{user?.email || "no email"}</div>
        <div className="flex flex-1">{user?.id || "no userId"}</div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/users/$userId")({
  component: UserInfo,
});
