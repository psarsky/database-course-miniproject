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

  return (
    <div className="ice-gradient rounded-2xl p-6 shadow-lg border border-white/30">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-2xl mr-2">&#127956;&#65039;</span>
        Dostępny sprzęt
        <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {equipment.length} {equipment.length === 1 ? "pozycja" : "pozycji"}
        </span>
      </h3>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === "all" ? "winter-gradient text-white shadow-lg" : "glass hover:shadow-md border border-white/30"
          }`}
          onClick={() => setFilter("all")}>
          <span className="mr-1">&#128202;</span>
          Wszystko ({equipment.length})
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === "available"
              ? "winter-gradient text-white shadow-lg"
              : "glass hover:shadow-md border border-white/30"
          }`}
          onClick={() => setFilter("available")}>
          <span className="mr-1">&#9989;</span>
          Dostępny ({equipment.filter((eq) => eq.available).length})
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === "rented"
              ? "winter-gradient text-white shadow-lg"
              : "glass hover:shadow-md border border-white/30"
          }`}
          onClick={() => setFilter("rented")}>
          <span className="mr-1">&#128683;</span>
          Wypożyczony ({equipment.filter((eq) => !eq.available).length})
        </button>
      </div>

      {filteredEquipment.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl block mb-2">&#10052;&#65039;</span>
          <p className="text-lg">Brak sprzętu do wyświetlenia</p>
          <p className="text-sm">Zmień filtr lub dodaj nowy sprzęt!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((eq) => (
            <div
              key={eq._id}
              className={`glass rounded-xl p-4 border transition-all duration-200 hover:shadow-lg ${
                eq.available ? "border-green-200 hover:border-green-300" : "border-red-200 hover:border-red-300"
              }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getEquipmentEmoji(eq.type)}</span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{eq.name}</h4>
                    <p className="text-gray-600 text-sm capitalize">{eq.type}</p>
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
                    <span className="text-lg text-gray-600">&#x2699;&#xFE0F;</span>
                  </button>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      eq.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    {eq.available ? <>&#9989; Dostępny</> : <>&#128683; Wypożyczony</>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Cena za dobę:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {typeof eq.pricePerDay === "number" ? `${eq.pricePerDay.toFixed(2)} PLN` : "-"}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">ID: {eq._id}</div>
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
