/** @type {Array<{organization: string, offices: Array<{location: string, address: string, coordinates: string}>}>} */
const data = require('./data.json');
const CONSTANTS = require('./lib/constants');
const { getDistanceFrom, toRadians, getLatAndLong } = require('./lib/utils');

console.log(`Calculating partners within ${CONSTANTS.WITHIN_KM}km of location '${CONSTANTS.LONDON_LOCATION}'\n`);

if (!data || data.length === 0) {
    throw new Error('Could not read partner data. Please check data source');
}

// Before looping through, set up the correct lat/long in radians for the london office.
// Doing it outside the loop ensures we don't recalculate it unnecessarily.
const { lat: homeLat, long: homeLong } = getLatAndLong(CONSTANTS.LONDON_LOCATION);
const homeLatInRadians = toRadians(homeLat);
const homeLongInRadians = toRadians(homeLong);

// We need to iterate through the partners, and check each to see if
// they have at least one office within the distance of the coordinate specified in the constants file
/** @type {{ name: string, address: string }[]} */
let partnersWithinDistance = data.map((partner) => {
    // A partner can have several offices, and even several within 100KM.
    // We pick the closest in this situation
    /** @type {{ address: string, distance: number }} */
    let closestOffice;

    partner.offices.forEach((office) => {
        const distance = getDistanceFrom(office.coordinates, homeLat, homeLong)

        // No office set, default to this one
        if (!closestOffice) {
            closestOffice = {
                address: office.address,
                distance: distance
            }
        } else if (distance < closestOffice.distance) {
            closestOffice = {
                address: office.address,
                distance: distance
            }
        }
    });

    if (closestOffice.distance > CONSTANTS.WITHIN_KM) {
        return null; // We return null to make it easy to filter out these results later
    }

    return {
        name: partner.organization,
        address: closestOffice.address
    }

});

// This removes all 'falsy' values, including null
partnersWithinDistance = partnersWithinDistance.filter(Boolean);

// Then, sort by the name
partnersWithinDistance.sort((first, second) => {
    if (first.name < second.name) {
        return -1;
    } else if (first.name > second.name) {
        return 1;
    }

    return 0;
});

// Finally, iterate once more and log the results
partnersWithinDistance.forEach((partner) => {
    console.log(`${partner.name} at ${partner.address}.`);
});

console.log('\nExiting');