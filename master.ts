import { randomInt } from 'crypto';
import * as Modbus from './modbus/modbus';

const serialPath = '/dev/ttyS11';
const SerialPort = require('serialport');

const master = new Modbus.client.RTU(
    new SerialPort(serialPath),
    1,
    5000
);

console.log(`[MASTER] Created at port ${serialPath}`);


let test_operation_index = 0;

const test_operations_list = [
    () => {
        master.readHoldingRegisters(0x0001, 1).then((val) => {
            let response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`[MASTER][SingleRegister][READ] Address: 0001, Value: ${response.body.values[0]}`);
        }, (errorReason) => {
            console.log('[MASTER][SingleRegister][READ][ERROR]', errorReason);
        });
    },
    () => {
        let randomVal = randomInt(1, 255);
        console.log(
            `[MASTER][SingleRegister][WRITE] Address: 0001, Value: ${randomVal}`
        );
        master.writeSingleRegister(0x0001, randomVal).catch((errorReason) => {
            console.log('[MASTER][WRITE][SingleRegister][ERROR]', errorReason)
        })
    },
    () => {
        master.readHoldingRegisters(0x0001, 1).then((val) => {
            let response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`[MASTER][SingleRegister][READ] Address: 0001, Value: ${response.body.values[0]}`);
        }, (errorReason) => {
            console.log('[MASTER][SingleRegister][READ][ERROR]', errorReason);
        });
    },

    () => {
        master.readHoldingRegisters(0x0003, 2).then((val) => {
            let response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`[MASTER][MultipleRegisters][READ] Address: 0003-0004, Values: ${response.body.values.join(', ')}`);
        }, (errorReason) => {
            console.log('[MASTER][MultipleRegisters][READ][ERROR]', errorReason);
        });
    },
    () => {
        let randomVal = [randomInt(1, 255), randomInt(1, 255)];
        console.log(
            `[MASTER][MultipleRegisters][WRITE] Address: 0003-0004, Values: ${randomVal.join(', ')}`
        );
        master.writeMultipleRegisters(0x0003, randomVal).catch((errorReason) => {
            console.log('[MASTER][WRITE][MultipleRegisters][ERROR]', errorReason)
        })
    },
    () => {
        master.readHoldingRegisters(0x0003, 2).then((val) => {
            let response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`[MASTER][MultipleRegisters][READ] Address: 0003-0004, Values: ${response.body.values.join(', ')}`);
        }, (errorReason) => {
            console.log('[MASTER][MultipleRegisters][READ][ERROR]', errorReason);
        });
    },

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
