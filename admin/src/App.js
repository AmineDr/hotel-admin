import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { SessionContext } from "./Hooks/SessionContext"
import AppRoutes from "./Hooks/AppRoutes"
import disconnect from "./Hooks/Disconnect"

import Sidebar from "./Components/Sidebar"
import Preloader from "./Components/Preloader"
import axios from "axios"
import ScrollTopButton from "./Components/ScrollTopButton"

function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState("");
  	const [perms, setPerms] = useState(0);
	const navigate = useNavigate();
  
	useEffect(() => {
		if (isLoading) {
			axios
				.get("/api/root_check_session")
				.then((resp) => {
					if (resp.data.status === "ValidSession") {
						setIsLoading(false);
            setUser(resp.data.username);
            setPerms(resp.data.perms);
					}
				})
				.catch(() => {
          setUser('');
					setIsLoading(false);
          navigate('/login')
				})
		}
    
	}, [isLoading])

	if (isLoading) {
		return <Preloader />
	}

	if (window.location.href.replace(window.location.origin, "").startsWith("/login")) {
		return (
			<SessionContext.Provider value={{ user, setUser, perms, setPerms }}>
					<AppRoutes />
			</SessionContext.Provider>
		)
	}

	return (
		<>
			<SessionContext.Provider value={{ user, setUser, perms, setPerms }}>
				<div id="wrapper">
					<Sidebar />
					<div className="content-wrapper" style={{width: "2800px", marginLeft: "200px"}}>
						<AppRoutes />
					</div>
					<ScrollTopButton />
				</div>
			</SessionContext.Provider>
		</>
	)
}

export default App
