import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { SessionContext } from "../Hooks/SessionContext"

export default function Sidebar() {
	const {perms} = useContext(SessionContext);

	return (
		<ul
			className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
			style={{position: "fixed", zIndex: "200"}}
			id="accordionSidebar"
		>
			<Link
				className="sidebar-brand d-flex align-items-center justify-content-center"
				to=""
			>
				<div className="sidebar-brand-icon rotate-n-15">
					<i className="fas fa-laugh-wink"></i>
				</div>
				<div className="sidebar-brand-text mx-3">
					Aria Sky
				</div>
			</Link>

			<hr className="sidebar-divider my-0" />

			{perms >= 1 ? <li className="nav-item">
				<Link className="nav-link" to="/stats">
					<i className="fa fa-tachometer-alt mr-3"></i>
					<span>Statistiques</span>
				</Link>
			</li> : ''} 
			<li className="nav-item">
				<Link className="nav-link" to="/reservations">
					<i className="fa fa-address-book mr-3"></i>
					<span>Reservations</span>
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/tarifs">
                <i className='fa fa-credit-card mr-3'></i>
					<span>Tarifs</span>
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/settings">
                    <i className='fa fa-cog mr-3'></i>
					<span>Parametres</span>
				</Link>
			</li>
		</ul>
	)
}
