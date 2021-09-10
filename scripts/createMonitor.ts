import { createMonitor } from '../src/monitor'

const slaveSerialPath = process.argv[2] ? process.argv[2] : '/dev/ttyUSB0';

try {
    createMonitor(slaveSerialPath);
} catch (err) {
    console.log(err);
    process.exit(1);
}
