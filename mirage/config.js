import CalculateDistance from 'invite-customers/utils/calculate-distance';

export default function() {
  // this.timing = 2000; // Uncomment to see the is the `inviting...` effect

  this.get('/customer-infos', (db, req) => {
    let officeCoordinates = { lat: '53.3393', lon: '-6.2576841' };
    let filteredInfos = db.customerInfos.all().models;
    filteredInfos.forEach(info => info.attrs.distance = CalculateDistance(officeCoordinates.lat, officeCoordinates.lon, info.latitude, info.longitude));
    if (req.queryParams.withinRange === 'true') { // This is not a boolean, mirage converts it to a string
      filteredInfos = filteredInfos.filter(info => info.attrs.distance <= 100);
    }
    return {
      data: filteredInfos.map(attributes => ({
        type: 'customer-info',
        id: attributes.id,
        attributes
      }))
    };
  });
  this.patch('/customer-infos/:id');
}
