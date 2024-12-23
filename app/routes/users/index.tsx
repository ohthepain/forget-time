import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { User } from '@prisma/client';
import { getUsers, deleteUser } from '../../serverFunctions/users';

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const populateUsers = async () => {
      console.log('populating users');
      const users: User[] = await getUsers();
      console.log('users', users);
      setUsers(users);
    };

    populateUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div className="flex w-full flex-row rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <div className="flex flex-1">
                <button
                  onClick={async () => {
                    await deleteUser({ data: user.id });
                    setUsers(users.filter((u) => u.id !== user.id));
                  }}
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-1">{user.email}</div>
              <div className="flex flex-1">{user.id}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Route = createFileRoute('/users/')({
  component: UserList,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/signin' });
    }
  },
});
