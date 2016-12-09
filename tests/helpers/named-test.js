import { test } from 'qunit';

export default function(name, title, callback) {
  test(`${name}: ${title}`, callback);
}
