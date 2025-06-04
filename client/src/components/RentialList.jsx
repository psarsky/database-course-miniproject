import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RentalList() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rentals')
      .then(res => setRentals(res.data))
      .catch(err => console.error('Błąd pobierania wypożyczeń:', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Wszystkie wypożyczenia</h2>
      <ul className="space-y-2">
        {rentals.map(r => (
          <li key={r._id} className="border p-2 rounded">
            <div><strong>ID:</strong> {r._id}</div>
            <div><strong>Użytkownik:</strong> {r.user?.name || 'Brak danych'} <span className="text-xs text-gray-500">[{r.user?._id || 'brak id'}]</span></div>
            <div><strong>Sprzęt:</strong> {r.equipment?.name || 'Brak danych'} <span className="text-xs text-gray-500">[{r.equipment?._id || 'brak id'}]</span></div>
            <div><strong>Status sprzętu:</strong> {typeof r.equipment?.available === 'boolean' ? (r.equipment.available ? 'Dostępny' : 'Niedostępny') : 'Brak danych'}</div>
            <div><strong>Od:</strong> {new Date(r.rentalDate).toLocaleString()}</div>
            <div><strong>Do:</strong> {new Date(r.returnDate).toLocaleString()}</div>
            <div><strong>Status:</strong> {r.returned ? 'Zwrócono' : 'Wypożyczony'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
