import { moduleForModel, test } from 'ember-qunit';

moduleForModel('customer-info', 'Unit | Model | Customer Info');

test('it exists', function(assert) {
  let customerInfo = {
    latitude: '52.986375',
    longitude: '-6.043701',
    userId: 12,
    name: 'Christina McArdle',
    invited: false
  };

  let model = this.subject(customerInfo);

  assert.equal(model.get('latitude'), customerInfo.latitude, 'latitude successfully saved');
  assert.equal(model.get('longitude'), customerInfo.longitude, 'longitude successfully saved');
  assert.equal(model.get('userId'), customerInfo.userId, 'userId successfully saved');
  assert.equal(model.get('name'), customerInfo.name, 'userId successfully saved');
  assert.equal(model.get('invited'), customerInfo.invited, 'userId successfully saved');
});
