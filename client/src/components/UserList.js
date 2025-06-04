import React from 'react';

function UserList({ users }) {
  return (
    <div>
      <h2>Lista użytkowników:</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <span className="font-bold">{user.name}</span> — {user.email} <span className="text-xs text-gray-500">[ID: {user._id}]</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
