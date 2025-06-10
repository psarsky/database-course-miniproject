import { useState, useEffect } from "react";

export default function RentForm({ onRentalSuccess }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    equipmentId: "",
    rentalDate: "",
    returnDate: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/equipment")
      .then((res) => setEquipmentList(res.data))
      .catch((err) => console.error("Błąd podczas pobierania sprzętu:", err));

    fetch("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Błąd podczas pobierania użytkowników:", err));
  }, []);

  const handleDateChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setNow = () => {
    const now = new Date();
    const local = now.toISOString().slice(0, 16);
    setForm((prev) => ({ ...prev, rentalDate: local }));
  };

  const getPricePreview = () => {
    const eq = equipmentList.find((e) => e._id === form.equipmentId);
    if (!eq || !form.rentalDate || !form.returnDate) return null;
    const start = new Date(form.rentalDate);
    const end = new Date(form.returnDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((end - start) / msPerDay) || 1;
    const cost = days * eq.pricePerDay;
    return { days, cost };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rentalDateISO = new Date(form.rentalDate).toISOString();
      const returnDateISO = new Date(form.returnDate).toISOString();
      await fetch("http://localhost:5000/api/rentals/rent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: form.userId,
          equipmentId: form.equipmentId,
          rentalDate: rentalDateISO,
          returnDate: returnDateISO,
        }),
      });
      alert("Wypożyczenie zakończone sukcesem!");
      setForm({ userId: "", equipmentId: "", rentalDate: "", returnDate: "" });
      if (onRentalSuccess) onRentalSuccess();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas wypożyczania sprzętu: " + (err.response?.data?.error || "Błąd nieznany"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold">Formularz wypożyczenia</h2>
      <div>
        <label className="block">Użytkownik:</label>
        <select
          name="userId"
          value={form.userId}
          onChange={handleDateChange}
          required
          className="w-full p-2 border rounded">
          <option value="">-- wybierz użytkownika --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block">Sprzęt:</label>
        <select
          name="equipmentId"
          value={form.equipmentId}
          onChange={handleDateChange}
          required
          className="w-full p-2 border rounded">
          <option value="">-- wybierz sprzęt --</option>
          {equipmentList
            .filter((eq) => eq.available)
            .map((eq) => (
              <option key={eq._id} value={eq._id}>
                {eq.name} ({eq.type}) —{" "}
                {typeof eq.pricePerDay === "number" ? eq.pricePerDay.toFixed(2) + " PLN/doba" : "-"}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block">Data i godzina wypożyczenia:</label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            name="rentalDate"
            value={form.rentalDate}
            onChange={handleDateChange}
            className="w-full p-2 border rounded"
          />
          <button type="button" onClick={setNow} className="bg-gray-300 px-2 rounded">
            Teraz
          </button>
        </div>
      </div>
      <div>
        <label className="block">Data i godzina zwrotu:</label>
        <input
          type="datetime-local"
          name="returnDate"
          value={form.returnDate}
          onChange={handleDateChange}
          className="w-full p-2 border rounded"
        />
      </div>
      {(() => {
        const preview = getPricePreview();
        if (!preview) return null;
        return (
          <div className="bg-blue-50 p-2 rounded border text-blue-900">
            <strong>Koszt wypożyczenia:</strong> {preview.cost.toFixed(2)} PLN za {preview.days}{" "}
            {preview.days === 1 ? "dobę" : "doby"}
          </div>
        );
      })()}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Wypożycz
      </button>
    </form>
  );
}
