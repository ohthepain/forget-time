import { useEffect, useState } from 'react';
import { PrismaClient, User } from '@prisma/client'
import { createFileRoute } from '@tanstack/react-router';

const prisma = new PrismaClient();

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        prisma.user.findMany().then((users) => {
            setUsers(users);
        });
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

export const Route = createFileRoute('/users')({
    component: UserList,
});
