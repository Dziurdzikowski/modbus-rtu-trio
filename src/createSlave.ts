const SerialPort = require('serialport');
import * as Modbus from '../modbus/modbus';
import WriteSingleRegisterRequestBody from '../modbus/request/write-single-register';

export const createSlave = (serialPath): Modbus.ModbusRTUServer => {
    const slave = new Modbus.server.RTU(
        new SerialPort(serialPath),
        {
            coils: Buffer.alloc(24, 0xFF00),
            discrete: Buffer.alloc(256, 0x0000),
            holding: Buffer.alloc(512, 0x0000),
            input: Buffer.alloc(512, 0x0000),
        }
    );

    console.log(`[SLAVE] Created at port ${serialPath}`);


    const readRequests = [
        'InputRegisters',
        'HoldingRegisters',
        'DiscreteInputs',
        'Coils',
    ];

    readRequests.forEach((value) => {
        slave.on(
            `preRead${value}` as any,
            (request) => console.log(
                `[SLAVE_${request.slaveId}][${value}][READ] Address ${request.address}`
            )
        );
    });

    const writeRequests = [
        'SingleCoil',
        'MultipleCoils',
        'SingleRegister',
        'MultipleRegisters',
    ];

    writeRequests.forEach((value) => {
        slave.on(
            `preWrite${value}` as any,
            (request: (Modbus.ModbusAbstractRequest | Modbus.ModbusRTURequest)) => {
                let quantity: string|number = (<WriteSingleRegisterRequestBody>request.body).quantity
                quantity = typeof quantity === 'undefined' ? '' : `, Quantity: ${(<WriteSingleRegisterRequestBody>request.body).quantity}`;

                let val = typeof (<any>request.body)._value !== 'undefined' ? (<any>request.body)._value : (<any>request.body)._valuesAsArray.join(', ');

                console.log(
                    `[SLAVE_${request.slaveId}][${value}][WRITE] Address: ${request.address}${quantity}, Value: ${val}`)
            }
        );
    });

    return slave;
};
