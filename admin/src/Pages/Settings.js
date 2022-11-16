import { useContext, useEffect, useState } from "react"
import { SessionContext } from "../Hooks/SessionContext"
import Preloader from "../Components/Preloader"
import axios from "axios";

var t = {};

export default function Settings() {
	const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
	const { user, setUser, perms } = useContext(SessionContext);
  const [vars, setVars] = useState({
    "change_password": {
      "new": "",
      "confirm_new": "",
      "old": ""
    }
  })

  useEffect(() => {
    if (isLoading) {
      axios.get('/api/root_admin?query=all').then((resp) => {
        setUsers(resp.data.results);
        setIsLoading(false)
      })
    }
  }, [isLoading])

	return (
		<>
			<h1 class="h3 m-5 text-gray-800">Parametres</h1>

			{isLoading ? (
				<div className="preloader-wrapper page">
					<Preloader />
				</div>
			) : (
				<div className="row m-5">
					<div className="col-4">
						<div className="card shadow my-5">
							<div className="card-header">
								<h6 class="m-0 font-weight-bold text-primary">
									Modification du mot de passe
								</h6>
							</div>
							<div className="card-body">
								<form className="" onSubmit={(e) => {
                  e.preventDefault();
                  document.getElementById('submit-change-pass').disabled = true
                  if (vars.change_password.confirm_new == vars.change_password.new && vars.change_password.old.length && vars.change_password.new != vars.change_password.old) {
                    axios.patch('/api/root_admin?query=change_password', {new: vars.change_password.new, old: vars.change_password.old}).then((resp) => {
                      alert('Mot de passe a été modifié');
                      window.location.reload();
                      document.getElementById('submit-change-pass').disabled = false
                    }).catch((err) => {
                      if (err.response.status == 401) {
                        alert('Mot de passe incorrect')
                      } else {
                        alert("Une erreur s'est produite");
                      }
                      document.getElementById('submit-change-pass').disabled = false
                    })
                  }
                }}>
                <input
									type="text"
									className="form-control form-control-sm mb-3"
									value={user}
									disabled
								/>
								<label className="form-label">
									Ancien mot de passe
								</label>
								<input
									type="password"
									className="form-control form-control-sm mb-3"
                  onChange={(e) => {
                    t = vars;
                    t.change_password.old = e.target.value;
                    setVars(t);
                  }}
								/>
								<label className="form-label">
									Nouveau mot de passe
								</label>
								<input
									type="password"
									className="form-control form-control-sm mb-3"
                  onChange={(e) => {
                    t = vars;
                    t.change_password.new = e.target.value;
                    setVars(t);
                  }}
								/>
								<label className="form-label">
									Confirmez nouveau mot de passe
								</label>
								<input
									type="password"
									className="form-control form-control-sm mb-3"
                  onChange={(e) => {
                    t = vars;
                    t.change_password.confirm_new = e.target.value;
                    setVars(t);
                  }}
								/>
								<div className="d-flex justify-content-center">
									<input
                    id="submit-change-pass"
										type="submit"
										className="btn btn-primary btn-sm mb-3"
									/>
								</div>
                </form>
							</div>
						</div>
            
					</div>
          {perms > 0 ? <div className="col-8">
          <div className="card shadow my-5">
              <div className="card-header">
                <h6 class="m-0 font-weight-bold text-primary">
									Modification des mots de passe
								</h6>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom d'utilisateur</th>
                      <th>Privileges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => 
                    <tr>
                      <td>{u.ID}</td>
                      <td>{u.uname}</td>
                      <td>{u.privileges ? 'Administrateur' : 'Employé'}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div> : ''}
				</div>
			)}
		</>
	)
}
