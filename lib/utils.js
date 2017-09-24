const CONSTANTS = require('./constants');

/**
 * Uses the haversine formula to calculate the great circle distance between two points.
 * This is suitable for most scenarios that do not require calculations near the antipodal points
 * @param {string} coordinates A comma-separated string representing a set of coordinates
 * @param {number} startingLat The latitude of the starting point
 * @param {number} startingLong The longitude of the starting point
 * @returns {number} The distance in kilometers
 */
function getDistanceFrom(coordinates, startingLat, startingLong) {
    const { lat: partnerLat, long: partnerLong } = getLatAndLong(coordinates);

    const latDifference = partnerLat - startingLat;
    const longDifference = partnerLong - startingLong;

    const latDifferenceInRadians = toRadians(latDifference);
    const longDifferenceInRadians = toRadians(longDifference);

    const latSinSquared = Math.sin(latDifferenceInRadians / 2) * Math.sin(latDifferenceInRadians / 2);
    const longSinSquared = Math.sin(longDifferenceInRadians / 2) * Math.sin(longDifferenceInRadians / 2);

    const latAndLongCosMultiplied = Math.cos(toRadians(startingLat)) * Math.cos(toRadians(partnerLat));

    const yCoord = latSinSquared + latAndLongCosMultiplied * longSinSquared;
    const doubledAngle = 2 * Math.atan2(Math.sqrt(yCoord), Math.sqrt(1 - yCoord));

    const finalDistance = CONSTANTS.RADIUS_OF_EARTH_IN_KM * doubledAngle;

    return finalDistance;
}

/**
 * Function that accepts a comma-separated coordinate and returns an object
 * with lat and long properties
 * @param {string} coordinate A coordinate in the form 'lat,long'
 * @returns {{lat: number, long: number}}
 */
function getLatAndLong(coordinate) {
    const latAndLong = coordinate.split(',');

    const latAsFloat = parseFloat(latAndLong[0]);
    const longAsFloat = parseFloat(latAndLong[1]);

    return { lat: latAsFloat, long: longAsFloat };
}

/**
 * Converts a numerical representation of a degree to a radian
 * @param {number} num The number, in degrees, to convert
 * @returns {number}
 */
function toRadians(num) {
    return num * Math.PI / 180;
}

module.exports = {
    getLatAndLong: getLatAndLong,
    toRadians: toRadians,
    getDistanceFrom: getDistanceFrom
}