import React, { useState, useEffect, useMemo } from "react";
import BenefitsOfAPIs from "./assets/Benefits-of-APIs.png";

export default function App() {
  // 1. Data & Async State
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Control/Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [sortOrder, setSortOrder] = useState("none");

  // 3. Fetch Data on Mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [postsResponse, usersResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/posts"),
          fetch("https://jsonplaceholder.typicode.com/users"),
        ]);

        if (!postsResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const postsData = await postsResponse.json();
        const usersData = await usersResponse.json();

        setPosts(postsData);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error("Data failed to fetch:", err);
        setError(
          "Failed to load dashboard data. Please check your connection.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // 4. Derived State: Real-time Filter & Sort
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter((item) => {
      const matchesText = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesId =
        selectedId === "" ||
        item.userId.toString() === selectedId ||
        item.id.toString() === selectedId;

      return matchesText && matchesId;
    });

    if (sortOrder === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "za") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [posts, searchTerm, selectedId, sortOrder]);

  // 5. Actions
  const handleSelectUser = (userId) => {
    setSelectedId(userId.toString());
  };

  const handleGoHome = () => {
    setSearchTerm("");
    setSelectedId("");
    setSortOrder("none");
  };

  const handleScrollToContact = () => {
    const footerElement = document.querySelector("footer");
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goHome = () => {
    // Add home navigation logic here
  };

  const scrollToContact = () => {
    // Add contact scroll/navigation logic here
  };


  return (
    <div className="search-page-container">
      <h2>Search Dashboard</h2>

      {/* Search Input */}
      <div className="search-bar">
        <input
          type="text"
          id="searchInput"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results Section */}
      <div className="search-results">
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <div key={item.id} className="result-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              </div>
          ))
        ) : (
          <p>No results found matching "{searchTerm}"</p>
        )}
      </div>
      <nav className="navbar">
        <div className="nav-links">
          <button className="nav-btn" onClick={goHome} type="button">
            Home
          </button>
          <button className="nav-btn" onClick={scrollToContact} type="button">
            Contact
          </button>
        </div>
      
      <img
        className="banner-image"
        src={BenefitsOfAPIs}
        alt="Benefits of APIs"
      />

      <div className="content-area">
        <h2>Team Contributors</h2>

        <div className="user-cards-container" id="userCards">
          {users.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
        <h2>Search & Filter Posts</h2>
        <div className="filter-container">
          <input
            type="text"
            id="searchInput"
            placeholder="Search by title..."
          />
          <input type="number" id="idInput" placeholder="User or Post ID..." />
          <select id="sortOrder" defaultValue="none">
            <option value="none">Sort: Default</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="za">Alphabetical (Z-A)</option>
          </select>
        </div>

        {isLoading && (
          <div className="loading-container">
            <div className="spinner">
            <p>Loading Dashboard Assets...</p>
          </div>
        
