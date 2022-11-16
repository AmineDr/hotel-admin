import axios from "axios"
import { useEffect, useState } from "react"
import Preloader from "../Components/Preloader"
import sortTable from "../Hooks/SortTables"
import { formatDate } from "../Hooks/FormatDate"
import { Link } from "react-router-dom"

var pageOptionHtml = []

export default function Reservations() {
	const [isLoading, setIsLoading] = useState(true)
	const [reservations, setReservations] = useState([])
	const [sorted, setSorted] = useState(false)
	const [query, setQuery] = useState("")
	const [searching, setSearching] = useState(false)
	const [filter, setFilter] = useState("ID")
	const [page, setPage] = useState(1)
	const [count, setCount] = useState(0)
	const [status, setStatus] = useState("all")

	useEffect(() => {
		if (isLoading) {
			axios
				.get(`/api/reservation?query=search&q=${query}&by=${filter}`)
				.then((resp) => {
					setReservations(resp.data.results)
					setCount(parseInt(resp.data.count))
					setIsLoading(false)
					pageOptionHtml = []
					for (let x = 0; x < Math.ceil(resp.data.count / 20); x++) {
						pageOptionHtml.push(
							<option value={x + 1}>{x + 1}</option>
						)
					}
					if (!pageOptionHtml.length) {
						pageOptionHtml = [<option>1</option>]
					}
				})
				.catch(() => {
					setIsLoading(false)
					setReservations([])
				})
		}
		if (!isLoading && !sorted) {
			sortTable("reservationtable")
			setSorted(true)
		}

		if (searching) {
			axios
				.get(
					`/api/reservation?query=search&q=${query}&by=${filter}&page=${page}&status=${status}`
				)
				.then((resp) => {
					setReservations(resp.data.results)
					setCount(parseInt(resp.data.count))
					pageOptionHtml = []
					for (let x = 0; x < Math.ceil(resp.data.count / 20); x++) {
						pageOptionHtml.push(
							<option value={x + 1}>{x + 1}</option>
						)
					}
					setSearching(false)
				})
				.catch(() => {
					setSearching(false)
					setCount(0)
					setReservations([])
				})
		}
	}, [isLoading, sorted, searching])

	if (isLoading) {
		;<Preloader />
	}

	return (
		<>
			<h1 class="h3 m-5 text-gray-800">Reservations</h1>

			<div className="preloader-wrapper page">
				{isLoading ? (
					<Preloader />
				) : (
					<div className="card shadow m-5">
						<div className="card-header py-3">
							<h6 class="m-0 font-weight-bold text-primary mx-4">
								Tableau de Reservations
							</h6>
						</div>

						<div className="card-body bg-white">
							<div className="container-fluid">
								<div className="row">
									<div className="col-6">
										<form
											onSubmit={(e) => {
												e.preventDefault()
												setSearching(true)
											}}
										>
											<label className="form-label">
												Recherche
												<input
													className="form-control form-control-sm"
													type="search"
													onChange={(e) => {
														setQuery(e.target.value)
													}}
												/>
											</label>
											<label className="form-label w-25 ml-3">
												Par
												<select
													className="form-control form-control-sm"
													onChange={(e) => {
														setFilter(
															e.target.value
														)
													}}
												>
													<option
														value={"ID"}
														selected
													>
														ID
													</option>
													<option value={"name"}>
														Nom
													</option>
													<option value={"phone"}>
														Téléphone
													</option>
												</select>
											</label>
											<label className="form-label w-25 ml-3">
												Par status
												<select
													className="form-control form-control-sm"
													onChange={(e) => {
														setStatus(
															e.target.value
														)
													}}
												>
													<option
														value={"all"}
														selected
													>
														Tous
													</option>
													<option value={"pending"}>
														En attente
													</option>
													<option value={"approved"}>
														Confirmée
													</option>
													<option value={"canceled"}>
														Annulée
													</option>
												</select>
											</label>
											<input
												type="submit"
												className="btn btn-primary ml-3 btn-sm"
												value="Filtrer"
												onClick=""
											/>
										</form>
									</div>
									<div className="col-6 d-flex flex-row-reverse"></div>
								</div>
								<table
									className="table table-bordered table-hover"
									id="reservationtable"
									style={{
										boxShadow: "",
										backgroundColor: "white",
									}}
								>
									<thead>
										<th>
											<div className="d-flex justify-content-between">
												<span className="my-auto">
													ID
												</span>
												<div>
													<i className="fa fa-arrow-up my-auto"></i>
													<i className="fa fa-arrow-down my-auto"></i>
												</div>
											</div>
										</th>
										<th>
											<div className="d-flex justify-content-between">
												<span className="my-auto">
													Nom du client
												</span>
												<div>
													<i className="fa fa-arrow-up my-auto"></i>
													<i className="fa fa-arrow-down my-auto"></i>
												</div>
											</div>
										</th>
										<th>
											<div className="d-flex justify-content-between">
												<span className="my-auto">
													Telephone
												</span>
												<div>
													<i className="fa fa-arrow-up my-auto"></i>
													<i className="fa fa-arrow-down my-auto"></i>
												</div>
											</div>
										</th>
										<th>
											<div className="d-flex justify-content-between">
												<span className="my-auto">
													Du
												</span>
												<div>
													<i className="fa fa-arrow-up my-auto"></i>
													<i className="fa fa-arrow-down my-auto"></i>
												</div>
											</div>
										</th>
										<th>
											<div className="d-flex justify-content-between">
												<span className="my-auto">
													A
												</span>
												<div>
													<i className="fa fa-arrow-up my-auto"></i>
													<i className="fa fa-arrow-down my-auto"></i>
												</div>
											</div>
										</th>
										<th>
											<div className="d-flex justify-content-between">
												<span className="my-auto">
													Status
												</span>
												<div>
													<i className="fa fa-arrow-up my-auto"></i>
													<i className="fa fa-arrow-down my-auto"></i>
												</div>
											</div>
										</th>
										<th>
											<div className="d-flex justify-content-between">
												<span className="my-auto">
													Date crée
												</span>
												<div>
													<i className="fa fa-arrow-up my-auto"></i>
													<i className="fa fa-arrow-down my-auto"></i>
												</div>
											</div>
										</th>
										<th>
											<span>Détails</span>
										</th>
									</thead>
									<tbody>
										{searching ? (
											<tr>
												<td colSpan={8}>
													<div className="d-flex justify-content-center">
														<Preloader />
													</div>
												</td>
											</tr>
										) : (
											reservations.map((r) => (
												<tr className="item">
													<td>{r.ID}</td>
													<td>{r.name}</td>
													<td>{r.phone}</td>
													<td>
														{
															formatDate(
																r.from
															).split(".")[0]
														}
													</td>
													<td>
														{
															formatDate(
																r.to
															).split(".")[0]
														}
													</td>
													{r.status == "pending" ? (
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
													{r.status == "approved" ? (
														<td
															className="border border-light border-right-0"
															style={{
																backgroundColor:
																	"#00ff0050",
															}}
														>
															Confirmée
														</td>
													) : (
														""
													)}
													{r.status == "canceled" ? (
														<td
															className="border border-light border-right-0"
															style={{
																backgroundColor:
																	"#ff000050",
															}}
														>
															Annulée
														</td>
													) : (
														""
													)}
													<td>
														{formatDate(
															r.created
														).replace(".", "")}
													</td>
													<td className="text-center text-primary">
														<Link
															to={`/reservation/${r.ID}`}
														>
															<i class="fas fa-external-link-alt"></i>
														</Link>
													</td>
												</tr>
											))
										)}
										{!searching &&
										!reservations.length &&
										!isLoading ? (
											<tr>
												<td colSpan={8}>
													Aucun resultat
												</td>
											</tr>
										) : (
											""
										)}
									</tbody>
								</table>
								<div class="row">
									<div class="col-sm-12 col-md-5">
										<div
											class="dataTables_info"
											id="dataTable_info"
											role="status"
											aria-live="polite"
										>
											Affichage de{" "}
											{reservations.length} sur {count}{" "}
											entrées
										</div>
									</div>
									<div class="col-sm-12 col-md-7">
										<div
											class="dataTables_paginate paging_simple_numbers"
											id="dataTable_paginate"
										>
											<div className="d-flex flex-row-reverse gap-3">
												<button
													className="btn btn-primary mr-1"
													disabled={
														page >=
														pageOptionHtml.length
															? true
															: false
													}
													onClick={() => {
														setPage(page + 1)
														setSearching(true)
														document.getElementById(
															"page-select"
														).value = page + 1
													}}
												>
													Next
												</button>
												<select
													className="form-control w-25 mr-1"
													id="page-select"
													onChange={(e) => {
														setPage(e.target.value)
														setSearching(true)
													}}
												>
													{pageOptionHtml}
												</select>
												<button
													className="btn btn-primary mr-1"
													disabled={
														page == 1 ? true : false
													}
													onClick={() => {
														setPage(page - 1)
														setSearching(true)
														document.getElementById(
															"page-select"
														).value = page - 1
													}}
												>
													Previous
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="card-footer text-center pt-2">
				<span className="">Aria Sky Admin</span>
			</div>
		</>
	)
}
