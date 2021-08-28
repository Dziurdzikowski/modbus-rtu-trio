import { createMonitor } from './src/createMonitor'

const serialPath = '/dev/ttyS11';
const monitor = createMonitor(serialPath);
