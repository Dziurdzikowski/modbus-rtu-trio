import * as Modbus from '../modbus/modbus';
import { randomInt } from 'crypto';

export class MasterWithTests extends Modbus.client.RTU {
    tests: {
        singleRegister: CallableFunction[],
        multipleRegisters: CallableFunction[],
        coils: CallableFunction[],
        discreteInputs: CallableFunction[],
    } = {
        singleRegister: [],
        multipleRegisters: [],
        coils: [],
        discreteInputs: [],
    };
}

export const SingleRegisterTest = (master: Modbus.ModbusRTUClient): CallableFunction[] => [
    () => {
        master.readHoldingRegisters(0x0001, 1).then((val) => {
            const response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`[MASTER][SingleRegister][READ] Address: 0001, Value: ${response.body.values[0]}`);
        }, (errorReason) => {
            console.log('[MASTER][SingleRegister][READ][ERROR]', errorReason);
        });
    },
    () => {
        const randomVal = randomInt(1, 255);
        console.log(
            `[MASTER][SingleRegister][WRITE] Address: 0001, Value: ${randomVal}`
        );
        master.writeSingleRegister(0x0001, randomVal).catch((errorReason) => {
            console.log('[MASTER][WRITE][SingleRegister][ERROR]', errorReason)
        })
    },
    () => {
        master.readHoldingRegisters(0x0001, 1).then((val) => {
            const response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`[MASTER][SingleRegister][READ] Address: 0001, Value: ${response.body.values[0]}`);
        }, (errorReason) => {
            console.log('[MASTER][SingleRegister][READ][ERROR]', errorReason);
        });
    }
];

export const MultipleRegistersTest = (master: Modbus.ModbusRTUClient): CallableFunction[] => [
    () => {
        master.readHoldingRegisters(0x0003, 2).then((val) => {
            const response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`[MASTER][MultipleRegisters][READ] Address: 0003-0004, Values: ${response.body.values.join(', ')}`);
        }, (errorReason) => {
            console.log('[MASTER][MultipleRegisters][READ][ERROR]', errorReason);
        });
    },
    () => {
        const randomVal = [randomInt(1, 255), randomInt(1, 255)];
        console.log(
            `[MASTER][MultipleRegisters][WRITE] Address: 0003-0004, Values: ${randomVal.join(', ')}`
        );
        master.writeMultipleRegisters(0x0003, randomVal).catch((errorReason) => {
            console.log('[MASTER][WRITE][MultipleRegisters][ERROR]', errorReason)
        })
    },
    () => {
        master.readHoldingRegisters(0x0003, 2).then((val) => {
            const response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            console.log(`[MASTER][MultipleRegisters][READ] Address: 0003-0004, Values: ${response.body.values.join(', ')}`);
        }, (errorReason) => {
            console.log('[MASTER][MultipleRegisters][READ][ERROR]', errorReason);
        });
    }
]

export const CoilsTest = (master: Modbus.ModbusRTUClient): CallableFunction[] => [
    () => {
        master.readCoils(1, 3).then((val) => {
            const response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            const values: Buffer = response.body.values;
            const binDecoded = values.readUInt8(0).toString(2).padStart(3, '0').split('');
            // @ts-ignore
            console.log(`[MASTER][MultipleCoils][READ] Address: 01-03, Values: ${binDecoded.join(', ')}`);
        }, (errorReason) => {
            console.log('[MASTER][MultipleCoils][READ][ERROR]', errorReason);
        });
    },
    () => {
        const randomVal: 0 | 1 = (randomInt(1, 255) >= 125) ? 0 : 1;
        console.log(
            `[MASTER][SingleCoil][WRITE] Address: 01, Value: ${randomVal}`
        );
        master.writeSingleCoil(1, randomVal).catch((errorReason) => {
            console.log('[MASTER][WRITE][SingleCoil][ERROR]', errorReason)
        })
    },
    () => {
        const randomVal = [
            Boolean(randomInt(0, 255) >= 125),
            Boolean(randomInt(0, 255) >= 125)
        ];

        console.log(
            `[MASTER][MultipleCoils][WRITE] Address: 02-03, Value: ${randomVal[0]}, ${randomVal[1]}`
        );
        master.writeMultipleCoils(2, randomVal).catch((errorReason) => {
            console.log('[MASTER][WRITE][MultipleCoils][ERROR]', errorReason)
        })
    },
    () => {
        master.readCoils(1, 3).then((val) => {
            const response: Modbus.ModbusRTUResponse = val.response as Modbus.ModbusRTUResponse;
            // @ts-ignore
            const values: Buffer = response.body.values;
            const binDecoded = values.readUInt8(0).toString(2).padStart(3, '0').split('');
            // @ts-ignore
            console.log(`[MASTER][MultipleCoils][READ] Address: 01-03, Values: ${binDecoded.join(', ')}`);
        }, (errorReason) => {
            console.log('[MASTER][MultipleCoils][READ][ERROR]', errorReason);
        });
    },
];

export const DiscreteInputsTest =  (master: Modbus.ModbusRTUClient): CallableFunction[] => [
    () => {
        const randomOffset = randomInt(1, 30) + 1;
        master.readDiscreteInputs(randomOffset, 3).then((val) => {
            const response: any = val.response as Modbus.ModbusRTUResponse;
            console.log(`[MASTER][DiscreteInputs][READ] Address: ${randomOffset}-${(randomOffset + 3)}, Values: ${response.body._valuesAsArray.join(', ')}`);
        }, (errorReason) => {
            console.log('[MASTER][DiscreteInputs][READ][ERROR]', errorReason);
        });
    },
];
