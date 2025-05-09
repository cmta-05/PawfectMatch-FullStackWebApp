## 📘 Phase 2: UI Implementation – Pawfect Match  
🔄 **_Updated to reflect recent frontend additions (Admin Dashboard & UI Edits)_**

This phase focuses on building the **frontend user interface** of our web application, aligned with the system’s **Entity-Relationship Diagram (ERD)** and **Use Case Diagrams**.

![frontend page](/docs/frontend.jpg)

---

### ✅ Pages Developed & Their Connection to the ERD / Use Cases

---

### 👤 Visitor Pages

| **Page**           | **Description**                                                                 | **Linked Entities / Use Cases**                     |
|--------------------|----------------------------------------------------------------------------------|-----------------------------------------------------|
| **Home**           | Introduces the platform and purpose. Promotes pet profiles and registration.     | Entry point to system (public access)               |
| **Browse Pets**    | Displays pet profiles to unregistered users.                                     | `PET PROFILE`, `GUEST USER` (views tracked via `SessionID`) |
| **About Us / Complaint** | Team background and form for guest complaints or feedback.                  | `CONTACT US` (`contact_name`, `contact_email`, `contact_message`) |
| **Login / Register** | User authentication and account creation.                                     | `PET OWNER` (`pet_ownerEmail`, `pet_ownerPassword`, `pet_ownerName`) |

---

### 🐶 Pet Owner Pages

| **Page**           | **Description**                                                                 | **Linked Entities / Use Cases**                     |
|--------------------|----------------------------------------------------------------------------------|-----------------------------------------------------|
| **Dashboard (Home)**| Pet owner's landing page with system navigation.                               | `PET OWNER`                                          |
| **Browse Pets**    | View pet profiles, send match requests, add to favorites.                        | `PET PROFILE`, `MATCH`, `FAVORITES`                 |
| **My Pets**        | Displays pet profiles owned by the user with full CRUD support.                 | `PET PROFILE` (linked via one-to-many with `PET OWNER`) |
| **Add/Edit/Delete Pet** | Full CRUD functionality for pet data.                                      | Direct manipulation of `PET PROFILE`                |
| **My Account**     | View personal info, match requests, and favorite pets.                           | `MATCH`, `FAVORITES`, `PET OWNER`                   |
| **Contact Us**     | Feedback and complaint form for logged-in users.                                | `CONTACT US`                                         |
| **Logout**         | Ends the current session.                                                       | Session management                                   |

---

### 🛠️ Admin Pages  
🔄 **_Newly Added by Frontend Manager_**

| **Page**               | **Description**                                                               | **Linked Entities / Use Cases**                     |
|------------------------|--------------------------------------------------------------------------------|-----------------------------------------------------|
| **Admin Dashboard**    | Displays system metrics (e.g., user count, pet stats, match success).         | Aggregates data from `PET OWNER`, `PET PROFILE`, `MATCH`, `FAVORITES` |
| **User Management**    | View, block/unblock, or delete pet owner accounts.                            | `PET OWNER`                                          |
| **Pet Profile Moderation** | Approve, reject, or delete pet profiles.                                 | `PET PROFILE` (Admin moderation role)               |
| **Complaint Handling** | View and manage messages submitted through Contact Us.                        | `CONTACT US`                                         |

---

> ✨ **Note:** These pages are directly inspired by the ERD and use case flows to ensure consistency between frontend components and backend data architecture.
