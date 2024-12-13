import { useState } from "react";
import { User } from "@prisma/client";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const createUser = async () => {
    const response = await fetch("/api/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await response.json();
    console.log(data);
    fetchUsers();
  };

  return (
    <div>
      <h1>User Management</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createUser}>Create User</button>
      <button onClick={fetchUsers}>Fetch Users</button>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
