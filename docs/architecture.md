# System Architecture
---------------------------------------------------------------------

## 1. Backend Architecture
The backend is built on a **Layered Architecture** (Controller-Service-Model pattern) using Node.js and Express. This ensures separation of concerns and maintainability.

* **API Layer (Routes):** Defines RESTful endpoints (`/api/transactions`) and delegates requests to controllers.
* **Logic Layer (Controllers):** Handles the business logic for filtering, sorting, and pagination. It constructs dynamic MongoDB queries based on `req.query` parameters.
* **Data Layer (Models):** Defines the Mongoose schema for strict typing of the Sales Data (Numbers, Strings, Dates) and handles database interactions.

## 2. Frontend Architecture
The frontend follows a **Component-Based Architecture** using React.

* **State Management:** Centralized state in `App.jsx` manages the "Single Source of Truth" for filters, search query, sorting, and pagination.
* **Service Layer:** A dedicated `api.js` module handles all HTTP communication with the backend, keeping UI components clean.
* **UI Strategy:** Custom CSS is used for pixel-perfect alignment with the provided Figma design, avoiding heavy component libraries to ensure performance.

## 3. Data Flow Diagram

```mermaid
[User Interaction] -> [React Frontend]
        |
        v
[Construct Query Params] (e.g., ?search=Neha&region=North&sort=date-desc)
        |
        v
   [API Request]
        |
        v
[Express Backend] -> [Build MongoDB Query] -> [MongoDB Atlas]
                                                  |
                                                  v
[React Frontend] <- [JSON Response] <- [Return Filtered Data + Stats]


4. Folder Structure

root/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Business logic (Search/Filter)
│   │   ├── models/        # Database Schema
│   │   ├── routes/        # API Endpoints
│   │   └── index.js       # Entry point
│   ├── seed.js            # Data import script
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── services/      # API communication
│   │   ├── App.jsx        # Main UI & State
│   │   ├── App.css        # Styling
│   │   └── main.jsx       # React DOM root
│   └── package.json
│
└── docs/
    └── architecture.md    # System design documentation

   