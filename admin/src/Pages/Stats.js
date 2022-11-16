import axios from "axios"
import { useEffect, useState } from "react"
import { NumericFormat } from "react-number-format"
import Preloader from "../Components/Preloader"
import {
	BarChart,
	XAxis,
	YAxis,
	Bar,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
} from "recharts"
import { getMonth } from "../Hooks/FormatDate"

function CustomTooltipGraph({ payload, label, active }) {
	if (active) {
		return (
			<div
				className="custom-tooltip text-dark p-3"
				style={{ backgroundColor: "rgba(255, 255, 255, .75)" }}
			>
				<p className="label">
					{`${label} : `}
					<NumericFormat
						displayType="text"
						thousandSeparator={true}
						suffix=".00 DA"
						value={payload[0].value}
					/>
				</p>
				<p className="intro">{}</p>
				<p className="desc">Revenue mensuel en {getMonth(label)}.</p>
			</div>
		)
	}

	return null
}

function CustomTooltipBars({ payload, label, active }) {
	if (active) {
		return (
			<div
				className="custom-tooltip text-dark p-3"
				style={{ backgroundColor: "rgba(255, 255, 255, .75)" }}
			>
				<p className="label">{`${getMonth(label)}`}</p>
				<p className="intro">{}</p>
				<p className="desc">
					Réservations Confirmées : {payload[0].value}.
				</p>
				<p className="desc">
					Réservations Annulées : {payload[1].value}.
				</p>
			</div>
		)
	}

	return null
}

export default function Stats() {
	const [isLoading, setIsLoading] = useState(true)
	const [circleDate, setCirleDate] = useState("month")
	const [circleData, setCirleData] = useState([])
	const [stats, setStats] = useState({})

	useEffect(() => {
		if (isLoading) {
			axios.get("/api/stats").then((resp) => {
				setStats(resp.data.results)
				setCirleData([
					{
						count:
							circleDate == "month"
								? resp.data.results.reservations.approved
										.count_month
								: resp.data.results.reservations.approved
										.count_year,
						name: "approved",
						color: "#1cc88a",
					},
					{
						count:
							circleDate == "month"
								? resp.data.results.reservations.pending
										.count_month
								: resp.data.results.reservations.pending
										.count_year,
						name: "pending",
						color: "#f6c23e",
					},
					{
						count:
							circleDate == "month"
								? resp.data.results.reservations.canceled
										.count_month
								: resp.data.results.reservations.canceled
										.count_year,
						name: "canceled",
						color: "#e74a3b",
					},
				])
				setIsLoading(false)
			})
		} else {
			setCirleData([
				{
					count:
						circleDate == "month"
							? stats.reservations.approved.count_month
							: stats.reservations.approved.count_year,
					name: "approved",
					color: "#1cc88a",
				},
				{
					count:
						circleDate == "month"
							? stats.reservations.pending.count_month
							: stats.reservations.pending.count_year,
					name: "pending",
					color: "#f6c23e",
				},
				{
					count:
						circleDate == "month"
							? stats.reservations.canceled.count_month
							: stats.reservations.canceled.count_year,
					name: "canceled",
					color: "#e74a3b",
				},
			])
		}
	}, [isLoading, circleDate])

	return (
		<>
			<h1 class="h3 m-5 text-gray-800">Statistiques</h1>

			<div className="preloader-wrapper page">
				{isLoading ? (
					<Preloader />
				) : (
					<>
						<div className="card shadow m-5">
							<div className="card-header py-3">
								<h6 class="m-0 font-weight-bold text-primary mx-4">
									Statistiques
								</h6>
							</div>

							<div className="card-body bg-white">
								<div className="container-fluid">
									<div class="row">
										<div class="col mb-4">
											<div class="card border-left-primary shadow h-100 py-2">
												<div class="card-body bg-white">
													<div class="row no-gutters align-items-center">
														<div class="col mr-2">
															<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
																Gains (mensuels)
															</div>
															<div class="h5 mb-0 font-weight-bold text-gray-800">
																{stats.reservations ? (
																	<NumericFormat
																		displayType="text"
																		thousandSeparator={
																			true
																		}
																		suffix=".00 DA"
																		value={
																			stats
																				.reservations
																				.approved
																				.revenue_month
																		}
																	/>
																) : (
																	""
																)}
															</div>
														</div>
														<div class="col-auto mt-3">
															<i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div class="col mb-4">
											<div class="card border-left-info shadow h-100 py-2">
												<div class="card-body bg-white">
													<div class="row no-gutters align-items-center">
														<div class="col mr-2">
															<div class="text-xs font-weight-bold text-info text-uppercase mb-1">
																Gains (annuels)
															</div>
															<div class="h5 mb-0 font-weight-bold text-gray-800">
																{stats.reservations ? (
																	<NumericFormat
																		displayType="text"
																		thousandSeparator={
																			true
																		}
																		suffix=".00 DA"
																		value={
																			stats
																				.reservations
																				.approved
																				.revenue_year
																		}
																	/>
																) : (
																	""
																)}
															</div>
														</div>
														<div class="col-auto mt-3">
															<i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div class="col mb-4">
											<div class="card border-left-success shadow h-100 py-2">
												<div class="card-body bg-white">
													<div class="row no-gutters align-items-center">
														<div class="col mr-2">
															<div class="text-xs font-weight-bold text-success text-uppercase mb-1">
																Reservations
																Confirmées{" "}
																<br />
																(Ce mois)
															</div>
															<div class="row no-gutters align-items-center">
																<div class="col-auto">
																	<div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
																		{stats.reservations
																			? stats
																					.reservations
																					.approved
																					.count_month
																			: ""}
																	</div>
																</div>
															</div>
														</div>
														<div class="col-auto">
															<i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div class="col mb-4">
											<div class="card border-left-warning shadow h-100 py-2">
												<div class="card-body bg-white">
													<div class="row no-gutters align-items-center">
														<div class="col mr-2">
															<div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
																Reservations en
																attente <br />
																(Ce mois)
															</div>
															<div class="h5 mb-0 font-weight-bold text-gray-800">
																{stats.reservations
																	? stats
																			.reservations
																			.pending
																			.count_month
																	: ""}
															</div>
														</div>
														<div class="col-auto">
															<i class="fas fa-clock fa-2x text-gray-300"></i>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="col mb-4">
											<div class="card border-left-danger shadow h-100 py-2">
												<div class="card-body bg-white">
													<div class="row no-gutters align-items-center">
														<div class="col mr-2">
															<div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
																Reservations
																annulées
																<br />
																(Ce mois)
															</div>
															<div class="h5 mb-0 font-weight-bold text-gray-800">
																{stats.reservations
																	? stats
																			.reservations
																			.canceled
																			.count_month
																	: ""}
															</div>
														</div>
														<div class="col-auto">
															<i class="fa fa-window-close fa-2x text-gray-300"></i>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-xl-8 col-lg-7">
											<div class="card shadow mb-4">
												<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
													<h6 class="m-0 font-weight-bold text-primary">
														Histogramme
													</h6>
												</div>
												<div
													class="card-body d-flex justify-content-center"
													style={{
														height: "27.7rem",
													}}
												>
													<ResponsiveContainer
														width={"100%"}
														height={"100%"}
													>
														<BarChart
															width={600}
															height={300}
															data={stats.bar}
															margin={{
																top: 5,
																right: 30,
																left: 20,
																bottom: 5,
															}}
														>
															<XAxis dataKey="date" />
															<YAxis />
															<CartesianGrid strokeDasharray="3 3" />
															<Tooltip
																content={
																	<CustomTooltipBars />
																}
															/>

															<Bar
																dataKey="approved"
																barSize={20}
																fill="#1cc88a"
															/>
															<Bar
																dataKey="canceled"
																barSize={20}
																fill="#e74a3b"
															/>
														</BarChart>
													</ResponsiveContainer>
												</div>
											</div>
										</div>

										<div class="col-xl-4 col-lg-5">
											<div class="card shadow mb-4">
												<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
													<h6 class="m-0 font-weight-bold text-primary">
														Taux{" "}
														{circleDate == "month"
															? "mensuels"
															: "annuels"}
													</h6>
													<div class="dropdown no-arrow">
														<a
															class="dropdown-toggle"
															role="button"
															id="dropdownMenuLink"
															data-toggle="dropdown"
															aria-haspopup="true"
															aria-expanded="false"
															onClick={() => {
																let dd =
																	document.getElementById(
																		"dropdown-circle"
																	)
																if (
																	dd.classList
																		.length ==
																	4
																) {
																	dd.classList.add(
																		"show"
																	)
																} else {
																	dd.classList.remove(
																		"show"
																	)
																}
															}}
														>
															<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
														</a>
														<div
															class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
															aria-labelledby="dropdownMenuLink"
															id="dropdown-circle"
														>
															<a
																class="dropdown-item"
																onClick={() => {
																	if (
																		circleDate !=
																		"year"
																	) {
																		setCirleDate(
																			"year"
																		)
																	}
																}}
															>
																Annuels
															</a>
															<a
																class="dropdown-item"
																onClick={() => {
																	if (
																		circleDate !=
																		"month"
																	) {
																		setCirleDate(
																			"month"
																		)
																	}
																}}
															>
																Mensuels
															</a>
														</div>
													</div>
												</div>
												<div
													class="card-body"
													style={{
														height: "27.7rem",
													}}
												>
													<div
														class="d-flex align-items-center"
														style={{
															height: "95%",
														}}
													>
														{stats.reservations ? (
															<ResponsiveContainer height="100%">
																<PieChart>
																	<Pie
																		data={
																			circleData
																		}
																		cx="50%"
																		cy="50%"
																		labelLine={
																			false
																		}
																		label={
																			renderCustomizedLabel
																		}
																		outerRadius={
																			80
																		}
																		fill="#8884d8"
																		dataKey="count"
																	>
																		<Tooltip />
																		{circleData.map(
																			(
																				entry,
																				index
																			) => (
																				<Cell
																					key={`cell-${index}`}
																					fill={
																						entry.color
																					}
																				/>
																			)
																		)}
																	</Pie>
																</PieChart>
															</ResponsiveContainer>
														) : (
															"Loading..."
														)}
													</div>
													<div class="text-center small">
														<span class="mr-2 mb-3">
															<i class="fas fa-circle text-warning"></i>{" "}
															En attente
														</span>
														<span class="mr-2">
															<i class="fas fa-circle text-success"></i>{" "}
															Confirmée
														</span>
														<span class="mr-2">
															<i class="fas fa-circle text-danger"></i>{" "}
															Annulée
														</span>
													</div>
												</div>
											</div>
										</div>

										<div className="col-12">
											<div className="card shadow my-3">
												<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
													<h6 class="m-0 font-weight-bold text-primary">
														Graphe
													</h6>
												</div>
												<div
													className="card-body"
													style={{ height: "350px" }}
												>
													<ResponsiveContainer>
														<LineChart
															width={500}
															height={300}
															data={stats.graph}
															margin={{
																top: 5,
																right: 30,
																left: 20,
																bottom: 5,
															}}
														>
															<Tooltip
																content={
																	<CustomTooltipGraph />
																}
															/>
															<CartesianGrid strokeDasharray="3 3" />
															<XAxis dataKey="date" />
															<YAxis dataKey="price" />
															<Line dataKey="price" />
														</LineChart>
													</ResponsiveContainer>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
			<div className="card-footer pt-2 text-center">
				<span>Aria Sky Admin</span>
			</div>
		</>
	)
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	)
}
