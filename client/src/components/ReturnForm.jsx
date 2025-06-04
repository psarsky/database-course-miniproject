// ReturnForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReturnForm({ onReturnSuccess }) {
  const [rentals, setRentals] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/rentals').then(res => setRentals(res.data));
  }, []);

  const handleReturn = async () => {
    try {
      await axios.post(`http://localhost:5000/api/rentals/${selected}/return`);
      // alert('Zwrócono!');
      if (onReturnSuccess) onReturnSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Błąd przy zwrocie');
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <h2 className="text-xl font-bold">Formularz zwrotu</h2>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">Wybierz wypożyczenie</option>
        {rentals.length === 0 && <option disabled>Brak wypożyczeń</option>}
        {rentals.map(r => (
          <option key={r._id} value={r._id} disabled={r.returned}>
            {r.user?.name} - {r.equipment?.name} ({new Date(r.rentalDate).toLocaleString()} do {new Date(r.returnDate).toLocaleString()})
            {r.returned ? ' [ZWRÓCONE]' : ''}
          </option>
        ))}
      </select>
      <button onClick={handleReturn} className="bg-green-500 text-white px-4 py-2 rounded" disabled={!selected}>Zwróć</button>
    </div>
  );
}
