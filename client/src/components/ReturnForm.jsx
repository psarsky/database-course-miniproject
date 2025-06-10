import { useState, useEffect } from "react";

export default function ReturnForm({ onReturnSuccess }) {
  const [rentals, setRentals] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/rentals")
      .then((res) => res.json())
      .then((data) => setRentals(data))
      .catch((err) => console.error("Błąd podczas pobierania wypożyczeń:", err));
  }, []);

  const activeRentals = rentals.filter((r) => !r.returned);
  const selectedRental = rentals.find((r) => r._id === selected);

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

  const handleReturn = async () => {
    if (!selected) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/rentals/${selected}/return`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Sprzęt został pomyślnie zwrócony!");
        setSelected("");
        if (onReturnSuccess) onReturnSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Błąd podczas zwrotu");
      }
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zwrotu sprzętu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ice-gradient rounded-2xl p-6 shadow-lg border border-white/30">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-2xl mr-2">&#x1F501;</span>
        Zwrot sprzętu
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128203;</span>
            Wybierz wypożyczenie do zwrotu:
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass">
            <option value="">-- wybierz wypożyczenie --</option>
            {activeRentals.length === 0 ? (
              <option disabled>Brak aktywnych wypożyczeń</option>
            ) : (
              activeRentals.map((r) => (
                <option key={r._id} value={r._id}>
                  {getEquipmentEmoji(r.equipment?.type)} {r.user?.name} - {r.equipment?.name} (
                  {new Date(r.rentalDate).toLocaleDateString()})
                </option>
              ))
            )}
          </select>
        </div>

        {selectedRental && (
          <div className="glass rounded-xl p-4 border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center">
              <span className="text-lg mr-2">&#8505;&#65039;</span>
              Szczegóły wypożyczenia:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Klient:</span>
                <span className="font-medium">&#128100; {selectedRental.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sprzęt:</span>
                <span className="font-medium">
                  {getEquipmentEmoji(selectedRental.equipment?.type)} {selectedRental.equipment?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data wypożyczenia:</span>
                <span className="font-medium">&#128197; {new Date(selectedRental.rentalDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Planowany zwrot:</span>
                <span className="font-medium">&#128197; {new Date(selectedRental.returnDate).toLocaleString()}</span>
              </div>
              {selectedRental.cost && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Koszt:</span>
                  <span className="font-bold text-green-600">&#128181; {selectedRental.cost.toFixed(2)} PLN</span>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleReturn}
          disabled={!selected || loading}
          className="w-full winter-gradient text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-101 transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer">
          {loading ? <>Przetwarzanie zwrotu...</> : <>Zwróć Sprzęt</>}
        </button>

        {activeRentals.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <span className="text-4xl block mb-2">&#10052;&#65039;</span>
            <p>Brak aktywnych wypożyczeń do zwrotu</p>
          </div>
        )}
      </div>
    </div>
  );
}
