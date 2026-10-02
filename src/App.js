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

  const goHome = () => {
    handleGoHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToContact = () => {
    window.location.href =
      "mailto:info@example.com?subject=Information Request";
  };

  return (
    <div className="search-page-container">
      <nav className="navbar">
        <div className="nav-links">
          <button className="nav-btn" onClick={goHome} type="button">
            Home
          </button>
          <button className="nav-btn" onClick={scrollToContact} type="button">
            Contact
          </button>
        </div>
      </nav>

      <img
        className="banner-image"
        src={BenefitsOfAPIs}
        alt="Benefits of APIs"
      />

      <div className="content-area">
        <h2>Team Contributors</h2>

        <div className="user-cards-container" id="userCards">
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card"
              onClick={() => handleSelectUser(user.id)}
              style={{ cursor: "pointer" }}
            >
              <h3>ID: {user.id}</h3>
              <strong>{user.name}</strong>
              <p>@{user.username}</p>
              <p style={{ color: "#0066cc", marginTop: "4px" }}>{user.email}</p>
              <p
                style={{
                  color: "#475569",
                  fontSize: "10px",
                  fontStyle: "italic",
                }}
              >
                {user.phone}
              </p>
            </div>
          ))}
        </div>
        <h2>Search & Filter Posts</h2>
        <div className="filter-container">
          <input
            type="text"
            id="searchInput"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <input
            type="number"
            id="idInput"
            placeholder="User or Post ID..."
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          />
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="none">Sort: Default</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="za">Alphabetical (Z-A)</option>
          </select>
        </div>

        {error && <p role="alert">{error}</p>}

        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading Dashboard Assets...</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="search-results">
            {filteredAndSortedPosts.length > 0 ? (
              filteredAndSortedPosts.map((item) => (
                <div key={item.id} className="result-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))
            ) : (
              <p>No results found matching "{searchTerm}"</p>
            )}
          </div>
        )}
      </div>

      <button
        className="back-to-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        type="button"
        aria-label="Back to top"
      >
        ↑ Back to Top
      </button>

      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} API Search Dashboard. Powered by
          JSONPlaceholder.
        </p>
      </footer>
    </div>
  );
}
