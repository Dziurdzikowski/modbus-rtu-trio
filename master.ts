import { MasterWithTests, createMaster } from './src/createMaster';

const serialPath = '/dev/ttyS11';
const master: MasterWithTests = createMaster(serialPath, 1);

let test_operation_index = 0;
const test_operations_list = [
    ...master.tests.singleRegister,
    ...master.tests.multipleRegisters,
    ...master.tests.coils,
    // ...master.tests.discreteInputs,
];

setInterval(() => {
    if(test_operations_list.length === test_operation_index) {
        test_operation_index = 0;
    }

    try {
        test_operations_list[test_operation_index]();
    } catch(err) {
        console.log('ERROR OKURWED', err);
    }
    test_operation_index++;
}, 5000)
