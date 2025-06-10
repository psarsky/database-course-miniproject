# SnowPoint - system wypożyczalni sprzętu narciarskiego

## Autorzy

- Dariusz Rozmus
- Jakub Psarski

## Opis projektu

System wypożyczalni nart składa się z backendu opartego na Node.js z Express i MongoDB oraz frontendu w React. Aplikacja umożliwia zarządzanie sprzętem narciarskim, użytkownikami oraz procesem wypożyczania i zwracania sprzętu.

### Funkcjonalności:

- Zarządzanie użytkownikami (dodawanie, edycja, usuwanie, przeglądanie)
- Zarządzanie sprzętem narciarskim (dodawanie, edycja, usuwanie, przeglądanie)
- System wypożyczania sprzętu z kontrolą dostępności
- System zwracania sprzętu
- Transakcyjne operacje zapewniające spójność danych

## Instrukcja uruchomienia

### Wymagania wstępne:

- Node.js
- Docker

### Krok 1: Konfiguracja `.env`

Zgodnie z `.env.example`:

```
MONGO_URI="YOUR MONGODB URL HERE"
PORT="YOUR PORT NUMBER HERE"
```

### Krok 2: Uruchomienie bazy danych MongoDB

W terminalu (katalog `server/`):

```powershell
docker-compose up --build
```

### Krok 3: Inicjalizacja replica set MongoDB

W nowym terminalu:

```powershell
docker exec -it mongodb mongosh
```

W konsoli MongoDB:

```js
rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "127.0.0.1:27017" }] });
exit;
```

### Krok 4: Instalacja zależności i uruchomienie backendu

W terminalu (katalog `server/`):

```powershell
npm install
npm start
```

### Krok 5: Instalacja zależności i uruchomienie frontendu

W nowym terminalu PowerShell w katalogu `client/`:

```powershell
npm install
npm start
```

## Model danych

### Kolekcja `users`

- `name: String (required)` - imię i nazwisko użytkownika,
- `email: String (required, unique)` - adres e-mail użytkownika,
- `phone: String (optional)` - numer telefonu użytkownika

### Kolekcja `equipment`

- `name: String (required)` - nazwa sprzętu,
- `type: String (required)` - kategoria sprzętu (narty, buty, kask itp.),
- `available: Boolean (default: true)` - flaga dostępności sprzętu,
- `pricePerDay: Number (required, min: 0)` - opłata dobowa za wypożyczenie

### Kolekcja `rentals`

- `user: ObjectId (ref: "User", required)` - ID wypożyczającego użytkownika,
- `equipment: ObjectId (ref: "Equipment", required)` - ID wypożyczanego sprzętu,
- `rentalDate: Date (default: Date.now)` - data wypożyczenia,
- `returnDate: Date` - data zwrotu,
- `returned: Boolean (default: false)` - flaga informująca, czy sprzęt został zwrócony,
- `cost: Number (min: 0)` - koszt wypożyczenia

## Realizacja operacji w bazie danych

### 1. Operacje CRUD dla użytkowników

#### Tworzenie użytkownika:

```js
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Pobieranie wszystkich użytkowników:

```js
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Pobieranie użytkownika po ID:

```js
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Aktualizacja danych użytkownika:

```js
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found." });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Usuwanie użytkownika:

```js
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found." });
    res.json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 1. Operacje CRUD dla sprzętu

#### Tworzenie sprzętu:

```js
const createEquipment = async (req, res) => {
  try {
    const { name, type, available, pricePerDay } = req.body;
    if (typeof pricePerDay !== "number" || pricePerDay < 0) {
      return res
        .status(400)
        .json({ error: "Price per day must be a positive number." });
    }
    const equipment = new Equipment({ name, type, available, pricePerDay });
    const saved = await equipment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Pobieranie listy sprzętu:

```js
const getEquipments = async (_, res) => {
  try {
    const list = await Equipment.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Pobieranie sprzętu po ID:

```js
const getEquipmentById = async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Equipment not found." });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Aktualizacja danych sprzętu:

```js
const updateEquipment = async (req, res) => {
  try {
    const { name, type, available, pricePerDay } = req.body;
    const updated = await Equipment.findByIdAndUpdate(
      req.params.id,
      { name, type, available, pricePerDay },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ error: "Equipment not found." });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Usuwanie sprzętu:

```js
const deleteEquipment = async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Equipment not found." });
    res.json({ message: "Equipment deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 3. Transakcyjne wypożyczanie i zwracanie sprzętu

Najważniejsze operacje w systemie wykorzystują transakcje MongoDB do zapewnienia spójności danych:

```js
const rentEquipment = async (req, res) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { user, equipment, rentalDate, returnDate } = req.body;

    const eq = await Equipment.findById(equipment).session(session);
    if (!eq) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Equipment not found." });
    }

    if (!eq.available) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Equipment unvailable." });
    }

    const usr = await User.findById(user).session(session);
    if (!usr) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "User not found." });
    }

    const start = new Date(rentalDate);
    const end = new Date(returnDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((end - start) / msPerDay) || 1;
    const cost = days * eq.pricePerDay;

    eq.available = false;
    await eq.save({ session });

    const rental = new Rental({
      user,
      equipment,
      rentalDate,
      returnDate,
      returned: false,
      cost,
    });
    const savedRental = await rental.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedRental);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
```

```js
const returnRental = async (req, res) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const rental = await Rental.findById(id).session(session);
    if (!rental) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Rental not found." });
    }

    if (rental.returned) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Equipment already returned." });
    }

    const eq = await Equipment.findById(rental.equipment).session(session);
    if (!eq) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Equipment not found." });
    }

    rental.returned = true;
    await rental.save({ session });

    eq.available = true;
    await eq.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Equipment returned correctly.", rental });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
```

### 4. Zapytanie raportujące z populacją danych

```js
const getRentalsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rentals = await Rental.find({ user: userId })
      .populate("user", "name email")
      .populate("equipment", "name type available");
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Technologie i metody zastosowane w projekcie

- **Node.js** - środowisko uruchomieniowe JavaScript
- **Express.js** - framework webowy dla Node.js
- **MongoDB** - dokumentowa baza danych NoSQL
- **Mongoose** - ODM (Object Document Mapper) dla MongoDB
- **Docker** - konteneryzacja bazy danych
- **CORS** - obsługa Cross-Origin Resource Sharing

### Kluczowe rozwiązania techniczne:

#### 1. **Transakcje ACID w MongoDB**

- Wykorzystanie MongoDB Replica Set do obsługi transakcji
- Zapewnienie atomowości operacji wypożyczania i zwracania
- Rollback w przypadku błędów

#### 2. **Architektura REST API**

|        |                |                          |
| ------ | -------------- | ------------------------ |
| GET    | /api/users     | Lista użytkowników       |
| GET    | /api/users/:id | Szczegóły użytkownika    |
| POST   | /api/users     | Dodanie użytkownika      |
| PUT    | /api/users/:id | Aktualizacja użytkownika |
| DELETE | /api/users/:id | Usunięcie użytkownika    |

|        |                    |                      |
| ------ | ------------------ | -------------------- |
| GET    | /api/equipment     | Lista sprzętu        |
| GET    | /api/equipment/:id | Szczegóły sprzętu    |
| POST   | /api/equipment     | Dodanie sprzętu      |
| PUT    | /api/equipment/:id | Aktualizacja sprzętu |
| DELETE | /api/equipment/:id | Usunięcie sprzętu    |

|      |                         |                        |
| ---- | ----------------------- | ---------------------- |
| GET  | /api/rentals            | Lista wypożyczeń       |
| GET  | /api/equipment/:id      | Szczegóły wypożyczenia |
| POST | /api/rentals/rent       | Wypożyczenie sprzętu   |
| PUT  | /api/rentals/:id/return | Zwrot sprzętu          |

#### 3. **Obsługa błędów**

- Obsługa błędów w kontrolerach
- Walidacja danych wejściowych

#### 4. **Replica Set MongoDB**

- Konfiguracja w Docker Compose
- Umożliwienie transakcji ACID
- Zwiększenie niezawodności systemu

### Zalety zastosowanych rozwiązań:

- **Spójność danych** - transakcje zapewniają, że nie dojdzie do sytuacji, gdzie sprzęt jest wypożyczony ale pozostaje dostępny
- **Skalowalność** - architektura pozwala na łatwe dodawanie nowych funkcjonalności
- **Łatwość rozwoju** - separacja logiki, kontrolerów i modeli
