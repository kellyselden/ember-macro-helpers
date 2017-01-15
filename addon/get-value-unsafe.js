import getValue from './get-value';

export default function(context, key) {
  let value = getValue(context, key);
  if (value !== undefined) {
    return value;
  }

  return key;
}
