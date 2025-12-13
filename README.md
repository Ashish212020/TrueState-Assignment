# Retail Sales Management System - TruEstate Assignment

## 1. Overview
This project is a full-stack Retail Sales Management Dashboard designed to handle large-scale transaction data. It features a performant backend API for complex querying and a responsive, Figma-aligned frontend. The system enables real-time insights through multi-select filtering, full-text search, and dynamic data visualization, tailored for retail analytics.

## 2. Tech Stack
* **Frontend:** React (Vite), CSS3 (Custom Modules), Lucide React (Icons)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas) with Mongoose ODM
* **Tools:** Git, Postman, Vercel/Render (Deployment)

## 3. Search Implementation Summary
Search is implemented using MongoDB's `$or` operator combined with `$regex` for pattern matching.
* **Fields:** Scans both `Customer Name` and `Phone Number` simultaneously.
* **Performance:** Queries are case-insensitive (`$options: 'i'`) and debounced on the frontend (500ms delay) to minimize database load during typing.

## 4. Filter Implementation Summary
A robust multi-select filtering system allows users to refine data by multiple dimensions simultaneously.
* **Logic:** Uses MongoDB's `$in` operator for categorical fields (Region, Gender, Category), allowing multiple values to be selected (OR logic within categories, AND logic between categories).
* **Advanced:**
    * **Tags:** Uses regex mapping to find tags inside comma-separated strings (e.g., finding "Wireless" inside "Gadgets,Wireless").
    * **Date & Age:** Implemented with dynamic comparison operators (`$gte`, `$lte`) relative to the current system date.

## 5. Sorting Implementation Summary
Sorting is handled server-side to ensure accuracy across paginated datasets.
* **Mechanism:** The backend applies `.sort()` logic dynamically based on the requested parameter.
* **Options:** Supports sorting by Date (Newest/Oldest), Quantity (High/Low), and Customer Name (A-Z). Sorting persists even when search or filters are active.

## 6. Pagination Implementation Summary
Pagination is server-side to ensure performance with large datasets.
* **Backend:** Uses `.skip()` and `.limit(10)` to fetch only the necessary slice of data.
* **Frontend:** Features a "Sliding Window" UI (e.g., [3][4][5][6][7]) that dynamically calculates the visible page numbers based on the current position.

## 7. Setup Instructions

**Prerequisites:** Node.js, npm, MongoDB URI.

1.  **Clone Repository:**
    ```bash
    git clone <repository-url>
    cd truestate-assignment
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create .env file with: MONGO_URI=your_connection_string
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Database Seeding:**
    To populate the database with the provided dataset:
    ```bash
    cd backend
    node seed.js
    ```