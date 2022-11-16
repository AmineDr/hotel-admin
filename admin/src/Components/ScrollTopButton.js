import { useEffect, useState } from "react"

export default function ScrollTopButton() {
    const [yPosition, setYPosition] = useState(window.scrollY);

    useEffect(() => {
        if (yPosition != window.scrollY) {
            setYPosition(window.scrollY)
        }
    }, [yPosition])
    if (yPosition != window.scrollY) {
        setYPosition(window.scrollY)
    }
	return (
		<a
			className="scroll-to-top rounded"
			href="#root"
			style={{ display: yPosition > 1 ? "inline" : "none" }}
		>
			<i className="fas fa-angle-up"></i>
		</a>
	)
}
