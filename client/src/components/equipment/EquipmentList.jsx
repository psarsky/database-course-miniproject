import { useState } from "react";
import EditEquipmentModal from "./EditEquipmentModal";

export default function EquipmentList({ equipment, onUpdate }) {
  const [filter, setFilter] = useState("all"); // all, available, rented
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEquipment = equipment.filter((eq) => {
    if (filter === "available") return eq.available;
    if (filter === "rented") return !eq.available;
    return true;
  });

  return (
    <div className="rounded-2xl border border-white/30 bg-[#88dfff] p-6 shadow-lg">
      <h3 className="mb-6 flex items-center text-2xl font-bold text-gray-800">
        Dostępny sprzęt
        <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {equipment.length} {equipment.length === 1 ? "pozycja" : "pozycji"}
        </span>
      </h3>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 cursor-pointer ${
            filter === "all" ? "bg-blue-500 text-white shadow-lg" : "glass border border-white/30 hover:shadow-md"
          }`}
          onClick={() => setFilter("all")}>
          Wszystko ({equipment.length})
        </button>
        <button
          className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 cursor-pointer ${
            filter === "available" ? "bg-blue-500 text-white shadow-lg" : "glass border border-white/30 hover:shadow-md"
          }`}
          onClick={() => setFilter("available")}>
          Dostępny ({equipment.filter((eq) => eq.available).length})
        </button>
        <button
          className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 cursor-pointer ${
            filter === "rented" ? "bg-blue-500 text-white shadow-lg" : "glass border border-white/30 hover:shadow-md"
          }`}
          onClick={() => setFilter("rented")}>
          Niedostępny ({equipment.filter((eq) => !eq.available).length})
        </button>
      </div>

      {filteredEquipment.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <p className="text-lg">Brak sprzętu do wyświetlenia</p>
          <p className="text-sm">Zmień filtr lub dodaj nowy sprzęt!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <div
              key={eq._id}
              className={`glass rounded-xl border p-4 transition-all duration-200 hover:shadow-lg ${
                eq.available ? "border-green-200 hover:border-green-300" : "border-red-200 hover:border-red-300"
              }`}>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{eq.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{eq.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingEquipment(eq);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer"
                    title="Edytuj sprzęt">
                  </button>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      eq.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    {eq.available ? <>Dostępny</> : <>Niedostępny</>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cena za dobę:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {typeof eq.pricePerDay === "number" ? `${eq.pricePerDay.toFixed(2)} PLN` : "-"}
                  </span>
                </div>

                <div className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-400">ID: {eq._id}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditEquipmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        equipment={editingEquipment}
        onUpdate={() => {
          onUpdate?.();
          setEditingEquipment(null);
        }}
        onDelete={() => {
          onUpdate?.();
          setEditingEquipment(null);
        }}
      />
    </div>
  );
}
