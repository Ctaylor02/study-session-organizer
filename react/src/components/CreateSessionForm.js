import React, { useState } from "react";

function CreateSessionForm() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New session created:", { subject, topic, date, time, location });
  };

  return (
    <section id="create">
      <h2>Create a New Study Session</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        <input type="text" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <button type="submit">Create Session</button>
      </form>
    </section>
  );
}

export default CreateSessionForm;
