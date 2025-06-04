import { useState } from 'react';
import axios from 'axios';

export default function AddEquipmentForm({ onEquipmentAdded }) {
  const [form, setForm] = useState({ name: '', type: '' });
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.type) {
      setError('Wszystkie pola są wymagane');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/equipment', {
        name: form.name,
        type: form.type
      });
      onEquipmentAdded(res.data);
      setForm({ name: '', type: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Błąd przy dodawaniu sprzętu');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-2">
      <h2 className="text-xl font-bold">Dodaj nowy sprzęt</h2>

      <input
        type="text"
        name="name"
        placeholder="Nazwa sprzętu"
        value={form.name}
        onChange={handleChange}
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
      >
        <option value="">Wybierz typ sprzętu</option>
        <option value="narty">narty</option>
        <option value="buty">buty</option>
        <option value="kijki">kijki</option>
      </select>

      {error && <p className="text-red-600">{error}</p>}

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Dodaj sprzęt
      </button>
    </form>
  );
}
