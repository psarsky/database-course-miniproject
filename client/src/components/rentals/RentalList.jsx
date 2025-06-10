import { useEffect, useState } from "react";
import EditRentalModal from "./EditRentalModal";

export default function RentalList({ userId, refresh, onUpdate }) {
  const [rentals, setRentals] = useState([]);
  const [selectedUser, setSelectedUser] = useState(userId || "");
  const [users, setUsers] = useState([]);

  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, returned
  const [editingRental, setEditingRental] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/users").then((res) => res.json()),
      fetch("http://localhost:5000/api/equipment").then((res) => res.json()),
    ])
      .then(([users, equipment]) => {
        setUsers(users);
        setEquipmentList(equipment);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania danych:", err);
        setUsers([]);
        setEquipmentList([]);
      });
  }, []);

  useEffect(() => {
    let url = "http://localhost:5000/api/rentals";
    if (selectedUser) {
      url = `http://localhost:5000/api/rentals/user/${selectedUser}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let filtered = data;

        // Filter by equipment
        if (selectedEquipment) {
          filtered = filtered.filter((r) => r.equipment && r.equipment._id === selectedEquipment);
        }

        // Filter by status
        if (statusFilter === "active") {
          filtered = filtered.filter((r) => !r.returned && !isOverdue(r.returnDate, r.returned));
        } else if (statusFilter === "returned") {
          filtered = filtered.filter((r) => r.returned);
        } else if (statusFilter === "overdue") {
          filtered = filtered.filter((r) => isOverdue(r.returnDate, r.returned));
        }

        setRentals(filtered);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania wypożyczeń:", err);
        setRentals([]);
      });
  }, [selectedUser, selectedEquipment, statusFilter, refresh]);

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

  const isOverdue = (returnDate, returned) => {
    if (returned) return false;
    return new Date(returnDate) < new Date();
  };

  return (
    <div className="glass light-gradient rounded-2xl border border-white/30 p-6 shadow-lg">
      <h3 className="mb-6 flex items-center text-2xl font-bold text-gray-800">
        <span className="mr-2 text-2xl">&#128203;</span>
        Historia wypożyczeń
        <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {rentals.length} {rentals.length === 1 ? "pozycja" : "pozycji"}
        </span>
      </h3>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            <span className="mr-1 text-lg">&#128100;</span>
            Filtruj po kliencie:
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="glass w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">-- Wszyscy klienci --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                &#128100; {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            <span className="mr-1 text-lg">&#x26F7;&#xFE0F;</span>
            Filtruj po sprzęcie:
          </label>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="glass w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">-- Wszystkie sprzęty --</option>
            {equipmentList.map((eq) => (
              <option key={eq._id} value={eq._id}>
                {getEquipmentEmoji(eq.type)} {eq.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            <span className="mr-1 text-lg">&#128202;</span>
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200">
            <option value="all">&#128203; Wszystkie</option>
            <option value="active">&#128994; Aktywne</option>
            <option value="returned">&#9989; Zwrócone</option>
            <option value="overdue">&#9888;&#65039; Zaległe</option>
          </select>
        </div>
      </div>

      {rentals.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <span className="mb-2 block text-4xl">&#10052;&#65039;</span>
          <p className="text-lg">Brak wypożyczeń do wyświetlenia</p>
          <p className="text-sm">Spróbuj zmienić filtry lub dodać nowe wypożyczenie!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map((r) => (
            <div
              key={r._id}
              className={`glass rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                r.returned
                  ? "border-green-200"
                  : isOverdue(r.returnDate, r.returned)
                    ? "border-red-300 bg-red-50"
                    : "border-blue-200"
              }`}>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getEquipmentEmoji(r.equipment?.type)}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{r.equipment?.name || "Brak danych"}</h4>
                    <p className="text-sm text-gray-600">&#128100; {r.user?.name || "Brak danych"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingRental(r);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer"
                    title="Edytuj wypożyczenie">
                    <span className="text-lg text-gray-600">&#x2699;&#xFE0F;</span>
                  </button>
                  <div className="flex flex-col items-end space-y-1">
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        r.returned
                          ? "bg-green-100 text-green-800"
                          : isOverdue(r.returnDate, r.returned)
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}>
                      {r.returned ? (
                        <>&#9989; Zwrócono</>
                      ) : isOverdue(r.returnDate, r.returned) ? (
                        <>&#9888;&#65039; Zaległe</>
                      ) : (
                        <>&#128994; Aktywne</>
                      )}
                    </div>

                    {r.cost && (
                      <div className="text-sm font-bold text-green-600">&#128181; {r.cost.toFixed(2)} PLN</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wypożyczenie:</span>
                    <span className="font-medium">&#128197; {new Date(r.rentalDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planowany zwrot:</span>
                    <span className="font-medium">&#128197; {new Date(r.returnDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Typ sprzętu:</span>
                    <span className="font-medium capitalize">{r.equipment?.type || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status sprzętu:</span>
                    <span className={`font-medium ${r.equipment?.available ? "text-green-600" : "text-red-600"}`}>
                      {r.equipment?.available ? <>&#9989; Dostępny</> : <>&#128683; Niedostępny</>}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-400">ID: {r._id}</div>
            </div>
          ))}
        </div>
      )}

      <EditRentalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rental={editingRental}
        onUpdate={() => {
          onUpdate?.();
          setEditingRental(null);
        }}
        onDelete={() => {
          onUpdate?.();
          setEditingRental(null);
        }}
      />
    </div>
  );
}
