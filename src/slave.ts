import SerialConnection from './SerialConnection'
import * as Modbus from '../modbus/modbus';
import WriteSingleRegisterRequestBody from '../modbus/request/write-single-register';

export const createSlave = (serialPath): Modbus.ModbusRTUServer => {
    const slave = new Modbus.server.RTU(
        new SerialConnection(serialPath),
        {
            coils: Buffer.alloc(24, 0xFF00),
            discrete: Buffer.alloc(256, 0xFF00),
            holding: Buffer.alloc(512, 0x0000),
            input: Buffer.alloc(512, 0x0000),
        }
    );

    console.log(`[SLAVE] Created at port ${serialPath}`);

    const defaultReadHandler = (value: string) => {
        slave.on(`preRead${value}`,
            (request) => console.log(
                `[SLAVE_${request.slaveId}][${value}][READ] Address ${request.address}`
            )
        );
    };

    const defaultWriteHandler = (value: string) => {
        slave.on(`preWrite${value}`, (request: (Modbus.ModbusAbstractRequest | Modbus.ModbusRTURequest)) => {
            let quantity: string | number = (request.body as WriteSingleRegisterRequestBody).quantity
            quantity = typeof quantity === 'undefined' ? '' : `, Quantity: ${(request.body as WriteSingleRegisterRequestBody).quantity}`;

            const val = typeof (request.body as any)._value !== 'undefined' ? (request.body as any)._value : (request.body as any)._valuesAsArray.join(', ');

            console.log(
                `[SLAVE_${request.slaveId}][${value}][WRITE] Address: ${request.address}${quantity}, Value: ${val}`)
        });
    };

    defaultReadHandler('InputRegisters');
    defaultReadHandler('HoldingRegisters');
    defaultReadHandler('DiscreteInputs');
    defaultReadHandler('Coils');

    defaultWriteHandler('SingleCoil');
    defaultWriteHandler('MultipleCoils');
    defaultWriteHandler('SingleRegister');
    defaultWriteHandler('MultipleRegisters');

    return slave;
};
