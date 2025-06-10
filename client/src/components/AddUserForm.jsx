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
    <div className="ice-gradient rounded-2xl p-6 shadow-lg border border-white/30">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">&#10133;</span>
        Dodaj nowego klienta
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128100;</span>
            Imię i nazwisko:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass"
            placeholder="Wpisz imię i nazwisko..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128231;</span>
            Adres e-mail:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass"
            placeholder="przykład@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="text-lg mr-1">&#128241;</span>
            Telefon (opcjonalnie):
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl outline-none border border-gray-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all glass"
            placeholder="+48 123 456 789"
          />
        </div>
        <button
          type="submit"
          className="w-full winter-gradient text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-101 transition-all duration-200 text-lg cursor-pointer">
          Dodaj klienta
        </button>
      </form>
    </div>
  );
}
