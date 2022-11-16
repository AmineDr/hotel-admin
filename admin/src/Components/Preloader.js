import { Bars } from "react-loader-spinner"

export default function Preloader() {
	return (
		<>
			{window.location.href.replace(window.location.origin, "") !==
			"/login" ? (
				<div className="d-flex justify-content-center align-items-center h-100">
					<Bars
						color="#4e73df"
						width="100"
						visible={true}
						ariaLabel="bars-loading"
					/>
				</div>
			) : (
				<div className="preloader-wrapper">
					<div className="d-flex justify-content-center align-items-center h-100">
						<Bars
							color="#4e73df"
							width="100"
							visible={true}
							ariaLabel="bars-loading"
						/>
					</div>
				</div>
			)}
		</>
	)
}
