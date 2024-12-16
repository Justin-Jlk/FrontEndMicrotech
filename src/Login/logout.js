import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(false); 
    navigate("/login"); 
  }, [setIsAuthenticated, navigate]);

  return null; 
}

export default Logout;

