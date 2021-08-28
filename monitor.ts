import { createMonitor } from './src/createMonitor'

const serialPath = '/dev/ttyS11';
const serialPathDwa = '/dev/ttyS12';
createMonitor(serialPath, serialPathDwa);
