import {
    MasterWithTests,
    SingleRegisterTest,
    MultipleRegistersTest,
    CoilsTest,
    DiscreteInputsTest
} from './masterTestOperations';

export { MasterWithTests } from './masterTestOperations';

const SerialPort = require('serialport');

export const createMaster = (serialPath: string, slaveID: number = 1): MasterWithTests => {
    const master = new MasterWithTests(
        new SerialPort(serialPath, { baudRate: 9600 }),
        slaveID,
        5000
    );

    console.log(`[MASTER] Created at port ${serialPath}`);

    master.tests.singleRegister = SingleRegisterTest(master);
    master.tests.multipleRegisters = MultipleRegistersTest(master);
    master.tests.coils = CoilsTest(master);
    master.tests.discreteInputs = DiscreteInputsTest(master);

    return master;
};
