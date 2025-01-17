/**
 * Calculates the fare based on distance, car type, and possible surge logic.
 */
export default function calculateFare(distance, carType) {
    const baseFare = carType === 'suv' ? 10 : 5; // USD
    const perKmRate = carType === 'suv' ? 2 : 1.5; // USD per km
    let totalFare = baseFare + distance * perKmRate;
  
    // Example surge logic
    const isSurgeTime = false; // Implement real surge detection if desired
    if (isSurgeTime) {
      totalFare *= 1.5; // 50% surge
    }
  
    return totalFare.toFixed(2);
  }