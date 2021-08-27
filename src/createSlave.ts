const SerialPort = require('serialport');
import * as Modbus from '../modbus/modbus';
import WriteSingleRegisterRequestBody from '../modbus/request/write-single-register';

export const createSlave = (serialPath): Modbus.ModbusRTUServer => {
    const slave = new Modbus.server.RTU(
        new SerialPort(serialPath),
        {
            coils: Buffer.alloc(256, 0x0),
            discrete: Buffer.alloc(256, 0x0),
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
            // @ts-ignore
            `preRead${value}`,
            (request) => console.log(`[SLAVE_${request.slaveId}][${value}][READ] Address ${request.address}`)
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
            // @ts-ignore
            `preWrite${value}`,
            (request: (Modbus.ModbusAbstractRequest | Modbus.ModbusRTURequest)) => console.log(`[SLAVE_${request.slaveId}][${value}][WRITE] Address ${request.address}, Quantity: ${(<WriteSingleRegisterRequestBody>request.body).quantity}, Value: ${(<WriteSingleRegisterRequestBody>request.body).value}`)
        );
    });

    // slave.on(
    //     'preReadInputRegisters',
    //     (request) => console.log(`[SLAVE_${request.slaveId}][READ][InputRegisters] Address ${request.address}`)
    // );

    // slave.on(
    //     'preReadHoldingRegisters',
    //     (request) => console.log(`[SLAVE_${request.slaveId}][READ][HoldingRegisters] Address ${request.address}`)
    // );

    // slave.on(
    //     'preReadCoils',
    //     (request) => console.log(`[SLAVE_${request.slaveId}][READ][Coils] Address ${request.address}`)
    // );

    // slave.on(
    //     'preReadDiscreteInputs',
    //     (request) => console.log(`[SLAVE_${request.slaveId}][READ][ReadDiscreteInputs] Address ${request.address}`)
    // );



    return slave;
};
