import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";


function App() {
    const [sessions, setSessions] = useState([]);
    const [currentView, setCurrentView] = useState("home");
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [userSessions, setUserSessions] = useState({});
    const [plannedSessions, setPlannedSessions] = useState([]);

    const [formData, setFormData] = useState({
        subject: "",
        topic: "",
        date: "",
        time: "",
        location: "",
        capacity: "",
    });

    const [authData, setAuthData] = useState({ username: "", password: "" });
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("currentUser");
        const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
        if (savedUser) {
            setCurrentUser(savedUser);
            setCurrentView("home");
        }
        setUsers(savedUsers);
    
        // Fetch sessions from the backend
        axios.get("https://study-session-organizer.onrender.com/api/sessions")
            .then((res) => setSessions(res.data))
            .catch((err) => console.error("Failed to fetch sessions", err));
    }, []);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://study-session-organizer.onrender.com/api/sessions", formData)
            .then((res) => {
                setSessions([...sessions, res.data]);
                setFormData({
                    subject: "",
                    topic: "",
                    date: "",
                    time: "",
                    location: "",
                    capacity: ""
                });
            })
            .catch((err) => console.error("Failed to create session", err));
    };
    

    const handleAuthChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const userExists = users.find((user) => user.username === authData.username);
        if (userExists) {
            alert("Username already taken! Try a different one.");
        } else {
            const updatedUsers = [...users, authData];
            setUsers(updatedUsers);
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            alert("Account created successfully! You can now log in.");
            setIsRegistering(false);
        }
        setAuthData({ username: "", password: "" });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(
            (user) => user.username === authData.username && user.password === authData.password
        );
        if (user) {
            setCurrentUser(user.username);
            localStorage.setItem("currentUser", user.username);
            setCurrentView("home");
        } else {
            alert("Invalid credentials! Please try again.");
        }
        setAuthData({ username: "", password: "" });
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        setCurrentView("home");
    };

    const handleAttendSession = (sessionId) => {
        if (currentUser) {
            setSessions(
                sessions.map((session) =>
                    session.id === sessionId ? { ...session, attended: true } : session
                )
            );

            setUserSessions({
                ...userSessions,
                [currentUser]: [
                    ...(userSessions[currentUser] || []),
                    sessions.find((session) => session.id === sessionId),
                ],
            });

            setPlannedSessions([
                ...plannedSessions,
                sessions.find((session) => session.id === sessionId),
            ]);
        }
    };

    const getUserSessions = () => {
        if (!currentUser) return { past: [], upcoming: [] };
        const attendedSessions = userSessions[currentUser] || [];
        const pastSessions = attendedSessions.filter((session) => session.attended);
        const upcomingSessions = sessions.filter(
            (session) => !attendedSessions.find((s) => s.id === session.id)
        );
        return { past: pastSessions, upcoming: upcomingSessions };
    };

    const { past, upcoming } = getUserSessions();

    return (
        <div>
            <header>
                <h1>Study Session Organizer</h1>
                <nav>
                    <ul>
                        <li><button onClick={() => setCurrentView("home")}>Home</button></li>
                        <li><button onClick={() => setCurrentView("sessions")}>Browse Sessions</button></li>
                        <li><button onClick={() => setCurrentView("create")}>Create Session</button></li>
                        <li><button onClick={() => setCurrentView("dashboard")}>Dashboard</button></li>
                        <li>
                            {currentUser ? (
                                <button onClick={handleLogout}>Logout ({currentUser})</button>
                            ) : (
                                <button onClick={() => setCurrentView("login")}>Login</button>
                            )}
                        </li>
                    </ul>
                </nav>
            </header>

            <main>
            {currentView === "sessions" && (
    <section className="browse-sessions">
        <h2 className="section-title">📚 Explore Upcoming Study Sessions</h2>
        <p className="section-description">💡 Find a session that fits your schedule and join the academic fun!</p>
        <div className="session-grid">
            {sessions.length === 0 ? (
                <p className="no-sessions">🚫 No sessions available right now. Be the first to create one!</p>
            ) : (
                sessions.map((session) => (
                    <div key={session.id} className="session-card">
                        <div className="card-header">
                            <h3>{session.subject} - <span>{session.topic}</span></h3>
                        </div>
                        <div className="card-details">
                            <p>📅 <strong>Date:</strong> {session.date}</p>
                            <p>🕒 <strong>Time:</strong> {session.time}</p>
                            <p>📍 <strong>Location:</strong> {session.location}</p>
                            <p>👥 <strong>Capacity:</strong> {session.capacity}</p>
                        </div>
                        {!session.attended && currentUser && (
                            <button className="attend-btn" onClick={() => handleAttendSession(session.id)}>
                                ✅ Attend
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    </section>
)}


{currentView === "create" && (
    <section className="create-session">
        <h2 className="section-title">📝 Create a New Study Session</h2>
        <p className="section-description">
            🚀 Fill out the details below to organize a collaborative session with your classmates.
        </p>
        <form onSubmit={handleSubmit} className="create-form">
            <label>📚 Subject:</label>
            <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Math, History"
            />

            <label>🧠 Topic:</label>
            <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                placeholder="e.g., Derivatives, Civil War"
            />

            <label>📅 Date:</label>
            <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
            />

            <label>⏰ Time:</label>
            <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
            />

            <label>📍 Location:</label>
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Library Room 101"
            />

            <label>👥 Capacity:</label>
            <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                placeholder="e.g., 10"
            />

            <button type="submit" className="create-btn">🚀 Create Session</button>
        </form>
    </section>
)}


{currentView === "dashboard" && (
    <section className="dashboard-section">
        <h2 className="section-title">📋 My Dashboard</h2>
        <p className="section-description">See your session history, upcoming plans, and available study sessions.</p>

        {currentUser ? (
            <>
                <div className="dashboard-grid">

                    {/* Upcoming Sessions */}
                    <div className="dashboard-column">
                        <h3 className="dashboard-heading">⏳ Upcoming</h3>
                        {upcoming.length === 0 ? (
                            <p className="no-sessions">No upcoming sessions.</p>
                        ) : (
                            upcoming.map((session) => (
                                <div key={session.id} className="session-card">
                                    <div className="card-header">
                                        <h4>{session.subject} - <span>{session.topic}</span></h4>
                                    </div>
                                    <div className="card-details">
                                        <p>📅 <strong>Date:</strong> {session.date}</p>
                                        <p>🕒 <strong>Time:</strong> {session.time}</p>
                                        <p>📍 <strong>Location:</strong> {session.location}</p>
                                        <p>👥 <strong>Capacity:</strong> {session.capacity}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Planned Sessions */}
                    <div className="dashboard-column">
                        <h3 className="dashboard-heading">✅ Planned</h3>
                        {plannedSessions.length === 0 ? (
                            <p className="no-sessions">No planned sessions.</p>
                        ) : (
                            plannedSessions.map((session) => (
                                <div key={session.id} className="session-card">
                                    <div className="card-header">
                                        <h4>{session.subject} - <span>{session.topic}</span></h4>
                                    </div>
                                    <div className="card-details">
                                        <p>📅 <strong>Date:</strong> {session.date}</p>
                                        <p>🕒 <strong>Time:</strong> {session.time}</p>
                                        <p>📍 <strong>Location:</strong> {session.location}</p>
                                        <p>👥 <strong>Capacity:</strong> {session.capacity}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Past Sessions */}
                    <div className="dashboard-column">
                        <h3 className="dashboard-heading">📜 Past</h3>
                        {past.length === 0 ? (
                            <p className="no-sessions">No past sessions.</p>
                        ) : (
                            past.map((session) => (
                                <div key={session.id} className="session-card">
                                    <div className="card-header">
                                        <h4>{session.subject} - <span>{session.topic}</span></h4>
                                    </div>
                                    <div className="card-details">
                                        <p>📅 <strong>Date:</strong> {session.date}</p>
                                        <p>🕒 <strong>Time:</strong> {session.time}</p>
                                        <p>📍 <strong>Location:</strong> {session.location}</p>
                                        <p>👥 <strong>Capacity:</strong> {session.capacity}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </>
        ) : (
            <p className="no-sessions">Please log in to view your dashboard.</p>
        )}
    </section>
)}


{currentView === "home" && (
    <section className="home-section">
        <h2>Welcome to Study Session Organizer</h2>
        <p className="intro-text">
            Your one-stop platform to plan, join, and organize collaborative study sessions with your peers.
            Whether you're cramming for finals or just need a group to stay motivated, we've got you covered.
        </p>

        <div className="home-visuals">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135810.png" alt="Students studying" className="home-image" />
            <div className="highlight-boxes">
                <div className="highlight">
                    📚 Plan sessions easily
                </div>
                <div className="highlight">
                    👥 Connect with classmates
                </div>
                <div className="highlight">
                    ⏰ Stay on schedule
                </div>
            </div>
        </div>

        {!currentUser && <p className="cta-text">Get started by logging in or creating an account above!</p>}
        {currentUser && <p className="cta-text">Great to see you, {currentUser}! Jump back in using the nav above.</p>}
    </section>
)}


                {currentView === "login" && (
                    <section>
                        <h2>{isRegistering ? "Create an Account" : "Login"}</h2>
                        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                            <label>Username:</label>
                            <input type="text" name="username" value={authData.username} onChange={handleAuthChange} required />

                            <label>Password:</label>
                            <input type="password" name="password" value={authData.password} onChange={handleAuthChange} required />

                            <button type="submit">{isRegistering ? "Register" : "Login"}</button>
                        </form>
                        <button onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
                        </button>
                    </section>
                )}
            </main>
        </div>
    );
}

export default App;
