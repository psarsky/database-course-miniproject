import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function EditUserModal({ isOpen, onClose, user, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setShowDeleteConfirm(false); // Reset delete confirmation when user changes
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        console.error("Błąd podczas aktualizacji użytkownika");
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji użytkownika:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
        onClose();
      } else {
        console.error("Błąd podczas usuwania użytkownika");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania użytkownika:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edytuj klienta">
      {showDeleteConfirm ? (
        <div className="text-center">
          <div className="text-6xl mb-4">&#9888;&#65039;</div>
          <h3 className="text-xl font-bold mb-4">Potwierdź usunięcie</h3>
          <p className="text-gray-600 mb-6">
            Czy na pewno chcesz usunąć klienta <strong>{user.name}</strong>?
            <br />
            Ta operacja jest nieodwracalna.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors duration-200 cursor-pointer">
              Anuluj
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 cursor-pointer">
              {isLoading ? "Usuwanie..." : "Usuń"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Imię i nazwisko:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="glass w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
              placeholder="Wprowadź imię i nazwisko"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="glass w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
              placeholder="Wprowadź adres email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon (opcjonalnie):</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="glass w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
              placeholder="Wprowadź numer telefonu"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold cursor-pointer">
              <span className="mr-2">&#128465;</span>
              Usuń klienta
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 winter-gradient text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 cursor-pointer">
              <span className="mr-2">&#128190;</span>
              {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
