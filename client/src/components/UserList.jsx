import { useState } from "react";
import EditUserModal from "./EditUserModal";

export default function UserList({ users, onUpdate }) {
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="ice-gradient rounded-2xl p-6 shadow-lg border border-white/30">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-2xl mr-2">&#128203;</span>
        Lista klientów
        <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {users.length} {users.length === 1 ? "klient" : "klientów"}
        </span>
      </h3>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl block mb-2">&#10052;&#65039;</span>
          <p className="text-lg">Brak klientów w bazie</p>
          <p className="text-sm">Dodaj pierwszego klienta aby rozpocząć!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="glass rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{user.name}</h4>
                    <p className="text-gray-600 flex items-center">
                      <span className="text-sm mr-1">&#128231;</span>
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="text-gray-600 flex items-center text-sm">
                        <span className="text-sm mr-1">&#128241;</span>
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
                    <span className="text-lg text-gray-600">&#x2699;&#xFE0F;</span>
                  </button>
                  <div className="text-right">
                    <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">ID: {user._id}</div>
                    <div className="text-xs text-gray-500 mt-1">Klient #{index + 1}</div>
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
