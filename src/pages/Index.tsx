
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to Home
    navigate("/");
  }, [navigate]);
  
  return null;
};

export default Index;
