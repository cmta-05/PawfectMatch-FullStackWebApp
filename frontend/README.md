PHASE 2: UI IMPLEMENTATION
Pawfect Match - A Pet Matchmaking System

This phase focuses on building the frontend user interface of our web application based on the system’s Entity-Relationship Diagram (ERD) and use case diagrams.

PAGES DEVELOPED AND THEIR CONNECTIONS TO THE ERD & USE CASE


1. Visitor Pages

Home
- Introduces the platform and its purpose (Why Choose Pawfect Match).
- Serves as an entry point to the system, promoting Pet Profiles and encouraging account registration.

Browse Pets
- Displays publicly available Pet Profiles to unregistered users.
- Connected to the PET PROFILE and GUEST USER entities. Guest views are limited and tracked via SessionID.

About Us / Complaint
- Showcases the team and mission; also acts as a way for guests to send feedback or complaints.
- Related to CONTACT US entity; contact_name, contact_email, and contact_message fields are submitted here.

Login / Register
- User authentication and account creation.
- Directly tied to the PET OWNER entity (pet_ownerEmail, pet_ownerPassword, pet_ownerName).


2. Pet Owner Pages

Home
- Dashboard displaying platform navigation options and pet owner activities.
- Tied to PET OWNER.

Browse Pets
- Pet owners can view profiles and interact by sending match requests or adding to favorites.
- Links to PET PROFILE, MATCH, and FAVORITES entities.

My Pets
- Displays the pet profiles owned by the logged-in user.
- EPET OWNER to PET PROFILE through one-to-many relationship. Enables CRUD (Create, Read, Update, Delete) for pet data (Pet_name, Pet_age, Pet_breed, etc.).

Add/Edit/Delete Pet
- CRUD functionality on user-owned pet profiles.
- Directly manipulates PET PROFILE.

My Account
- Shows user’s personal data, favorite pets, and match requests.
- Favorites: Connects FAVORITES table via pet_ownerID and Pet_ID.
- Match Requests: Interacts with MATCH entity (petFrom_ID, petTo_ID, match_message).

Contact Us
- Form for users to reach out or send complaints.
- ERD Link: Submits to CONTACT US.

Logout
- Ends the current user session.


3. Admin Pages (Developer’s View)
These are backend-focused but have frontend display for moderation and system insights.

User Management
- Block/Unblock/Delete pet owner accounts.
- Manages data within PET OWNER.

Pet Profile Moderation
- Approve/Reject/Delete pet profiles.
- Moderation role defined under ADMIN, linked to PET PROFILE.

Complaint Handling
- Views and manages submitted CONTACT US messages.
- CONTACT US handled by ADMIN.

Report and Analytics
- Admin dashboard for system data (e.g., pet stats, user count, match success rate).
- Aggregates from PET PROFILE, MATCH, FAVORITES, and PET OWNER.
