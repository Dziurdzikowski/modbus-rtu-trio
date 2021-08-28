import stream from 'stream';
import * as Modbus from '../modbus/modbus';

const SerialPort = require('../node_modules/serialport/lib/index');

export const createMonitor = (serialPath) => {
    const monitor: stream.Duplex = new SerialPort(
        serialPath,
        { baudRate: 9600 }
    );
    const masterSocket: stream.Duplex = new SerialPort('/dev/ttyS12', { baudRate: 9600 })
    monitor.pipe(masterSocket);
    masterSocket.pipe(monitor);

    const dataLogger = (data) => {
        const request: Modbus.ModbusRTURequest | null = Modbus.ModbusRTURequest.fromBuffer(data);
        const response: Modbus.ModbusRTUResponse | null = Modbus.ModbusRTUResponse.fromBuffer(data);
        if (request !== null) {
            console.log(`[MONITOR} Founded RTU master request with name ${request.name} to slave ${request.slaveId} and body ${JSON.stringify(request.body)}`);
        } else if (response !== null) {
            console.log(`[MONITOR} Founded RTU slave response ${JSON.stringify(response)}`);
        } else {
            console.warn('UNKOWN DATA !');
        }
    };

    monitor.addListener('data', (data) => dataLogger(data))

    return monitor;
};
