export function estimateTrip({ destination, nights, people, meals, attractions, displayCurrency, rates }) {
  const hotelBase = destination.avgHotelPerNight
  const mealBase = destination.avgMealPerPerson
  const attractionBase = destination.avgAttractionPerPerson

  const hotel = hotelBase * nights
  const mealsTotal = mealBase * meals * people * nights
  const attractionsTotal = attractionBase * attractions * people * nights
  const subtotal = hotel + mealsTotal + attractionsTotal
  const buffer = Math.round(subtotal * 0.12)
  const totalLocal = subtotal + buffer

  const destRate = rates[destination.currency] || 1
  const displayRate = rates[displayCurrency] || 1

  const inUsd = totalLocal * destRate
  const converted = Math.round((inUsd / displayRate) * 100) / 100

  function format(value){
    return Number(value).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})
  }

  return {
    destination,
    nights,
    people,
    hotel,
    meals: mealsTotal,
    attractions: attractionsTotal,
    subtotal,
    buffer,
    total: converted,
    displayCurrency,
    format
  }
}
