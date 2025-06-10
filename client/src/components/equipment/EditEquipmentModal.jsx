import { useEffect, useState } from "react";
import Modal from "../Modal";

export default function EditEquipmentModal({ isOpen, onClose, equipment, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    pricePerDay: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const equipmentTypes = [
    { value: "narty", label: "Narty" },
    { value: "buty", label: "Buty" },
    { value: "kijki", label: "Kijki" },
    { value: "snowboard", label: "Snowboard" },
    { value: "kask", label: "Kask" },
    { value: "gogle", label: "Gogle" },
  ];

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || "",
        type: equipment.type || "narty",
        pricePerDay: equipment.pricePerDay || "",
      });
      setShowDeleteConfirm(false);
    }
  }, [equipment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/equipment/${equipment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          pricePerDay: parseFloat(formData.pricePerDay),
        }),
      });

      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        console.error("Błąd podczas aktualizacji sprzętu");
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji sprzętu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/equipment/${equipment._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
        onClose();
      } else {
        console.error("Błąd podczas usuwania sprzętu");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania sprzętu:", error);
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

  if (!equipment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edytuj sprzęt">
      {showDeleteConfirm ? (
        <div className="text-center">
          <div className="mb-4 text-6xl">&#9888;&#65039;</div>
          <h3 className="mb-4 text-xl font-bold">Potwierdź usunięcie</h3>
          <p className="mb-6 text-gray-600">
            Czy na pewno chcesz usunąć sprzęt <strong>{equipment.name}</strong>?
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
            <label className="mb-2 block text-sm font-semibold text-gray-700">Nazwa sprzętu:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Wprowadź nazwę sprzętu"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Typ sprzętu:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="glass w-full cursor-pointer rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
              {equipmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Cena za dobę (PLN):</label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Wprowadź cenę za dobę"
            />
          </div>

          <div className="glass rounded-xl p-4">
            <h4 className="mb-2 font-semibold text-gray-700">Podgląd:</h4>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getEquipmentEmoji(formData.type)}</span>
              <div>
                <div className="font-medium">{formData.name || "Nazwa sprzętu"}</div>
                <div className="text-sm text-gray-600 capitalize">{formData.type}</div>
                <div className="text-sm font-bold text-blue-600">
                  {formData.pricePerDay ? `${parseFloat(formData.pricePerDay).toFixed(2)} PLN/doba` : "0.00 PLN/doba"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 cursor-pointer rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-600">
              <span className="mr-2">&#128465;</span>
              Usuń sprzęt
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
