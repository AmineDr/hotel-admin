import axios from "axios"
import { useContext, useEffect, useState } from "react"
import Preloader from "../Components/Preloader"
import { SessionContext } from "../Hooks/SessionContext"

export default function Tarifs() {
	const [isLoading, setIsLoading] = useState(true)
	const [chambers, setChambers] = useState([])
	const [supplements, setSupplements] = useState([])
	const {perms} = useContext(SessionContext);

	useEffect(() => {
		if (isLoading) {
			axios.get("/api/chamber?query=all").then((resp) => {
				setChambers(resp.data.results)
				setIsLoading(false)
			})
			axios.get("/api/supplement?query=all").then((resp) => {
				setSupplements(resp.data.results)
			})
		}
	}, [isLoading])

	return (
		<>
			<h1 class="h3 m-5 text-gray-800">Tarifs</h1>

			<div className="preloader-wrapper page">
				{isLoading ? (
					<Preloader />
				) : (
					<>
						<div className="card shadow m-5">
							<div className="card-header py-3">
								<h6 class="m-0 font-weight-bold text-primary mx-4">
									Chambres
								</h6>
							</div>

							<div className="card-body bg-white">
								<div className="container-fluid">
									<div className="d-flex justify-content-between">
										<h2 className="mb-3">Chambres</h2>
										<a
											className="mb-3"
											href="#supplement-table"
										>
											Aller aux suppléments
										</a>
									</div>
									{chambers.map((chamber) => (
										<table className="table table-bordered mb-5">
											<h4 className="m-3">
												{chamber.name == "Single"
													? "Individuelle"
													: ""}
												{chamber.name == "Double1"
													? "Double lit simple"
													: ""}
												{chamber.name == "Double2"
													? "Double lit double"
													: ""}
												{chamber.name == "Triple"
													? "Triple"
													: ""}
												{chamber.name == "Quadruple"
													? "Quadruple"
													: ""}
											</h4>
											<tbody>
												<tr>
													<th>
														Prix petit-déjeuner
														uniquement
													</th>
													<td colSpan={perms > 0 ? 1 : 2}>{chamber.price} DA</td>
													{perms > 0 ? <td className="p-0 d-flex align-items-center">
														<div class="input-group">
															<input
																className="form-control form-control-lg"
																type="number"
																id={`input-b-${chamber.ID}`}
															/>
															<div class="input-group-append">
																<button
																	class="btn btn-outline-primary btn-lg btn-custom"
																	type="button"
																	onClick={(
																		e
																	) => {
																		e.preventDefault()
																		let load =
																			document.getElementById(
																				`input-b-${chamber.ID}`
																			).value
																		if (
																			load &&
																			window.confirm(
																				"Êtes-vous sûr de vouloir modifier le prix?"
																			)
																		) {
																			e.target.disabled = true

																			axios
																				.patch(
																					"/api/chamber",
																					{
																						id: chamber.ID,
																						feature:
																							"price_b",
																						load: load,
																					}
																				)
																				.then(
																					(
																						resp
																					) => {
																						if (
																							resp
																								.data
																								.status ==
																							"success"
																						) {
																							setIsLoading(
																								true
																							)
																							alert(
																								"Le prix a changé!"
																							)
																							e.target.disabled = false
																						}
																					}
																				)
																				.catch(
																					() => {
																						alert(
																							"Une erreur s'est produite!"
																						)
																						e.target.disabled = false
																					}
																				)
																		}
																	}}
																>
																	Modifier
																</button>
															</div>
														</div>
													</td> : ''}
												</tr>
												<tr>
													<th>Prix demi-pension</th>
													<td colSpan={perms > 0 ? 1 : 2}>
														{
															chamber.price_half_board
														}{" "}
														DA
													</td>
													{perms > 0 ? <td className="p-0 d-flex align-items-center">
														<div class="input-group">
															<input
																className="form-control form-control-lg"
																id={`input-dp-${chamber.ID}`}
																type="number"
															/>
															<div class="input-group-append">
																<button
																	class="btn btn-outline-primary btn-lg btn-custom"
																	type="button"
																	onClick={(
																		e
																	) => {
																		e.preventDefault()
																		let load =
																			document.getElementById(
																				`input-dp-${chamber.ID}`
																			).value
																		if (
																			load &&
																			window.confirm(
																				"Êtes-vous sûr de vouloir modifier le prix?"
																			)
																		) {
																			e.target.disabled = true

																			axios
																				.patch(
																					"/api/chamber",
																					{
																						id: chamber.ID,
																						feature:
																							"price_dp",
																						load: load,
																					}
																				)
																				.then(
																					(
																						resp
																					) => {
																						if (
																							resp
																								.data
																								.status ==
																							"success"
																						) {
																							setIsLoading(
																								true
																							)
																							alert(
																								"Le prix a changé!"
																							)
																							e.target.disabled = false
																						}
																					}
																				)
																				.catch(
																					() => {
																						alert(
																							"Une erreur s'est produite!"
																						)
																						e.target.disabled = false
																					}
																				)
																		}
																	}}
																>
																	Modifier
																</button>
															</div>
														</div>
													</td> : ''}
												</tr>
												<tr>
													<th>
														Prix pension complète
													</th>
													<td colSpan={perms > 0 ? 1 : 2}>
														{
															chamber.price_full_board
														}{" "}
														DA
													</td>
													{perms > 0 ? <td className="p-0 d-flex align-items-center">
														<div class="input-group">
															<input
																className="form-control form-control-lg"
																type="number"
																id={`input-pc-${chamber.ID}`}
															/>
															<div class="input-group-append">
																<button
																	class="btn btn-outline-primary btn-lg btn-custom"
																	type="button"
																	onClick={(
																		e
																	) => {
																		e.preventDefault()
																		let load =
																			document.getElementById(
																				`input-pc-${chamber.ID}`
																			).value
																		if (
																			load &&
																			window.confirm(
																				"Êtes-vous sûr de vouloir modifier le prix?"
																			)
																		) {
																			e.target.disabled = true
																			axios
																				.patch(
																					"/api/chamber",
																					{
																						id: chamber.ID,
																						feature:
																							"price_pc",
																						load: load,
																					}
																				)
																				.then(
																					(
																						resp
																					) => {
																						if (
																							resp
																								.data
																								.status ==
																							"success"
																						) {
																							setIsLoading(
																								true
																							)
																							alert(
																								"Le prix a changé!"
																							)
																							e.target.disabled = false
																						}
																					}
																				)
																				.catch(
																					() => {
																						alert(
																							"Une erreur s'est produite!"
																						)
																						e.target.disabled = false
																					}
																				)
																		}
																	}}
																>
																	Modifier
																</button>
															</div>
														</div>
													</td> : ''}
												</tr>
												<tr>
													<th>Maximum de lits</th>
													<td className={perms < 0 ? '' : "w-50"}>{chamber.max_beds}</td>
													<td className="p-0 d-flex align-items-center">
														<div class={perms < 0 ? "input-group d-flex flex-row-reverse" : "input-group"}>
															<input
																className="form-control form-control-lg"
																style={{maxWidth: perms > 0 ? '' : "200px"}}
																type="number"
																id={`input-beds-${chamber.ID}`}
															/>
															<div class="input-group-append">
																<button
																	class="btn btn-outline-primary btn-lg btn-custom w-100"
																	type="button"
																	onClick={(
																		e
																	) => {
																		e.preventDefault()
																		let load =
																			document.getElementById(
																				`input-beds-${chamber.ID}`
																			).value
																		if (
																			load &&
																			window.confirm(
																				"Êtes-vous sûr de vouloir modifier le maximum de lits?"
																			)
																		) {
																			e.target.disabled = true
																			axios
																				.patch(
																					"/api/chamber",
																					{
																						id: chamber.ID,
																						feature:
																							"max_beds",
																						load: load,
																					}
																				)
																				.then(
																					(
																						resp
																					) => {
																						if (
																							resp
																								.data
																								.status ==
																							"success"
																						) {
																							setIsLoading(
																								true
																							)
																							alert(
																								"Le max de lits a changé!"
																							)
																							e.target.disabled = false
																						}
																					}
																				)
																				.catch(
																					() => {
																						alert(
																							"Une erreur s'est produite!"
																						)
																						e.target.disabled = false
																					}
																				)
																		}
																	}}
																>
																	Modifier
																</button>
															</div>
														</div>
													</td>
												</tr>
												<tr>
													<th>Disponibilité</th>
													<td colSpan={2}>
														{chamber.availability
															? "Oui"
															: "Non"}
													</td>
												</tr>
											</tbody>
											{!chamber.availability ? (
												<button
													className="btn btn-success"
													onClick={(e) => {
														e.preventDefault()
														e.target.disabled = true
														axios
															.patch(
																"/api/chamber",
																{
																	id: chamber.ID,
																	feature:
																		"availability",
																	load: true,
																}
															)
															.then((resp) => {
																if (
																	resp.data
																		.status ==
																	"success"
																) {
																	setIsLoading(
																		true
																	)
																	alert(
																		"Marqué comme disponible!"
																	)
																	e.target.disabled = false
																}
															})
															.catch(() => {
																e.target.disabled = false
																alert(
																	"Une erreur s'est produite!"
																)
															})
													}}
												>
													Marquer comme disponible
												</button>
											) : (
												<button
													className="btn btn-danger"
													onClick={(e) => {
														e.preventDefault()
														e.target.disabled = true
														axios
															.patch(
																"/api/chamber",
																{
																	id: chamber.ID,
																	feature:
																		"availability",
																	load: "0",
																}
															)
															.then((resp) => {
																if (
																	resp.data
																		.status ==
																	"success"
																) {
																	setIsLoading(
																		true
																	)
																	alert(
																		"Marqué comme indisponible!"
																	)
																	e.target.disabled = false
																}
															})
															.catch(() => {
																e.target.disabled = false
																alert(
																	"Une erreur s'est produite!"
																)
															})
													}}
												>
													Marquer comme indisponible
												</button>
											)}
										</table>
									))}
								</div>
							</div>
						</div>
						<div className="card shadow m-5">
						<div className="card-header py-3">
								<h6 class="m-0 font-weight-bold text-primary mx-4">
									Supplements
								</h6>
							</div>
						<div className="card-body bg-white">
							<div className="container-fluid">
								<table
									className="table table-bordered"
									id="supplement-table"
								>
									<tbody>
										{supplements.map((sup) => (
											<tr>
												<th>
													{sup.name == "add_bed"
														? "Lit supplementaire"
														: ""}
													{sup.name == "sea_view"
														? "Vue sur mer"
														: ""}
													{sup.name ==
													"half_board_add"
														? "Lit supplementaire demi-pension"
														: ""}
													{sup.name ==
													"full_board_add"
														? "Lit supplementaire pension complète"
														: ""}
													{sup.name ==
													"wedding_decoration"
														? "Décoration Chambre Nuit de noce "
														: ""}
												</th>
												<td>{sup.price} DA</td>
												{perms > 0 ? <td className="p-0">
													<div class="input-group">
														<input
															type="number"
															class="form-control form-control-lg"
															id={`input-sup-${sup.ID}`}
														/>
														<div class="input-group-append">
															<button
																class="btn btn-outline-primary btn-custom"
																type="button"
																onClick={(
																	e
																) => {
																	e.preventDefault()
																	e.target.disabled = true
																	let load =
																		document.getElementById(
																			`input-sup-${sup.ID}`
																		).value
																	if (
																		load &&
																		window.confirm(
																			"Êtes-vous sûr de vouloir modifier le prix du supplement?"
																		)
																	) {
																		axios
																			.patch(
																				"/api/supplement",
																				{
																					ID: sup.ID,
																					feature:
																						"price",
																					load: load,
																				}
																			)
																			.then(
																				(
																					resp
																				) => {
																					if (
																						resp
																							.data
																							.status ==
																						"success"
																					) {
																						alert(
																							"Le prix a changé!"
																						)
																						setIsLoading(
																							true
																						)
																					}
																					e.target.disabled = false
																					console.log(
																						resp.data
																					)
																				}
																			)
																			.catch(
																				(
																					err
																				) => {
																					console.log(
																						err
																					)
																					e.target.disabled = false
																					alert(
																						"Une erreur s'est produite!"
																					)
																				}
																			)
																	}
																}}
															>
																Modifier
															</button>
														</div>
													</div>
												</td> : ''}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						</div>
						<div className="card">
							<div className="card-footer text-center pt-2">
								<span>
									Aria Sky Admin
								</span>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	)
}
