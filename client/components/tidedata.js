const fetch = require("node-fetch");
const fs = require("fs/promises");

const API_KEY = "446d183e64e64e8eb4bca1407ab02a89";
const INCOIS_BASE_URL = "https://gemini.incois.gov.in/incoisapi/rest/";
const JSON_FILE = "stations-new.json";

const regions = {
  Gujarat: [
    "Okha",
    "Porbandar",
    "Dwarka-Rupen-Bandar",
    "Kandla-Harbour",
    "Hansthal-Point",
    "Koteshwar",
    "Lakhpat",
    "Mandvi",
    "Jafarabad",
    "Suvali",
    "Dahej-Bandar",
    "Bulsar",
    "Dahanu",
  ],
  Maharashtra: [
    "Kelve-Mahim",
    "Janjira-Dangri-Bandar",
    "Ratnagiri",
    "Devgarh",
    "Jaigarh",
    "Dabhol",
    "Boria-Bay",
    "Malvan",
    "Dahanu",
  ],
  Goa: ["Marmagao", "Betul"],
  Karnataka: ["Karwar", "Kumta", "Coondapore-Ganguli", "Malpe", "Mangalore"],
  Kerala: [
    "Kasargod",
    "Cannanore",
    "Azhikal",
    "Calicut",
    "Beypore",
    "Ponnani",
    "Kochi",
    "Alleppey",
    "Quilon",
    "Trivandrum",
  ],
  "Tamil Nadu": [
    "Kolachal",
    "Kulasekarapatnam",
    "Tuticorin",
    "Pamban-Pass",
    "Nagapatnam",
    "Cuddalore",
    "Pondichery",
    "Chennai",
  ],
  "Andhra Pradesh": [
    "Surya-Lanka",
    "Kakinada",
    "Vishakapatnam",
    "Bhimunipatnam",
    "Kalingapatnam",
  ],
  Odisha: [
    "Gopalpur",
    "Chilka-Mouth",
    "Kushbhadra-River",
    "Devi-River-Entrance",
    "Paradip",
    "False-Point",
    "Chandbali",
    "Dhamra",
  ],
  "West Bengal": ["Diamond-Harbour", "Calcutta-Kidderpore-docks"],
  Lakshadweep: ["Kavaratti-Laccadive"],
  "Andaman and Nicobar": [
    "Car-Nicobar",
    "Cinque-Island",
    "Cleugh-Passage",
    "Dring-Harbour",
    "Expedition-Harbour",
    "Hoare-Bay",
    "Jalebar",
    "Long-Island",
    "Boat-Island",
  ],
};

async function fetchData(url) {
  const response = await fetch(url, {
    headers: { Authorization: API_KEY },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  return {
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

async function fetchStationTideData(station, date) {
  try {
    const [regularData, highLowData] = await Promise.all([
      fetchData(`${INCOIS_BASE_URL}tidal/${station}?date=${date}`),
      fetchData(`${INCOIS_BASE_URL}high-low/${station}?date=${date}`),
    ]);

    if (!regularData?.data || !Array.isArray(regularData.data)) {
      throw new Error("Unexpected data structure in regular tide API response");
    }

    if (!highLowData?.predictions || !Array.isArray(highLowData.predictions)) {
      throw new Error(
        "Unexpected data structure in high-low tide API response"
      );
    }

    const dayHighLowTides = filterDayTides(highLowData.predictions, date);
    const highTides = dayHighLowTides.filter((tide) => tide.type === "H");
    const lowTides = dayHighLowTides.filter((tide) => tide.type === "L");

    const tideData = {
      date: date,
      tides: {
        firstHigh: highTides[0]
          ? {
              time: formatDateTime(highTides[0].t).time,
              height: parseFloat(highTides[0].v).toFixed(2),
            }
          : null,
        firstLow: lowTides[0]
          ? {
              time: formatDateTime(lowTides[0].t).time,
              height: parseFloat(lowTides[0].v).toFixed(2),
            }
          : null,
        secondHigh: highTides[1]
          ? {
              time: formatDateTime(highTides[1].t).time,
              height: parseFloat(highTides[1].v).toFixed(2),
            }
          : null,
        secondLow: lowTides[1]
          ? {
              time: formatDateTime(lowTides[1].t).time,
              height: parseFloat(lowTides[1].v).toFixed(2),
            }
          : null,
      },
    };

    // Add hourly tide data only for today
    if (date === new Date().toISOString().split("T")[0]) {
      const todayRegularTides = filterDayTides(regularData.data, date);
      tideData.hourlyTides = interpolateTideData(todayRegularTides);
    }

    return tideData;
  } catch (error) {
    console.error(
      `Error fetching data for ${station} on ${date}: ${error.message}`
    );
    return null;
  }
}

function filterDayTides(predictions, date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  return predictions.filter((tide) => {
    const tideTime = new Date(tide.t);
    return tideTime >= dayStart && tideTime < dayEnd;
  });
}

function interpolateTideData(tides) {
  const interpolatedTides = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let hour = 0; hour < 24; hour++) {
    const currentTime = new Date(today);
    currentTime.setHours(hour);

    let beforeTide = tides[0];
    let afterTide = tides[tides.length - 1];

    for (let i = 0; i < tides.length - 1; i++) {
      if (
        new Date(tides[i].t) <= currentTime &&
        new Date(tides[i + 1].t) > currentTime
      ) {
        beforeTide = tides[i];
        afterTide = tides[i + 1];
        break;
      }
    }

    const beforeTime = new Date(beforeTide.t);
    const afterTime = new Date(afterTide.t);
    const timeDiff = afterTime - beforeTime;
    const currentDiff = currentTime - beforeTime;
    const ratio = currentDiff / timeDiff;

    const interpolatedHeight =
      parseFloat(beforeTide.v) +
      (parseFloat(afterTide.v) - parseFloat(beforeTide.v)) * ratio;

    interpolatedTides.push({
      t: currentTime.toISOString(),
      v: interpolatedHeight.toFixed(2),
    });
  }

  return interpolatedTides;
}

function calculateEnergyPerCycle(tidalRange) {
  const rho = 1025; // kg/m³ (seawater density)
  const g = 9.81; // m/s² (gravitational acceleration)
  const A = 1; // m² (we're calculating per square meter)

  // E_cycle = (1/2) * ρ * g * A * h_cycle^2
  return 0.5 * rho * g * A * Math.pow(tidalRange, 2); // Joules per m²
}

function calculateDailyEnergy(tideData) {
  const cycles = [
    { high: tideData.tides.firstHigh, low: tideData.tides.firstLow },
    { high: tideData.tides.secondHigh, low: tideData.tides.secondLow },
  ].filter((cycle) => cycle.high && cycle.low);

  if (cycles.length === 0) {
    console.warn(`No complete tidal cycles for ${tideData.date}`);
    return 0;
  }

  return cycles.reduce((totalEnergy, cycle) => {
    const cycleRange = Math.abs(
      parseFloat(cycle.high.height) - parseFloat(cycle.low.height)
    );
    return totalEnergy + calculateEnergyPerCycle(cycleRange);
  }, 0);
}

function calculatePower(dailyEnergy) {
  const secondsPerDay = 86400;
  return dailyEnergy > 0 ? dailyEnergy / secondsPerDay : 0; // Watts per m²
}

async function generateJSON(days = 8) {
  let stationData = [];
  const today = new Date();

  for (const [region, stations] of Object.entries(regions)) {
    for (const station of stations) {
      let stationEntry = {
        "Power Rank": 0,
        Region: region,
        Station: station,
        "Today's Power (W/m²)": 0,
        DailyData: [],
      };

      for (let i = -2; i < days; i++) {
        // Start from yesterday (-1)
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split("T")[0];

        const tideData = await fetchStationTideData(station, dateString);

        if (tideData && tideData.tides.firstHigh && tideData.tides.firstLow) {
          const dailyEnergy = calculateDailyEnergy(tideData);
          const power = calculatePower(dailyEnergy);

          const dailyEntry = {
            Date: tideData.date,
            "First High Tide Time": tideData.tides.firstHigh
              ? tideData.tides.firstHigh.time
              : "N/A",
            "First High Tide Height": tideData.tides.firstHigh
              ? parseFloat(tideData.tides.firstHigh.height)
              : "N/A",
            "First Low Tide Time": tideData.tides.firstLow
              ? tideData.tides.firstLow.time
              : "N/A",
            "First Low Tide Height": tideData.tides.firstLow
              ? parseFloat(tideData.tides.firstLow.height)
              : "N/A",
            "Second High Tide Time": tideData.tides.secondHigh
              ? tideData.tides.secondHigh.time
              : "N/A",
            "Second High Tide Height": tideData.tides.secondHigh
              ? parseFloat(tideData.tides.secondHigh.height)
              : "N/A",
            "Second Low Tide Time": tideData.tides.secondLow
              ? tideData.tides.secondLow.time
              : "N/A",
            "Second Low Tide Height": tideData.tides.secondLow
              ? parseFloat(tideData.tides.secondLow.height)
              : "N/A",
            "Daily Energy (J/m²)": parseFloat(dailyEnergy.toFixed(2)),
            "Power (W/m²)": parseFloat(power.toFixed(3)),
          };

          if (i === 0) {
            stationEntry["Today's Power (W/m²)"] =
              power > 0 ? parseFloat(power.toFixed(3)) : 0;
            // Add hourly tide data for today
            if (tideData.hourlyTides) {
              tideData.hourlyTides.forEach((tide, index) => {
                dailyEntry[`${index}:00`] = parseFloat(tide.v);
              });
            }
          }

          stationEntry.DailyData.push(dailyEntry);
        } else {
          console.log(`No data available for ${station} on ${dateString}`);
        }
      }

      if (stationEntry.DailyData.length > 0) {
        stationData.push(stationEntry);
      }
    }
  }

  // Sort stations by today's power in descending order and add power rank
  stationData.sort(
    (a, b) => b["Today's Power (W/m²)"] - a["Today's Power (W/m²)"]
  );
  stationData.forEach((station, index) => {
    station["Power Rank"] = index + 1;
  });

  return JSON.stringify(stationData, null, 2);
}

async function saveJSONToFile(jsonData) {
  try {
    await fs.writeFile(JSON_FILE, jsonData);
    console.log(`Data has been successfully written to ${JSON_FILE}`);
  } catch (error) {
    console.error(`Error saving JSON file: ${error.message}`);
  }
}

// Run the update
console.log(
  "Starting multi-day tide data collection, energy calculation, and ranking..."
);
generateJSON(7) // Fetch data for 7 days
  .then((jsonData) => {
    return saveJSONToFile(jsonData);
  })
  .then(() => {
    console.log("Process completed.");
  })
  .catch((error) => {
    console.error("Error in main process:", error);
  });
