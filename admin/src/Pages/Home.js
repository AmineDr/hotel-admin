import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Preloader from "../Components/Preloader";
import { SessionContext } from "../Hooks/SessionContext";

export default function Home() {
  const navigate = useNavigate();
  const {perms} = useContext(SessionContext);

  useEffect(() => {
    if (perms == 0) {
      navigate('/reservations');
    } else if (perms > 0) {
      navigate('/stats');
    }
  })

  return (
      <div className="card">
        <div className="card-header text-center">
          <h2>Accueil</h2>
        </div>
        <div className="card-body preloader-wrapper page">
          {<Preloader/>}
        </div>
      </div>
  )
}
