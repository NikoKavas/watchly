# 🎬 Watchly – Movie Discovery Web App

## 🤖 Introduction
**Watchly** is a modern movie discovery platform built with **React.js**, **Appwrite**, and **TailwindCSS**.  
It allows users to **browse trending movies**, **search titles**, and **discover popular films** using the **TMDB API**.  
The application emphasizes performance, clean code, and responsive design — delivering a smooth and cinematic user experience across all devices.

---

## ⚙️ Tech Stack

### **Frontend**
- **React.js** – A powerful JavaScript library for building interactive UIs using reusable components and efficient state management.  
- **React-use** – A lightweight utility library providing essential hooks that simplify state and side-effect handling in React.  
- **Vite** – A next-generation frontend build tool offering lightning-fast HMR (Hot Module Replacement) and optimized production builds.  
- **Tailwind CSS** – A utility-first CSS framework that enables rapid design customization through composable, responsive classes.

### **Backend**
- **Appwrite** – An open-source Backend-as-a-Service (BaaS) that handles databases, authentication, and APIs with a developer-friendly interface.  
  Appwrite powers features like search count tracking, database management, and secure data persistence.  
- **TMDB API** – The Movie Database API provides live data for trending and popular movies, including posters, ratings, and descriptions.

---

## 🔋 Features

### 🎥 **Movie Discovery**
- Browse popular and trending movies pulled dynamically from the TMDB API.  
- Each movie card displays the title, rating, genre, and release details.

### 🔍 **Search Functionality**
Unlike traditional apps that rely solely on TMDB’s global popularity rankings, **Watchly** features a **custom-built trending algorithm**.  
Each time a user searches for a movie, the app:
1. Records the search term in the Appwrite database (`metrics` table).
2. Increments a counter (`count`) every time the same movie or search term is repeated.
3. Automatically recalculates which movies are the **most-searched** across all users.  

The top five movies with the highest search count are displayed as **Trending Movies**, making the section fully **user-driven** and reflective of actual community interest.

### 📈 **Custom Trending Algorithm**
- Dynamically fetches and ranks movies by popularity to display what’s trending globally.

### 🎨 **Modern UI/UX**
- A sleek dark-themed interface designed with **TailwindCSS**.  
- Incorporates elegant gradients, minimal shadows, and high readability typography using **DM Sans** and **Bebas Neue**.

### 📱 **Responsiveness**
- Fully responsive layout with adaptive grids and flexible image scaling.  
- Designed to maintain structure and readability across desktop, tablet, and mobile devices.

### ⚡ **Performance**
- Powered by Vite for instant development feedback and optimized builds.  
- Uses `react-use`’s debounced input to minimize API calls and enhance app speed.

---

## 🧩 Core Architecture

### **1. App Structure**
- **App.jsx** – The root component managing API calls, state handling, and rendering all sections (Hero, Search, and Movie Grid).
- **Search.jsx** – A reusable controlled component for user input, featuring a search icon and styled placeholder.
- **MovieCard.jsx** – Dynamically renders movie data (poster, title, and meta info) inside responsive cards.
- **Appwrite.js** – Manages Appwrite client initialization and defines backend database logic (fetch, update, create entries).

### **2. State Management**
Implemented with React’s built-in hooks:
- `useState` for handling search terms, loading states, and API data.
- `useEffect` for running API calls on search updates.
- `useDebounce` from **react-use** for controlling input frequency.

### **3. API Integration**
- Fetches data from TMDB’s REST endpoints.  
- Uses a Bearer token stored in environment variables for security.  
- Results dynamically populate the UI in real-time.

### **4. Appwrite Database Logic**
Handles search tracking and analytics:
```js
const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
  Query.equal('searchTerm', searchTerm)
])

if (result.documents.length > 0) {
  await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
    count: doc.count + 1
  })
} else {
  await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
    searchTerm,
    count: 1,
    movie_id: movie.id,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  })
}
```

---

## 💅 Design System

| Element | Description |
|----------|--------------|
| **Primary Color** | `#030014` – Deep violet for cinematic contrast |
| **Accent Gradient** | Linear gradient from `#D6C7FF` to `#AB8BFF` for titles |
| **Typography** | *DM Sans* for readability, *Bebas Neue* for highlights |
| **Layout** | Fluid grid system using Tailwind’s responsive breakpoints |
| **Hero Background** | Custom pattern defined as `bg-hero-pattern` |

---

## 🧠 Summary
**Watchly** demonstrates how modern frontend tools and BaaS integration can create a high-performing, visually polished web experience.  
By combining **React**, **TailwindCSS**, **Vite**, and **Appwrite**, it achieves:
- Clean architecture  
- Scalable backend logic  
- Smooth, responsive design  
- A delightful and engaging user journey for movie lovers.  
