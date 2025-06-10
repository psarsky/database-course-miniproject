import { useState, useEffect } from "react";
import Modal from "../Modal";

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
          <div className="mb-4 text-6xl">&#9888;&#65039;</div>
          <h3 className="mb-4 text-xl font-bold">Potwierdź usunięcie</h3>
          <p className="mb-6 text-gray-600">
            Czy na pewno chcesz usunąć klienta <strong>{user.name}</strong>?
            <br />
            Ta operacja jest nieodwracalna.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="cursor-pointer rounded-xl bg-gray-300 px-6 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-400">
              Anuluj
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="cursor-pointer rounded-xl bg-red-500 px-6 py-2 text-white transition-colors duration-200 hover:bg-red-600 disabled:opacity-50">
              {isLoading ? "Usuwanie..." : "Usuń"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Imię i nazwisko:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Wprowadź imię i nazwisko"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Wprowadź adres email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Telefon (opcjonalnie):</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Wprowadź numer telefonu"
            />
          </div>

          <div className="flex gap-4 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 cursor-pointer rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-600">
              <span className="mr-2">&#128465;</span>
              Usuń klienta
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="dark-gradient flex-1 cursor-pointer rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50">
              <span className="mr-2">&#128190;</span>
              {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
