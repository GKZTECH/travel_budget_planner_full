import { fetchData } from './api.service.js'
import { estimateTrip } from './budget.engine.js'

const DEST_SELECT = document.getElementById('destination')
const CONTINENT_SELECT = document.getElementById('continent')
const BUDGET_INPUT = document.getElementById('budget')
const SEARCH_INPUT = document.getElementById('search')
const NIGHTS = document.getElementById('nights')
const PEOPLE = document.getElementById('people')
const MEALS = document.getElementById('mealsPerDay')
const ATTRACTIONS = document.getElementById('attractionsPerDay')
const CURRENCY = document.getElementById('currency')
const EST_BTN = document.getElementById('estimateBtn')
const RESULTS = document.getElementById('results')
const BREAKDOWN = document.getElementById('breakdown')
const TOTAL_EL = document.getElementById('total')

let appData = null
let filtered = []

async function init(){
  try{
    appData = await fetchData('/api/data')
    populateContinents()
    populateCurrencies()
    filtered = appData.destinations.slice()
    renderDestinations(filtered)
  } catch(e){
    console.error(e)
    alert('Failed to load data')
  }
}

function populateContinents(){
  const set = new Set(appData.destinations.map(d=>d.continent))
  set.forEach(c=>{
    const opt = document.createElement('option'); opt.value=c; opt.textContent=c; CONTINENT_SELECT.appendChild(opt)
  })
}

function populateCurrencies(){
  Object.keys(appData.currencies).forEach(code=>{
    const opt = document.createElement('option'); opt.value=code; opt.textContent=code; CURRENCY.appendChild(opt)
  })
  CURRENCY.value = 'USD'
}

function renderDestinations(list){
  DEST_SELECT.innerHTML = ''
  list.forEach(d=>{
    const o = document.createElement('option'); o.value = d.id; o.textContent = d.name + ' (' + d.continent + ') - ' + d.currency; DEST_SELECT.appendChild(o)
  })
}

function applyFilters(){
  const continent = CONTINENT_SELECT.value
  const maxBudget = Number(BUDGET_INPUT.value) || Infinity
  const q = SEARCH_INPUT.value.trim().toLowerCase()
  filtered = appData.destinations.filter(d=>{
    const matchCont = continent === 'all' ? true : d.continent === continent
    const matchBudget = d.avgHotelPerNight <= maxBudget
    const matchQuery = q === '' ? true : (d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q))
    return matchCont && matchBudget && matchQuery
  })
  renderDestinations(filtered)
}

CONTINENT_SELECT.addEventListener('change', applyFilters)
BUDGET_INPUT.addEventListener('input', applyFilters)
SEARCH_INPUT.addEventListener('input', applyFilters)

EST_BTN.addEventListener('click', ()=>{
  const destId = DEST_SELECT.value
  const dest = appData.destinations.find(x=>x.id===destId)
  if(!dest){ alert('Select a destination'); return }
  const nights = Number(NIGHTS.value) || 1
  const people = Number(PEOPLE.value) || 1
  const meals = Number(MEALS.value) || 2
  const attractions = Number(ATTRACTIONS.value) || 0
  const displayCurrency = CURRENCY.value
  const result = estimateTrip({ destination: dest, nights, people, meals, attractions, displayCurrency, rates: appData.currencies })
  showResult(result)
})

function showResult(r){
  RESULTS.classList.remove('hidden')
  BREAKDOWN.innerHTML = `
    <p>Destination: ${r.destination.name}</p>
    <p>Hotel (${r.nights} nights): ${r.format(r.hotel)} ${r.destination.currency}</p>
    <p>Meals: ${r.format(r.meals)} ${r.destination.currency}</p>
    <p>Attractions: ${r.format(r.attractions)} ${r.destination.currency}</p>
    <p>Subtotal: ${r.format(r.subtotal)} ${r.destination.currency}</p>
    <p>Buffer & fees: ${r.format(r.buffer)} ${r.destination.currency}</p>
  `
  TOTAL_EL.textContent = `Total Estimated Cost: ${r.format(r.total)} ${r.displayCurrency}`
}

init()
