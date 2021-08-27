import { randomInt } from 'crypto';
import * as Modbus from './modbus/modbus';

const serialPath = '/dev/ttyS11';
const SerialPort = require('serialport');

const master = new Modbus.client.RTU(
    new SerialPort(serialPath),
    1,
    5000
);

let test_operation_index = 0;

const test_operations_list = [
    () => {
        master.readHoldingRegisters(0x0001, 1).then((val) => {
            let response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`readHoldingRegisters 0x0001 values =>  ${response.body.values.join(', ')} `);
        }, (errorReason) => {
            console.log('readHoldingRegisters errorReason', errorReason);
        });
    },
    () => {
        let randomVal = randomInt(1, 255);
        console.log(
            `writeSingleRegister 0x0001 value => ${randomVal}`
        );
        master.writeSingleRegister(0x0001, randomVal).catch((errorReason) => {
            console.log('writeSingleRegister errorReason', errorReason)
        })
    }
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
