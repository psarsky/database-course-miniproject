import { useState, useEffect } from "react";
import UserList from "./components/users/UserList";
import AddUserForm from "./components/users/AddUserForm";
import RentForm from "./components/rentals/RentForm";
import ReturnForm from "./components/rentals/ReturnForm";
import RentalList from "./components/rentals/RentalList";
import EquipmentList from "./components/equipment/EquipmentList";
import AddEquipmentForm from "./components/equipment/AddEquipmentForm";

export default function App() {
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rentalRefresh, setRentalRefresh] = useState(0);
  const [userRefresh, setUserRefresh] = useState(0);
  const [equipmentRefresh, setEquipmentRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, [userRefresh]);

  useEffect(() => {
    fetch("http://localhost:5000/api/equipment")
      .then((res) => res.json())
      .then((data) => setEquipment(data))
      .catch((err) => console.error(err));
  }, [equipmentRefresh]);

  const refreshRentals = () => setRentalRefresh((r) => r + 1);
  const refreshUsers = () => setUserRefresh((r) => r + 1);
  const refreshEquipment = () => setEquipmentRefresh((r) => r + 1);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="glass m-4 mb-8 rounded-b-3xl p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-6xl font-bold text-transparent">
              SnowPoint
            </h1>
            <p className="text-xl font-medium text-gray-700">Wypożyczalnia sprzętu narciarskiego</p>
          </div>
        </header>

        {/* Users Section */}
        <section className="glass m-4 mb-8 rounded-3xl p-8 shadow-xl">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            <span className="mr-3 text-4xl">&#128101;</span>
            Zarządzanie klientami
          </h2>
          <AddUserForm onUserAdded={(newUser) => setUsers((prev) => [...prev, newUser])} />
          <div className="mt-8">
            <UserList users={users} onUpdate={refreshUsers} />
          </div>
        </section>

        {/* Equipment Section */}
        <section className="glass2 m-4 mb-8 rounded-3xl p-8 shadow-xl">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            <span className="mr-3 text-4xl">&#127935;</span>
            Zarządzanie sprzętem
          </h2>
          <AddEquipmentForm onEquipmentAdded={(newItem) => setEquipment((prev) => [...prev, newItem])} />
          <div className="mt-8">
            <EquipmentList equipment={equipment} onUpdate={refreshEquipment} />
          </div>
        </section>

        {/* Rentals Section */}
        <section className="glass2 m-4 rounded-3xl p-8 shadow-xl">
          <h2 className="mb-8 text-3xl font-bold text-gray-800">
            <span className="mr-3 text-4xl">&#127956;&#65039;</span>
            Wypożyczenia
          </h2>
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="flex flex-col gap-6">
              <RentForm users={users} equipment={equipment} onRentalSuccess={refreshRentals} />
              <ReturnForm onReturnSuccess={refreshRentals} />
            </div>
            <div>
              <RentalList refresh={rentalRefresh} onUpdate={refreshRentals} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
