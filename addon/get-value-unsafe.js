import getValue from './get-value';

export default function(context, key) {
  let value = getValue(context, key);
  if (value) {
    return value;
  }

  return key;
}
