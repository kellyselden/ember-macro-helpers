import { buildCurriedComputed } from './-build-computed';
import lazyComputed from './lazy-computed';

export default buildCurriedComputed(lazyComputed);
