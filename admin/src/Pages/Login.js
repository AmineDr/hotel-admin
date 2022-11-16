import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SessionContext } from "../Hooks/SessionContext"

export default function Login() {
	const [isLoading, setIsLoading] = useState(true);
	const { user, setUser, setPerms } = useContext(SessionContext);
    const [username, setUsername] = useState('');
    const [pword, setPword] = useState('');
    const navigate = useNavigate();

    const height = window.innerHeight
	useEffect(() => {
		if (isLoading) {
			setIsLoading(false)
		}
	}, [isLoading])

    const login = (e) => {
        if (username && pword) {
            axios.post('/api/root_login', {uname: username, pword: pword}).then((resp) => {
                if (resp.data.status == "success") {
                    setUser(resp.data.username);
                    setPerms(resp.data.perms);
                    navigate('/');
                }
            }).catch(() => {
                setUser('');
            })
        }
    }
    if (user) {
        navigate('/');
    }
	return (
		<div className="container">
			<div className="row justify-content-center">
				<div
					className="col-xl-10 col-lg-12 col-md-9 d-flex justify-content-center flex-column"
					style={{ height: height }}
				>
					<div
						className="card o-hidden border-0 shadow-lg my-5"
						style={{ height: `${height * 0.5}px` }}
					>
						<div className="card-body p-0">
							<div className="row h-100">
								<div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
								<div className="col-lg-6 d-flex align-items-center">
									<div className="p-5 w-100">
										<div class="text-center mb-5">
											<h1 class="h4 text-gray-900 mb-4">
												Bienvenue!
											</h1>
										</div>
										<form className="user" onSubmit={(e) => {
													e.preventDefault();
													login(e);
												}}>
											<div className="form-group">
												<input
													type="text"
													class="form-control form-control-user"
													aria-describedby="email"
													placeholder="Nom d'utilisateur"
                                                    onChange={(e) => setUsername(e.target.value)}
												/>
											</div>
											<div className="form-group">
												<input
													type="password"
													class="form-control form-control-user"
													aria-describedby="pword"
													placeholder="Mot de passe"
                                                    onChange={(e) => setPword(e.target.value)}
												/>
											</div>
											<input
												class="btn btn-primary btn-user btn-block"
												value="Connexion"
												type="submit"
											/>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
