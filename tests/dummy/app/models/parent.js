import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  children: hasMany('child')
});
