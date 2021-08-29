import { MasterWithTests, createMaster } from '../src/master';

const serialPath = process.argv[2] ? process.argv[2] : '/dev/ttyS13';

const master: MasterWithTests = createMaster(serialPath, 1);

let testoperationindex = 0;
const testoperationlist = [
    ...master.tests.singleRegister,
    ...master.tests.multipleRegisters,
    ...master.tests.coils,
    ...master.tests.discreteInputs,
];

setInterval(() => {
    if(testoperationlist.length === testoperationindex) {
        testoperationindex = 0;
    }
    testoperationlist[testoperationindex]();
    testoperationindex++;
}, 5000)
