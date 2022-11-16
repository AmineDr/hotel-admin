import axios from "axios"
import { useEffect, useState } from "react"
import { NumericFormat } from "react-number-format"
import { useNavigate, useParams } from "react-router-dom"
import Preloader from "../Components/Preloader"
import { formatDate, getDays } from "../Hooks/FormatDate"

var chambers = []

export default function ReservationDetails() {
	const [isLoading, setIsLoading] = useState(true)
	const [reservationInfo, setReservationInfo] = useState({})
	const [days, setDays] = useState(1)
	const [total, setTotal] = useState(0)
	const { ID } = useParams("ID")

	const navigate = useNavigate()

	useEffect(() => {
		if (isLoading) {
			axios
				.get(`/api/reservation?query=ID&ID=${ID}`)
				.then((resp) => {
					setReservationInfo(resp.data.info)
					setDays(getDays(resp.data.info.from, resp.data.info.to))
					setIsLoading(false)

					let t = 0
					chambers = []

					resp.data.info.chambers.forEach((c) => {
						let ct = 0
						ct += c.price
						if (c.extra_beds && resp.data.info.board == 0) {
							resp.data.info.supplements.forEach((s) => {
								if (s.name == "add_bed") {
									ct += s.price * c.extra_beds
								}
							})
						} else if (c.extra_beds && resp.data.info.board == 1) {
							resp.data.info.supplements.forEach((s) => {
								if (s.name == "half_board_add") {
									ct += s.price * c.extra_beds
								}
							})
						} else if (c.extra_beds && resp.data.info.board == 2) {
							resp.data.info.supplements.forEach((s) => {
								if (s.name == "full_board_add") {
									ct += s.price * c.extra_beds
								}
							})
						}

						if (c.sea_view) {
							resp.data.info.supplements.forEach((s) => {
								if (s.name == "sea_view") {
									ct += s.price
								}
							})
						}
						if (c.wedding_decoration) {
							resp.data.info.supplements.forEach((s) => {
								if (s.name == "wedding_decoration") {
									ct += s.price
								}
							})
						}
						t += ct
						chambers.push({
							name: c.name,
							extra_beds: c.extra_beds,
							baby_beds: c.baby_beds,
							sea_view: c.sea_view,
							wedding_decoration: c.wedding_decoration,
							price: ct,
						})
					})
					setTotal(t*resp.data.info.days)
				})
				.catch((err) => {
					if (err.response.status == 404) {
						navigate("/NotFound")
					}
				})
		}
	}, [isLoading])

	if (isLoading) {
		return (
			<div
				className="d-flex flex-column justify-content-center mr-5"
				style={{ height: "100vh", width: "90%" }}
			>
				<Preloader />
			</div>
		)
	}

	return (
		<div className="container-fluid">
			<h1 class="h3 m-5 text-gray-800">Détails de reservation : {ID}</h1>
			<div className="card shadow m-5">
				<div className="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary mx-4">
						Détails de reservation
					</h6>
				</div>
				<div className="card-body bg-white">
					<div className="container-fluid">
						<table className="table table-bordered table-hover">
							<tbody>
								<tr>
									<th>ID</th>
									<td>{ID}</td>
								</tr>
								<tr>
									<th>Status</th>
									{reservationInfo.status == "pending" ? (
										<td
											className="border border-light border-right-0"
											style={{
												backgroundColor:
													"rgba(245, 200, 100, .5)",
											}}
										>
											En attente
										</td>
									) : (
										""
									)}
									{reservationInfo.status == "approved" ? (
										<td
											className="border border-light border-right-0"
											style={{
												backgroundColor: "#00ff0050",
											}}
										>
											Confirmée
										</td>
									) : (
										""
									)}
									{reservationInfo.status == "canceled" ? (
										<td
											className="border border-light border-right-0"
											style={{
												backgroundColor: "#ff000050",
											}}
										>
											Annulée
										</td>
									) : (
										""
									)}
								</tr>
								<tr>
									<th>Nom complet</th>
									<td>{reservationInfo.name}</td>
								</tr>
								<tr>
									<th>Numéro de téléphone</th>
									<td>{reservationInfo.phone}</td>
								</tr>
								<tr>
									<th>Email</th>
									<td>
										{reservationInfo.email
											? reservationInfo.email
											: "-"}
									</td>
								</tr>
								<tr>
									<th>Pension</th>
									<td>
										{reservationInfo.board == 0
											? "Petit-déjeuner uniquement"
											: ""}
										{reservationInfo.board == 1
											? "Demi-pension"
											: ""}
										{reservationInfo.board == 2
											? "Pension complète"
											: ""}
									</td>
								</tr>
								<tr>
									<th>Date d'entrée</th>
									<td>
										{
											formatDate(
												reservationInfo.from
											).split(".")[0]
										}
									</td>
								</tr>
								<tr>
									<th>Date de sortie</th>
									<td>
										{
											formatDate(
												reservationInfo.to
											).split(".")[0]
										}
									</td>
								</tr>
								<tr>
									<th>Durée</th>
									<td>{days} Jour(s)</td>
								</tr>
								<tr>
									<th>Date de création</th>
									<td>
										{formatDate(
											reservationInfo.created
										).replace(".", "")}
									</td>
								</tr>
								<tr>
									<th>Total (En DA)</th>
									<td><NumericFormat suffix=".00 DA" thousandSeparator={true} value={total} displayType="text" /></td>
								</tr>
							</tbody>
						</table>
						{reservationInfo.status == "pending" ? (
							<div className="row">
								<div className="col">
									<button
										className="btn btn-success mr-2"
										onClick={(e) => {
                                            e.preventDefault();
                                            e.target.disabled = true;
											if (
												window.confirm(
													"Voulez-vous vraiment confirmer la réservation ?"
												)
											) {
												axios
													.patch("/api/reservation", {
														id: reservationInfo.ID,
														feature: "status",
														load: "confirm",
													})
													.then((resp) => {
                                                        if (resp.data.status == "success") {
                                                            alert('Réservation Confirmée!');
                                                            setIsLoading(true);
                                                        }
                                                        e.target.disabled = false
                                                    }).catch(() => {
                                                        alert("une erreur s'est produite!")
                                                        e.target.disabled = false
                                                    })
											}
										}}
									>
										Confirmer
									</button>
									<button className="btn btn-danger" onClick={(e) => {
                                            e.preventDefault();
                                            e.target.disabled = true;
											if (
												window.confirm(
													"Voulez-vous vraiment annuler la réservation?"
												)
											) {
												axios
													.patch("/api/reservation", {
														id: reservationInfo.ID,
														feature: "status",
														load: "cancel",
													})
													.then((resp) => {
                                                        if (resp.data.status == "success") {
                                                            alert('Réservation annulée!');
                                                            setIsLoading(true);
                                                        }
                                                        e.target.disabled = false
                                                    }).catch(() => {
                                                        alert("Une erreur s'est produite!")
                                                        e.target.disabled = false
                                                    })
											}
										}}>
										Annuler
									</button>
								</div>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
			<div className="card shadow m-5">
				<div className="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary mx-4">
						Chambres réservées
					</h6>
				</div>
				<div className="card-body bg-white">
					<div className="container-fluid">
						<table className="table table-bordered table-hover">
							<thead>
								<tr>
									<th>Type de chambre</th>
									<th>Lits supplementaires</th>
									<th>Lits pour bébés</th>
									<th>Vue sur la mer</th>
									<th>Décoration de mariage</th>
									<th>Prix de la chambre</th>
								</tr>
							</thead>
							<tbody>
								{chambers.map((c) => (
									<tr>
										<td>
											{c.name == "Single"
												? "Individuelle"
												: ""}
											{c.name == "Double1"
												? "Double lit simple"
												: ""}
											{c.name == "Double2"
												? "Double lit double"
												: ""}
											{c.name == "Triple" ? "Triple" : ""}
											{c.name == "Quadruple"
												? "Quadruple"
												: ""}
										</td>
										<td>{c.extra_beds}</td>
										<td>{c.baby_beds}</td>
										<td>{c.sea_view ? "Oui" : "Non"}</td>
										<td>
											{c.wedding_decoration
												? "Oui"
												: "Non"}
										</td>
										<td><NumericFormat suffix=".00 DA" thousandSeparator={true} value={c.price} displayType="text" /></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}
