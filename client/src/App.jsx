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
    <>
      <div className="p-4">
        <h1 className="text-4xl">Wypożyczalnia sprzętu narciarskiego</h1>
        <AddUserForm onUserAdded={(newUser) => setUsers((prev) => [...prev, newUser])} />
        <hr className="mt-4 mb-4" />
        <UserList users={users} />
      </div>

      <div className="p-4">
        <AddEquipmentForm onEquipmentAdded={(newItem) => setEquipment((prev) => [...prev, newItem])} />
        <hr className="mt-8 mb-8" />
        <EquipmentList equipment={equipment} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        <div>
          <RentForm users={users} equipment={equipment} onRentalSuccess={refreshRentals} />
          <ReturnForm onReturnSuccess={refreshRentals} />
        </div>
        <RentalList refresh={rentalRefresh} />
      </div>
    </>
  );
}
