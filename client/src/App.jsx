import { useState, useEffect } from "react";
import UserList from "./components/UserList";
import AddUserForm from "./components/AddUserForm";
import RentForm from "./components/RentForm";
import ReturnForm from "./components/ReturnForm";
import RentalList from "./components/RentalList";
import EquipmentList from "./components/EquipmentList";
import AddEquipmentForm from "./components/AddEquipmentForm";

export default function App() {
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rentalRefresh, setRentalRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/equipment")
      .then((res) => res.json())
      .then((data) => setEquipment(data))
      .catch((err) => console.error(err));
  }, []);

  const refreshRentals = () => setRentalRefresh((r) => r + 1);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="glass rounded-b-3xl shadow-2xl p-8 m-4 mb-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">
              SnowPoint
            </h1>
            <p className="text-xl text-gray-700 font-medium">Wypożyczalnia sprzętu narciarskiego</p>
          </div>
        </header>

        {/* Users Section */}
        <section className="glass rounded-3xl shadow-xl p-8 m-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            <span className="text-4xl mr-3">&#128101;</span>
            Zarządzanie klientami
          </h2>
          <AddUserForm onUserAdded={(newUser) => setUsers((prev) => [...prev, newUser])} />
          <div className="mt-8">
            <UserList users={users} />
          </div>
        </section>

        {/* Equipment Section */}
        <section className="glass rounded-3xl shadow-xl p-8 m-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            <span className="text-4xl mr-3">&#127935;</span>
            Zarządzanie sprzętem
          </h2>
          <AddEquipmentForm onEquipmentAdded={(newItem) => setEquipment((prev) => [...prev, newItem])} />
          <div className="mt-8">
            <EquipmentList equipment={equipment} />
          </div>
        </section>

        {/* Rentals Section */}
        <section className="glass rounded-3xl shadow-xl m-4 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            <span className="text-4xl mr-3">&#127956;&#65039;</span>
            Wypożyczenia
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <RentForm users={users} equipment={equipment} onRentalSuccess={refreshRentals} />
            </div>
            <div>
              <ReturnForm onReturnSuccess={refreshRentals} />
              <div className="mt-8">
                <RentalList refresh={rentalRefresh} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
