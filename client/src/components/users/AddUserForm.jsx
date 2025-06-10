import { useState } from "react";

export default function AddUserForm({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    const newUser = await response.json();
    onUserAdded(newUser);
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="light-gradient rounded-2xl border border-white/30 p-6 shadow-lg">
      <h3 className="mb-4 flex items-center text-2xl font-bold text-gray-800">
        <span className="mr-2 text-2xl">&#10133;</span>
        Dodaj nowego klienta
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            <span className="mr-1 text-lg">&#128100;</span>
            Imię i nazwisko:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
            placeholder="Wpisz imię i nazwisko..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            <span className="mr-1 text-lg">&#128231;</span>
            Adres e-mail:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
            placeholder="przykład@email.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            <span className="mr-1 text-lg">&#128241;</span>
            Telefon (opcjonalnie):
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="glass w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
            placeholder="+48 123 456 789"
          />
        </div>
        <button
          type="submit"
          className="dark-gradient w-full transform cursor-pointer rounded-xl px-6 py-4 text-lg font-bold text-white transition-all duration-200 hover:scale-101 hover:shadow-lg">
          Dodaj klienta
        </button>
      </form>
    </div>
  );
}
