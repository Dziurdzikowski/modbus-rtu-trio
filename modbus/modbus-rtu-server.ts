
import ModbusServerClient from './modbus-server-client'
import ModbusServer, { IModbusServerOptions } from './modbus-server'
import ModbusRTURequest from './rtu-request'
import ModbusRTUResponse from './rtu-response'

import * as SerialPort from 'serialport'

type RTURequestFromBuffer = typeof ModbusRTURequest.fromBuffer;
type RTUResponseFromRequest = typeof ModbusRTUResponse.fromRequest

export default class ModbusRTUServer extends ModbusServer {
  public _socket: SerialPort
  public emit: any
  public client: ModbusServerClient<SerialPort, RTURequestFromBuffer, RTUResponseFromRequest>;

  constructor (socket: SerialPort, options?: Partial<IModbusServerOptions>) {
    super(options)
    this._socket = socket

    const fromBuffer = ModbusRTURequest.fromBuffer
    const fromRequest = ModbusRTUResponse.fromRequest as any
    this.client = new ModbusServerClient(this, socket, fromBuffer, fromRequest)
    this.emit('connection', this.client)
  }
}
