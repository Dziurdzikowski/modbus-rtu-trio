
import Debug = require('debug'); const debug = Debug('modbus tcp client socket')
import * as Stream from 'stream'
import { ModbusAbstractRequestFromBuffer } from './abstract-request'
import { ModbusAbstractResponseFromRequest } from './abstract-response'
import ModbusServerRequestHandler from './modbus-server-request-handler'
import ModbusServerResponseHandler from './modbus-server-response-handler'
import ModbusServer from './modbus-server'

export default class ModbusServerClient<
  S extends Stream.Duplex,
  ReqFromBufferMethod extends ModbusAbstractRequestFromBuffer,
  ResFromRequestMethod extends ModbusAbstractResponseFromRequest> {
  public _server: ModbusServer
  public _socket: S
  public _requestHandler: ModbusServerRequestHandler<ReqFromBufferMethod>
  public _responseHandler: ModbusServerResponseHandler<ResFromRequestMethod>

  constructor (
    server: ModbusServer,
    socket: S,
    fromBufferMethod: ReqFromBufferMethod,
    fromRequestMethod: ResFromRequestMethod
  ) {
    this._server = server
    this._socket = socket

    this._requestHandler = new ModbusServerRequestHandler(fromBufferMethod)
    this._responseHandler = new ModbusServerResponseHandler(this._server, fromRequestMethod)

    this._socket.addListener('data', (buffer) => this._onData(buffer))
    this._socket.addListener('data', (buffer) => this._server.emit('data', fromBufferMethod(buffer)))
  }

  get socket () {
    return this._socket
  }

  get server () {
    return this._server
  }

  public _onData (data: Buffer) {
    debug('new data coming in')
    this._requestHandler.handle(data)

    do {
      const request = this._requestHandler.shift()

      if (!request) {
        debug('no request to process')
        /* TODO: close client connection */
        break
      }

      this._responseHandler.handle(request, (response) => {
        this._socket.write(response, () => {
          debug('response flushed', response)
        })
      })
    } while (1)
  }
}
