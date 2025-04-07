import React, { useState } from "react";

function SessionList() {
  const [sessions, setSessions] = useState([
    { subject: "Math", topic: "Derivatives", date: "2025-04-10", time: "14:00", location: "Library Room A" },
    { subject: "CS", topic: "React Basics", date: "2025-04-12", time: "16:00", location: "Online" }
  ]);

  return (
    <section id="sessions">
      <h2>Available Study Sessions</h2>
      <h4>Press "Attend" to add the session to your planned sessions!</h4>
      <div>
        {sessions.map((session, index) => (
          <div key={index} className="session-item">
            <strong>{session.subject}</strong> - {session.topic}<br/>
            📅 {session.date} 🕒 {session.time}<br/>
            📍 {session.location}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SessionList;
