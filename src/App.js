import React, { useState, useEffect, useMemo } from "react";

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

  return (
    <div className="dashboard-container">
      {/* Header / Nav Controls */}
      <header className="navbar">
        <button onClick={handleGoHome}>Home</button>
        <button onClick={handleScrollToContact}>Contact</button>
      </header>

      {/* Filter & Search Bar Controls */}
      <section className="controls">
        <input
          type="text"
          placeholder="Search titles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Filter by User or Post ID..."
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Sort: Default</option>
          <option value="az">Alphabetical (A-Z)</option>
          <option value="za">Alphabetical (Z-A)</option>
        </select>
      </section>

      {/* Loading & Error Indicators */}
      {isLoading && (
        <div id="loadingContainer">
          <p>Loading dashboard data...</p>
        </div>
      )}

      {error && (
        <div id="errorContainer">
          <p
            style={{
              color: "#ef4444",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Main Dashboard Content */}
      {!isLoading && !error && (
        <main>
          {/* User Cards Section */}
          <section id="userCards" className="user-cards-grid">
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
                <p style={{ color: "#0066cc", marginTop: "4px" }}>
                  {user.email}
                </p>
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
          </section>

          {/* Results List Section */}
          <ul id="results" className="results-list">
            {filteredAndSortedPosts.map((item) => (
              <li key={item.id}>
                <span className="id-badge">
                  User ID: {item.userId} | Post ID: {item.id}
                </span>
                <br />
                <strong>{item.title}</strong>
              </li>
            ))}
          </ul>
        </main>
      )}

      <footer>
        <p>Dashboard Contact Info & Footer</p>
      </footer>
    </div>
  );
}
