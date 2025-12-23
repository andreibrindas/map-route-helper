const startingPoint = {
  latitude: 46.1792634,
  longitude: 21.336292,
};

// Example destinations. Replace with your real data.
// Required fields: name, address, coordinates { latitude, longitude }, contact.
const destinations = [
  {
    name: "Example Household 1",
    address: "City, Street Name, building/apt details",
    coordinates: {
      latitude: 46.18,
      longitude: 21.33,
    },
    contact: "Contact name",
  },
  {
    name: "Example Household 2",
    address: "Another address description",
    coordinates: {
      latitude: 46.185,
      longitude: 21.34,
    },
    contact: "Contact name",
  },
  {
    name: "Example Household 3",
    address: "Another address description",
    coordinates: {
      latitude: 46.19,
      longitude: 21.35,
    },
    contact: "Contact name",
  },
];
const url = "https://routes.googleapis.com/directions/v2:computeRoutes";
const apiKey = process.env.API;

async function calculateRouteDistance(origin, destination) {
  const data = {
    origin: {
      location: {
        latLng: origin,
      },
    },
    destination: {
      location: {
        latLng: destination.coordinates,
      },
    },
    travelMode: "DRIVE",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false,
    },
    languageCode: "en-US",
    units: "METRIC",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.distanceMeters",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.routes && result.routes.length > 0) {
      return result.routes[0].distanceMeters;
    } else {
      console.error("No routes found in the response");
      return Infinity;
    }
  } catch (error) {
    console.error("Error fetching route distance:", error);
    return Infinity;
  }
}

async function findOptimizedRoute() {
  let currentLocation = startingPoint;
  const remainingDestinations = [...destinations];
  const optimizedRoute = [];

  while (remainingDestinations.length > 0) {
    let closestDestination = null;
    let shortestDistance = Infinity;

    for (const destination of remainingDestinations) {
      try {
        const distance = await calculateRouteDistance(
          currentLocation,
          destination
        );
        if (distance < shortestDistance) {
          shortestDistance = distance;
          closestDestination = destination;
        }
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    }

    if (closestDestination) {
      // Add Google Maps link to the destination
      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${closestDestination.coordinates.latitude},${closestDestination.coordinates.longitude}`;
      optimizedRoute.push({ ...closestDestination, googleMapsLink });
      currentLocation = closestDestination.coordinates;
      remainingDestinations.splice(
        remainingDestinations.indexOf(closestDestination),
        1
      );
    }
  }

  console.log(optimizedRoute);
}

findOptimizedRoute();
