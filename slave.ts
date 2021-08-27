import * as Modbus from './modbus/modbus';
import ModbusRTURequest from './modbus/rtu-request';

const serialPath = '/dev/ttyS10';
const SerialPort = require('serialport');

const server = new Modbus.server.RTU(
    new SerialPort(serialPath),
    {
        coils: Buffer.alloc(0xFFFF, 0x00),
        discrete: Buffer.alloc(0xFFFF, 0x00),
        holding: Buffer.alloc(0xFFFF, 0x0000),
        input: Buffer.alloc(0xFFFF, 0x0000),
    }
);

// server.on('data', (request) => {
//     console.log('New data received !', request);
// })

server.on('preWriteSingleRegister', (request) => {
    
    // server.holding[request.body.address] = request.body.value;
    console.log('preWriteSingleRegister', server.holding)
})

server.on('preReadHoldingRegisters', (request) => {
    console.log('preReadHoldingRegisters', request)
})

server.on('postReadHoldingRegisters', (request) => {
    console.log('postReadHoldingRegisters', request)
})


// server._socket.addListener('data', (buffer) => {
//     console.log('New data received !', ModbusRTURequest.fromBuffer(buffer));
// })
