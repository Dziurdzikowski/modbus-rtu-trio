import { createSlave } from './src/createSlave'

const serialPath = '/dev/ttyS10';
const slave = createSlave(serialPath);
