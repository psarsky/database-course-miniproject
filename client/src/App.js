import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import AddUserForm from './components/AddUserForm';
import RentForm from './components/RentForm';
import ReturnForm from './components/ReturnForm';
import RentialList from './components/RentialList';
import EquipmentList from './components/EquipmentList';
import AddEquipmentForm from './components/AddEquipmentForm';

function App() {
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rentalRefresh, setRentalRefresh] = useState(0); // do odświeżania listy wypożyczeń

  // Pobierz użytkowników przy starcie
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  // Pobierz sprzęt przy starcie
  useEffect(() => {
    fetch('http://localhost:5000/api/equipment')
      .then(res => res.json())
      .then(data => setEquipment(data))
      .catch(err => console.error(err));
  }, []);

  // Funkcja do odświeżania listy wypożyczeń
  const refreshRentals = () => setRentalRefresh(r => r + 1);

  return (
    <>
      <div style={{ padding: '2rem' }}>
        <h1>Wypożyczalnia nart</h1>
        <AddUserForm onUserAdded={(newUser) => setUsers(prev => [...prev, newUser])} />
        <hr style={{ margin: '2rem 0' }} />
        <UserList users={users} />
      </div>

      <div style={{ padding: '2rem' }}>
        <AddEquipmentForm onEquipmentAdded={(newItem) => setEquipment(prev => [...prev, newItem])} />
        <hr style={{ margin: '2rem 0' }} />
        <EquipmentList equipment={equipment} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        <div>
          <RentForm users={users} equipment={equipment} onRentalSuccess={refreshRentals} />
          <ReturnForm onReturnSuccess={refreshRentals} />
        </div>
        <RentialList refresh={rentalRefresh} />
      </div>
    </>
  );
}

export default App;
