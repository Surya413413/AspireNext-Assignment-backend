AspireNext Assignment - Backend
### Project Overview

This repository contains the backend of the AspireNext College Dashboard application.

The backend is built using Node.js, Express.js, and SQLite and provides APIs for:

Fetching college data

Managing user favorites

Handling reviews

It works seamlessly with the frontend to provide a full-stack college dashboard experience.

### Tech Stack

Backend: Node.js, Express.js

Database: SQLite

Authentication: Optional JWT (for future implementation)

File Uploads: Multer (if you implement college images)

API Testing: Postman or similar tools

### Features

Colleges API

Fetch all colleges with optional filters (location, course, fee, search, sort).

Favorites API

Add a college to favorites for a user (POST /favorites).

Get all favorites for a user (GET /favorites/:user_id).

Remove a favorite (DELETE /favorites/:user_id/:favorite_id).

Reviews API (Optional)

Add and fetch reviews for colleges.

### Getting Started
1. Clone the repository
git clone https://github.com/Surya413413/AspireNext-Assignment-backend.git
cd AspireNext-Assignment-backend

2. Install dependencies
npm install

3. Start the server
node server.js


The server will run on http://localhost:5000
 by default.

Make sure to run the frontend to connect with this backend.

### API Endpoints
Colleges
Endpoint	Method	Description
/colleges	GET	Fetch all colleges (with filters)
Favorites
Endpoint	Method	Description
/favorites	POST	Add a college to favorites (requires college_id & user_id)
/favorites/:user_id	GET	Get all favorites for a specific user
/favorites/:user_id/:id	DELETE	Remove a favorite for a specific user

Request Example: Add Favorite

POST /favorites
{
  "college_id": 2,
  "user_id": 1
}


Request Example: Remove Favorite

DELETE /favorites/1/3


Removes favorite with id=3 for user user_id=1.

Database Schema

Colleges Table

CREATE TABLE colleges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT,
  course TEXT,
  fee INTEGER
);


Favorites Table

CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY(college_id) REFERENCES colleges(id)
);

### Notes

Make sure user_id is passed when adding or removing favorites to prevent NOT NULL constraint errors.

You can expand the backend to include authentication, reviews, and college images.

### File Structure
backend/
├─ node_modules/
├─ server.js
├─ package.json
├─ package-lock.json
├─ .env (optional for config)
└─ README.md

### Author


GitHub: https://github.com/Surya413413
