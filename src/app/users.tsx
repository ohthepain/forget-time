import { useState } from "react";
import { User } from "@prisma/client";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [user, setUser] = useState<User>();

  const fetchUsers = async () => {
    console.log("fetching users");
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const createUser = async () => {
    console.log("creating user");
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

  const updateUser = async () => {
    console.log("updating user");
    const response = await fetch("/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await response.json();
    console.log(data);
    fetchUsers();
  };

  const handleDeleteUser = async (user: User) => {
    console.log("deleting user");
    const response = await fetch("/api/users/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id }),
    });
    const data = await response.json();
    console.log(data);
    fetchUsers();
  };

  return (
    <div>
      <h1>User Management</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button className="m-2" onClick={createUser}>Create</button>
      <button className="m-2" onClick={updateUser}>Update</button>
      <button className="m-2" onClick={() => { handleDeleteUser(user!) }}>Delete</button>
      <button className="m-2" onClick={fetchUsers}>Fetch Users</button>
      <div>
      <div className="flex flex-row">
            <div className="flex flex-1 m-2">Name</div>
            <div className="flex flex-1 m-2">Email</div>
            <div className="flex flex-1 m-2">Password</div>
            </div>
      <ul>
        <div className="m-2">
        {users.map((user: User) => (
          <li onClick={() => { setUser(user)} } key={user.id}>
            <div className="flex flex-row">
            <div className="flex flex-1 m-2">{user.name}</div>
            <div className="flex flex-1 m-2">{user.email}</div>
            <div className="flex flex-1 m-2">{user.password}</div>
            </div>
          </li>
        ))}
        </div>
      </ul>
      </div>
    </div>
  );
}
