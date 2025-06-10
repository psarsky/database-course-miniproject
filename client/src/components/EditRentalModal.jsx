import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function EditRentalModal({ isOpen, onClose, rental, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    rentalDate: "",
    returnDate: "",
    equipment: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);

  const getEquipmentEmoji = (type) => {
    const emojiMap = {
      narty: "&#127935;",
      buty: "&#128095;",
      kijki: "&#x26F7;&#xFE0F;",
      snowboard: "&#127938;",
      kask: "&#x26D1;&#xFE0F;",
      gogle: "&#x1F97D;",
    };
    return <span dangerouslySetInnerHTML={{ __html: emojiMap[type] || "&#127935;" }} />;
  };

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
          <div className="text-6xl mb-4">&#9888;&#65039;</div>
          <h3 className="text-xl font-bold mb-4">Potwierdź usunięcie</h3>
          <p className="text-gray-600 mb-6">
            Czy na pewno chcesz usunąć wypożyczenie sprzętu <strong>{rental.equipment?.name}</strong> dla klienta{" "}
            <strong>{rental.user?.name}</strong>?
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
        <div className="space-y-6">
          <div className="p-4 glass rounded-xl">
            <h4 className="font-semibold text-gray-700 mb-3">Informacje o wypożyczeniu:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getEquipmentEmoji(rental.equipment?.type)}</span>
                <div>
                  <div className="font-medium">{rental.equipment?.name || "Brak danych"}</div>
                  <div className="text-sm text-gray-600 capitalize">{rental.equipment?.type || "Nieznany"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">&#128100;</span>
                <div>
                  <div className="font-medium">{rental.user?.name || "Brak danych"}</div>
                  <div className="text-sm text-gray-600">{rental.user?.email || "Brak danych"}</div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rental.returned
                    ? "bg-green-100 text-green-800"
                    : isOverdue(rental.returnDate, rental.returned)
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                {rental.returned ? (
                  <>&#9989; Zwrócono</>
                ) : isOverdue(rental.returnDate, rental.returned) ? (
                  <>&#9888;&#65039; Zaległe</>
                ) : (
                  <>&#128994; Aktywne</>
                )}
              </div>
              <div className="text-xs text-gray-500">ID: {rental._id}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Data i godzina wypożyczenia:</label>
              <input
                type="datetime-local"
                name="rentalDate"
                value={formData.rentalDate}
                onChange={handleChange}
                required
                className="glass outline-none w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Planowana data i godzina zwrotu:</label>
              <input
                type="datetime-local"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
                className="glass outline-none w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Wybierz sprzęt:</label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                required
                className="glass outline-none w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200">
                <option value="">-- Wybierz sprzęt --</option>
                {equipmentList
                  .filter((eq) => eq.available || eq._id === rental?.equipment?._id)
                  .map((eq) => (
                    <option key={eq._id} value={eq._id}>
                      {getEquipmentEmoji(eq.type)} {eq.name} ({eq.type})
                      {eq._id === rental?.equipment?._id && " - Aktualnie wypożyczony"}
                    </option>
                  ))}              </select>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold cursor-pointer">
                <span className="mr-2">&#128465;</span>
                Usuń wypożyczenie
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
        </div>
      )}
    </Modal>
  );
}
