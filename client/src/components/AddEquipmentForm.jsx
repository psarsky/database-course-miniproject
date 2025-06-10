import { useState } from "react";

export default function AddEquipmentForm({ onEquipmentAdded }) {
  const [form, setForm] = useState({ name: "", type: "", pricePerDay: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type || form.pricePerDay === "") {
      setError("Wszystkie pola są wymagane");
      return;
    }
    if (isNaN(form.pricePerDay) || Number(form.pricePerDay) < 0) {
      setError("Cena musi być liczbą nieujemną");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          pricePerDay: Number(form.pricePerDay),
        }),
      });

      if (res.ok) {
        const newEquipment = await res.json();
        onEquipmentAdded(newEquipment);
        setForm({ name: "", type: "", pricePerDay: "" });
      } else {
        throw new Error("Błąd przy dodawaniu sprzętu");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Błąd przy dodawaniu sprzętu");
    }
  };

  const equipmentTypes = [
    { value: "narty", label: "Narty" },
    { value: "buty", label: "Buty narciarskie" },
    { value: "kijki", label: "Kijki narciarskie" },
    { value: "snowboard", label: "Snowboard" },
    { value: "kask", label: "Kask" },
    { value: "gogle", label: "Gogle" },
  ];

  return (
    <div className="ice-gradient rounded-2xl p-6 shadow-lg border border-white/30">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">&#127935;</span>
        Dodaj nowy sprzęt
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#x1F3F7;&#xFE0F;</span>
            Nazwa sprzętu:
          </label>
          <input
            type="text"
            name="name"
            placeholder="np. Narty Rossignol Hero Elite"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128194;</span>
            Typ sprzętu:
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass">
            <option value="">Wybierz typ sprzętu...</option>
            {equipmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128181;</span>
            Cena za dobę (PLN):
          </label>
          <input
            type="number"
            name="pricePerDay"
            placeholder="0.00"
            value={form.pricePerDay}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <span className="text-lg mr-2">&#9888;&#65039;</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full winter-gradient text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-101 transition-all duration-200 text-lg cursor-pointer">
          Dodaj sprzęt
        </button>
      </form>
    </div>
  );
}
