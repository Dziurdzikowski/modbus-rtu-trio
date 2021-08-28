import stream from 'stream';
import * as Modbus from '../modbus/modbus';
import { FC } from '../modbus/codes/function-codes'
const SerialPort = require('../node_modules/serialport/lib/index');

export const createMonitor = (serialPath) => {
    const monitor: stream.Duplex = new SerialPort(
        serialPath,
        { baudRate: 9600 }
    );
    const masterSocket: stream.Duplex = new SerialPort('/dev/ttyS12', { baudRate: 9600 })
    monitor.pipe(masterSocket);
    masterSocket.pipe(monitor);

    const codeToName = {

    };

    const dataLogger = (data) => {
        const request: Modbus.ModbusRTURequest | null = Modbus.ModbusRTURequest.fromBuffer(data);
        let response: Modbus.ModbusRTUResponse | null;

        if (request !== null) {
            response = Modbus.ModbusRTUResponse.fromBuffer(data);

            let values;
            if (response !== null) {
                values = typeof (<any>response.body)._values === 'undefined' ? '' : `Values: ${(<any>response.body)._values}`;
            }
            if (response === null || values === '') {
                values = typeof (<any>request.body)._values === 'undefined' && typeof (<any>request.body).value === 'undefined' ? '' : `Values: ${((<any>request.body)._values ? (<any>request.body)._values : (<any>request.body).value)}`;
            }

            console.log(`[MONITOR} Master request ${request.name} to slave ${request.slaveId}, Address: ${request.address} ${values}`);
            return;
        }

        response = Modbus.ModbusRTUResponse.fromBuffer(data);
        if (response !== null) {
            let values = typeof (<any>response.body)._values === 'undefined' && typeof (<any>response.body).value === 'undefined' ? '' : `Values: ${(<any>response.body)._values ? (<any>response.body)._values : (<any>response.body).value}`;
            console.log(`[MONITOR} Slave response ${FC[response.body.fc]}  Address: ${response._address} ${values}`);
            return;
        }

        console.warn('UNKOWN DATA !');
        
    };

    monitor.addListener('data', (data) => dataLogger(data))

    return monitor;
};
