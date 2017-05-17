import getValue from './get-value';

export default function(options = {}) {
  let value = getValue(options);
  if (value !== undefined) {
    return value;
  }

  return options.macro;
}
