import { useState, useEffect } from "react";
import Modal from "../Modal";

export default function EditRentalModal({ isOpen, onClose, rental, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    rentalDate: "",
    returnDate: "",
    equipment: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:5000/api/equipment")
        .then((res) => res.json())
        .then((data) => setEquipmentList(data))
        .catch((err) => console.error("Błąd podczas pobierania sprzętu:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (rental) {
      setFormData({
        rentalDate: rental.rentalDate ? new Date(rental.rentalDate).toISOString().slice(0, 16) : "",
        returnDate: rental.returnDate ? new Date(rental.returnDate).toISOString().slice(0, 16) : "",
        equipment: rental.equipment?._id || "",
      });
      setShowDeleteConfirm(false);
    }
  }, [rental]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/rentals/${rental._id}`, {
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
        console.error("Błąd podczas aktualizacji wypożyczenia");
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji wypożyczenia:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/rentals/${rental._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
        onClose();
      } else {
        console.error("Błąd podczas usuwania wypożyczenia");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania wypożyczenia:", error);
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

  const isOverdue = (returnDate, returned) => {
    if (returned) return false;
    return new Date(returnDate) < new Date();
  };

  if (!rental) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edytuj wypożyczenie">
      {showDeleteConfirm ? (
        <div className="text-center">
          <h3 className="mb-4 text-xl font-bold">Potwierdź usunięcie</h3>
          <p className="mb-6 text-gray-600">
            Czy na pewno chcesz usunąć wypożyczenie sprzętu <strong>{rental.equipment?.name}</strong> dla klienta{" "}
            <strong>{rental.user?.name}</strong>?
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
        <div className="space-y-6">
          <div className="glass rounded-xl p-4">
            <h4 className="mb-3 font-semibold text-gray-700">Informacje o wypożyczeniu:</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="font-medium">{rental.equipment?.name || "Brak danych"}</div>
                  <div className="text-sm text-gray-600 capitalize">{rental.equipment?.type || "Nieznany"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div>
                  <div className="font-medium">{rental.user?.name || "Brak danych"}</div>
                  <div className="text-sm text-gray-600">{rental.user?.email || "Brak danych"}</div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  rental.returned
                    ? "bg-green-100 text-green-800"
                    : isOverdue(rental.returnDate, rental.returned)
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                }`}>
                {rental.returned ? (
                  <>Zwrócono</>
                ) : isOverdue(rental.returnDate, rental.returned) ? (
                  <>Zaległe</>
                ) : (
                  <>Aktywne</>
                )}
              </div>
              <div className="text-xs text-gray-500">ID: {rental._id}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Data i godzina wypożyczenia:</label>
              <input
                type="datetime-local"
                name="rentalDate"
                value={formData.rentalDate}
                onChange={handleChange}
                required
                className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Planowana data i godzina zwrotu:</label>
              <input
                type="datetime-local"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
                className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Wybierz sprzęt:</label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                required
                className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                <option value="">-- Wybierz sprzęt --</option>
                {equipmentList
                  .filter((eq) => eq.available || eq._id === rental?.equipment?._id)
                  .map((eq) => (
                    <option key={eq._id} value={eq._id}>
                      {eq.name} ({eq.type})
                      {eq._id === rental?.equipment?._id && " - Aktualnie wypożyczony"}
                    </option>
                  ))}{" "}
              </select>
            </div>

            <div className="flex gap-4 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 cursor-pointer rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-600">
                Usuń wypożyczenie
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 cursor-pointer rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50">
                {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
