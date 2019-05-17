import DS from 'ember-data';

export default DS.Model.extend({
  latitude: DS.attr('string'),
  longitude: DS.attr('string'),
  name: DS.attr('string'),
  userId: DS.attr('number'),
  distance: DS.attr('number'),
  invited: DS.attr('boolean')
});
