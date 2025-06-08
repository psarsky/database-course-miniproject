import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RentalList({ userId, refresh }) {
  const [rentals, setRentals] = useState([]);
  const [selectedUser, setSelectedUser] = useState(userId || '');
  const [users, setUsers] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
    axios.get('http://localhost:5000/api/equipment')
      .then(res => setEquipmentList(res.data))
      .catch(() => setEquipmentList([]));
  }, []);

  useEffect(() => {
    let url = 'http://localhost:5000/api/rentals';
    if (selectedUser) {
      url = `http://localhost:5000/api/rentals/user/${selectedUser}`;
    }
    axios.get(url)
      .then(res => {
        let filtered = res.data;
        if (selectedEquipment) {
          filtered = filtered.filter(r => r.equipment && r.equipment._id === selectedEquipment);
        }
        setRentals(filtered);
      })
      .catch(() => setRentals([]));
  }, [selectedUser, selectedEquipment, refresh]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Wypożyczenia {selectedUser ? 'użytkownika' : 'wszystkich użytkowników'}</h2>
      <div className="mb-4 flex gap-4 items-center">
        <div>
          <label>Filtruj po użytkowniku: </label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="">-- Wszyscy użytkownicy --</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Filtruj po sprzęcie: </label>
          <select value={selectedEquipment} onChange={e => setSelectedEquipment(e.target.value)}>
            <option value="">-- Wszystkie sprzęty --</option>
            {equipmentList.map(eq => (
              <option key={eq._id} value={eq._id}>{eq.name} ({eq.type})</option>
            ))}
          </select>
        </div>
      </div>
      <ul className="space-y-2">
        {rentals.length === 0 && <li>Brak wypożyczeń do wyświetlenia.</li>}
        {rentals.map(r => (
          <li key={r._id} className="border p-2 rounded">
            <div><strong>ID:</strong> {r._id}</div>
            <div><strong>Użytkownik:</strong> {r.user?.name || 'Brak danych'} <span className="text-xs text-gray-500">[{r.user?._id || 'brak id'}]</span></div>
            <div><strong>Sprzęt:</strong> {r.equipment?.name || 'Brak danych'} <span className="text-xs text-gray-500">[{r.equipment?._id || 'brak id'}]</span></div>
            <div><strong>Status sprzętu:</strong> {typeof r.equipment?.available === 'boolean' ? (r.equipment.available ? 'Dostępny' : 'Niedostępny') : 'Brak danych'}</div>
            <div><strong>Od:</strong> {new Date(r.rentalDate).toLocaleString()}</div>
            <div><strong>Do:</strong> {new Date(r.returnDate).toLocaleString()}</div>
            <div><strong>Status:</strong> {r.returned ? 'Zwrócono' : 'Wypożyczony'}</div>
            <div><strong>Koszt wypożyczenia:</strong> {typeof r.cost === 'number' ? r.cost.toFixed(2) + ' PLN' : '-'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
