import { MasterWithTests, createMaster } from './src/createMaster';

const serialPath = '/dev/ttyS11';
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

    try {
        testoperationlist[testoperationindex]();
    } catch(err) {
        console.log('ERROR OKURWED', err);
    }
    testoperationindex++;
}, 5000)
