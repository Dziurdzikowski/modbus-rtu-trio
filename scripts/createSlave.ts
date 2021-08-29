import { createSlave } from '../src/slave'

const serialPath = process.argv[2] ? process.argv[2] : '/dev/ttyS10';
const slave = createSlave(serialPath);
