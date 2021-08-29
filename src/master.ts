import SerialConnection from './SerialConnection'
import {
    MasterWithTests,
    SingleRegisterTest,
    MultipleRegistersTest,
    CoilsTest,
    DiscreteInputsTest,
} from './masterTestOperations';

export const createMaster = (serialPath: string, slaveID: number = 1): MasterWithTests => {
    const master = new MasterWithTests(
        new SerialConnection(serialPath),
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

export { MasterWithTests } from './masterTestOperations';
