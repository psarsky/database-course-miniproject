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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/equipment").then((res) => res.json()),
      fetch("http://localhost:5000/api/users").then((res) => res.json()),
    ])
      .then(([equipment, users]) => {
        setEquipmentList(equipment);
        setUsers(users);
      })
      .catch((err) => console.error("Błąd podczas pobierania danych:", err));
  }, []);

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/rentals/rent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: form.userId,
          equipment: form.equipmentId,
          rentalDate: form.rentalDate,
          returnDate: form.returnDate,
        }),
      });

      if (response.ok) {
        alert("Wypożyczenie zakończone sukcesem!");
        setForm({ userId: "", equipmentId: "", rentalDate: "", returnDate: "" });
        if (onRentalSuccess) onRentalSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Błąd podczas wypożyczania");
      }
    } catch (err) {
      console.error(err);
      alert("Błąd podczas wypożyczania sprzętu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const preview = getPricePreview();

  return (
    <div className="ice-gradient rounded-2xl p-6 shadow-lg border border-white/30">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-2xl mr-2">&#x26F7;&#xFE0F;</span>
        Wypożycz Sprzęt
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128100;</span>
            Wybierz klienta:
          </label>
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass">
            <option value="">-- wybierz klienta --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                &#128100; {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#127939;</span>
            Wybierz sprzęt:
          </label>
          <select
            name="equipmentId"
            value={form.equipmentId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass">
            <option value="">-- wybierz sprzęt --</option>
            {equipmentList
              .filter((eq) => eq.available)
              .map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {getEquipmentEmoji(eq.type)} {eq.name} ({eq.type}) —{" "}
                  {typeof eq.pricePerDay === "number" ? eq.pricePerDay.toFixed(2) + " PLN/doba" : "-"}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128197;</span>
            Data i godzina wypożyczenia:
          </label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              name="rentalDate"
              value={form.rentalDate}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass"
            />
            <button
              type="button"
              onClick={setNow}
              className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all">
              &#x1F550; Teraz
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128197;</span>
            Planowana data zwrotu:
          </label>
          <input
            type="datetime-local"
            name="returnDate"
            value={form.returnDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass"
          />
        </div>

        {preview && (
          <div className="glass border border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-800 mb-2 flex items-center">
              <span className="text-lg mr-2">&#128181;</span>
              Podgląd kosztów:
            </h4>
            <div className="space-y-1">
              <p className="text-blue-700">
                <span className="font-medium">Okres wypożyczenia:</span> {preview.days}{" "}
                {preview.days === 1 ? "doba" : "doby"}
              </p>
              <p className="text-blue-700">
                <span className="font-medium">Łączny koszt:</span>
                <span className="text-xl font-bold ml-2">{preview.cost.toFixed(2)} PLN</span>
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full winter-gradient text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-101 transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          {loading ? <>Przetwarzanie...</> : <>Wypożycz sprzęt</>}
        </button>
      </form>
    </div>
  );
}
