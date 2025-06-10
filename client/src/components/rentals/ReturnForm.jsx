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
    <div className="light-gradient rounded-2xl border border-white/30 p-6 shadow-lg">
      <h3 className="mb-6 flex items-center text-2xl font-bold text-gray-800">
        <span className="mr-2 text-2xl">&#x1F501;</span>
        Zwrot sprzętu
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            <span className="mr-1 text-lg">&#128203;</span>
            Wybierz wypożyczenie do zwrotu:
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200">
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
          <div className="glass rounded-xl border border-blue-200 p-4">
            <h4 className="mb-3 flex items-center font-bold text-blue-800">
              <span className="mr-2 text-lg">&#8505;&#65039;</span>
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
          className="dark-gradient w-full transform cursor-pointer rounded-xl px-6 py-4 text-lg font-bold text-white transition-all duration-200 hover:scale-101 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <>Przetwarzanie zwrotu...</> : <>Zwróć sprzęt</>}
        </button>

        {activeRentals.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            <span className="mb-2 block text-4xl">&#10052;&#65039;</span>
            <p>Brak aktywnych wypożyczeń do zwrotu</p>
          </div>
        )}
      </div>
    </div>
  );
}
