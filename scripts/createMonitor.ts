import { createMonitor } from '../src/monitor'

const slaveSerialPath = process.argv[2] ? process.argv[2] : '/dev/ttyS11';
const masterSerialPath = process.argv[3] ? process.argv[3] : '/dev/ttyS12';

createMonitor(slaveSerialPath, masterSerialPath);
