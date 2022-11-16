export function formatDate(d) {
	let date = new Date(d)
	let day = date.getDay()
	switch (day) {
		case 0:
			day = "Dimanche"
			break
		case 1:
			day = "Lundi"
			break
		case 2:
			day = "Mardi"
			break
		case 3:
			day = "Mercredi"
			break
		case 4:
			day = "Jeudi"
			break
		case 5:
			day = "Vendredi"
			break
		case 6:
			day = "Samedi"
			break
	}
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${day} .${date.getHours()}:${date.getMinutes()}`
}

export function getDays(s, e) {
	let start = new Date(s)
	let end = new Date(e)

	return (end.getTime() - start.getTime()) / (24 * 3600 * 1000)
}

export function getWeekDay(d) {
	let day
	switch (d) {
		case 0:
			day = "Dimanche"
			break
		case 1:
			day = "Lundi"
			break
		case 2:
			day = "Mardi"
			break
		case 3:
			day = "Mercredi"
			break
		case 4:
			day = "Jeudi"
			break
		case 5:
			day = "Vendredi"
			break
		case 6:
			day = "Samedi"
			break
	}
	return day
}

export function getMonth(m) {
	let date;
	try {
		date = m.split('-')
	} catch {
		return "Error"
	}

	switch (parseInt(date[1])) {
		case 1:
			return "Janvier"+` 20${date[0]}`
		case 2:
			return "Février"+` 20${date[0]}`
		case 3:
			return "Mars"+` 20${date[0]}`
		case 4:
			return "Avril"+` 20${date[0]}`
		case 5:
			return "Mai"+` 20${date[0]}`
		case 6:
			return "Juin"+` 20${date[0]}`
		case 7:
			return "Juillet"+` 20${date[0]}`
		case 8:
			return "Aout"+` 20${date[0]}`
		case 9:
			return "Septembre"+` 20${date[0]}`
		case 10:
			return "Octobre"+` 20${date[0]}`
		case 11:
			return "Novembre"+` 20${date[0]}`
		case 12:
			return "Décembre"+` 20${date[0]}`
	}
}
