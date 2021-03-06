import stream from 'stream';
import SerialConnection from './SerialConnection'
import * as Modbus from '../modbus/modbus';
import { FC } from '../modbus/codes/function-codes'
import SerialDataParser from './modbus/SerialDataParser';
import RequestDataFrame from './modbus/RequestDataFrame';
import ResponseDataFrame from './modbus/ResponseDataFrame';

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

export const createMonitor = (serialPath) => {
    const masterSocket: stream.Duplex = new SerialConnection(serialPath)
    let lastRequest: RequestDataFrame;

    console.log(`[MONITOR] Created at ports ${serialPath}`);

    masterSocket.addListener(
        'data',
        (data) => {
            lastRequest = SerialDataParser.ParseRequest(data);
            lastRequest.logInfo()
        }
    );

    return {
        masterSocket
    };
};
