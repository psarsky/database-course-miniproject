import React, { useState } from 'react';

export default function EquipmentList({ equipment }) {
  const [filter, setFilter] = useState('all'); // all, available, rented

  const filteredEquipment = equipment.filter(eq => {
    if (filter === 'available') return eq.available;
    if (filter === 'rented') return !eq.available;
    return true;
  });

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Dostępny sprzęt</h2>
      <div className="mb-2 flex gap-2">
        <button
          className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          Wszystko
        </button>
        <button
          className={`px-2 py-1 rounded ${filter === 'available' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('available')}
        >
          Tylko dostępny
        </button>
        <button
          className={`px-2 py-1 rounded ${filter === 'rented' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('rented')}
        >
          Tylko wypożyczony
        </button>
      </div>
      {filteredEquipment.length === 0 ? (
        <p>Brak sprzętu do wyświetlenia.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Nazwa</th>
              <th className="border-b p-2">Typ</th>
              <th className="border-b p-2">ID</th>
              <th className="border-b p-2">Status</th>
              <th className="border-b p-2">Cena za dobę (PLN)</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.map(eq => (
              <tr key={eq._id}>
                <td className="border-b p-2">{eq.name}</td>
                <td className="border-b p-2">{eq.type}</td>
                <td className="border-b p-2 text-xs text-gray-500">{eq._id}</td>
                <td className="border-b p-2">{eq.available ? 'Dostępny' : 'Wypożyczony'}</td>
                <td className="border-b p-2">{typeof eq.pricePerDay === 'number' ? eq.pricePerDay.toFixed(2) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
