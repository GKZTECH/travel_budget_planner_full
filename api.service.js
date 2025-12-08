export async function fetchData() {
const url = 'https://raw.githubusercontent.com/GKZTECH/travel_budget_planner_full/refs/heads/main/data/destinations.json'
const response = await fetch(url)
const json = await response.json()
return json
}