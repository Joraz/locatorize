const expect = require('chai').expect;
const { getDistanceFrom, getLatAndLong, toRadians } = require('../lib/utils');

describe('getDistanceFrom', () => {
    it('should return the correct distance for the provided coordinates', () => {
        const homeLat = 53.400825;
        const homeLong = -2.334875399999987;
        const coords = '51.5174089,-3.201135700000009';

        const distance = getDistanceFrom(coords, homeLat, homeLong);

        expect(distance).to.equal(217.49088884252225);
    });
});

describe('getLatAndLong', () => {
    it('should return numerical representation of the provided coordinates', () => {
        const { lat, long } = getLatAndLong('51.5822672,-3.0082609999999477');
        expect(lat).to.equal(51.5822672);
        expect(long).to.equal(-3.0082609999999477);
    });
});

describe('toRadians', () => {
    it('should convert the number to radians', () => {
        const radians = toRadians(53.400825);
        expect(radians).to.equal(0.932020219531301);
    });
});
