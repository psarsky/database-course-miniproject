import { useState } from "react";
import EditUserModal from "./EditUserModal";

export default function UserList({ users, onUpdate }) {
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/30 bg-[#88dfff] p-6 shadow-lg">
      <h3 className="mb-6 flex items-center text-2xl font-bold text-gray-800">
        Lista klientów
        <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {users.length} {users.length === 1 ? "klient" : "klientów"}
        </span>
      </h3>

      {users.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <p className="text-lg">Brak klientów w bazie</p>
          <p className="text-sm">Dodaj pierwszego klienta aby rozpocząć!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="glass rounded-xl border border-white/20 p-4 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-lg font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{user.name}</h4>
                    <p className="flex items-center text-gray-600">
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="flex items-center text-sm text-gray-600">
                        {user.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer"
                    title="Edytuj klienta">
                  </button>
                  <div className="text-right">
                    <div className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-400">ID: {user._id}</div>
                    <div className="mt-1 text-xs text-gray-500">Klient #{index + 1}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onUpdate={() => {
          onUpdate?.();
          setEditingUser(null);
        }}
        onDelete={() => {
          onUpdate?.();
          setEditingUser(null);
        }}
      />
    </div>
  );
}
