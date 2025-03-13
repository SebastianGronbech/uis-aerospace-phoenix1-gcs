import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5017/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      {user ? <p>Logged in as: {user.username}</p> : <p>Loading...</p>}
      <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
