export default function(key) {
  if (typeof key === 'string') {
    key += '.[]';
  }
  return key;
}
