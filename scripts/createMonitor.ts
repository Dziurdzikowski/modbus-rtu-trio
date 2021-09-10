import { createMonitor } from '../src/monitor'

const slaveSerialPath = process.argv[2] ? process.argv[2] : '/dev/ttyUSB0';

createMonitor(slaveSerialPath);
