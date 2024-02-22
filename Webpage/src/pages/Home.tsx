import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

  useEffect(() => {
    navigate("/board/1");
  }, []);
  return <></>;
};

export default Home;
