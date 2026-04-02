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
    <div className="rounded-2xl border border-white/30 bg-[#88dfff] p-6 shadow-lg">
      <h3 className="mb-4 flex items-center text-2xl font-bold text-gray-800">
        Dodaj nowy sprzęt
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Nazwa sprzętu:
          </label>
          <input
            type="text"
            name="name"
            placeholder="np. Narty Rossignol Hero Elite"
            value={form.name}
            onChange={handleChange}
            required
            className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Typ sprzętu:
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200">
            <option value="">Wybierz typ sprzętu...</option>
            {equipmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
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
            className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full transform cursor-pointer rounded-xl bg-blue-500 px-6 py-4 text-lg font-bold text-white transition-all duration-200 hover:scale-101 hover:shadow-lg">
          Dodaj sprzęt
        </button>
      </form>
    </div>
  );
}
