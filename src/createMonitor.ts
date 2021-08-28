import stream from 'stream';
import SerialConnection from './SerialConnection'
import * as Modbus from '../modbus/modbus';
import { FC } from '../modbus/codes/function-codes'
import SerialDataParser from './modbus/SerialDataParser';

const dataLogger = (data: Buffer) => {
    const request: Modbus.ModbusRTURequest | null = Modbus.ModbusRTURequest.fromBuffer(data);
    let response: Modbus.ModbusRTUResponse | null;

    if (request !== null) {
        response = Modbus.ModbusRTUResponse.fromBuffer(data);

        let values;
        if (response !== null) {
            values = typeof (response.body as any)._values === 'undefined' ? '' : `Values: ${(response.body as any)._values}`;
        }
        if (response === null || values === '') {
            values = typeof (request.body as any)._values === 'undefined' && typeof (request.body as any).value === 'undefined' ? '' : `Values: ${((request.body as any)._values ? (request.body as any)._values : (request.body as any).value)}`;
        }

        console.log(`[MONITOR] Master request ${request.name} to slave ${request.slaveId}, Address: ${request.address} ${values}`);
        return;
    }

    response = Modbus.ModbusRTUResponse.fromBuffer(data);
    if (response !== null) {
        const values = typeof (response.body as any)._values === 'undefined' && typeof (response.body as any).value === 'undefined' ? '' : `Values: ${(response.body as any)._values ? (response.body as any)._values : (response.body as any).value}`;
        console.log(`[MONITOR] Slave response ${FC[response.body.fc]}  Address: ${response._address} ${values}`);
        return;
    }

    console.warn('UNKOWN DATA !');
};

export const createMonitor = (serialPath = '/dev/ttyS11', serialPathDwa = '/dev/ttyS12') => {
    const monitor: stream.Duplex = new SerialConnection(serialPath, { baudRate: 9600 });
    const masterSocket: stream.Duplex = new SerialConnection(serialPathDwa, { baudRate: 9600 })

    monitor.pipe(masterSocket);
    masterSocket.pipe(monitor);

    console.log(`[MONITOR] Created at ports ${serialPath}, ${serialPathDwa}`);


    masterSocket.addListener(
        'data',
        (data) => SerialDataParser.ParseRequest(data).logInfo()
    );
    // monitor.addListener('data', (data) => dataLogger(data))


    return monitor;
};
