
import {
  FC,
  isFunctionCode
} from '../codes'
import ExceptionRequest from './exception'
import ReadCoilsRequest from './read-coils'
import ReadDiscreteInputsRequest from './read-discrete-inputs'
import ReadHoldingRegistersRequest from './read-holding-registers'
import ReadInputRegistersRequest from './read-input-registers'
import WriteMultipleCoilsResponse from './write-multiple-coils'
import WriteMultipleRegistersResponse from './write-multiple-registers'
import WriteSingleCoilRequest from './write-single-coil'
import WriteSingleRegisterRequest from './write-single-register'

import Debug from 'debug'; const debug = Debug('request-factory')

export default class RequestFactory {

  /** Create a Modbus Request Body from a buffer object. Depending on the function code
   * in the buffer the request body could by any function codes request body.
   * @param {Buffer} buffer The buffer to be parsed.
   * @returns {ModbusRequestBody} The actual request body or null if there is not enough data in the buffer.
   */
  public static fromBuffer (buffer: Buffer) {
    /* TODO: detect non modbus requests and return a InvalidProtocolRequest. Requests
     * of this kind should lead to disconnecting the client. This way we can make sure that
     * unintendet messages do not harm the server */
    try {
      const fc = buffer.readUInt8(0)

      debug('fc', fc, 'payload', buffer)

      if (isFunctionCode(fc)) {
        switch (fc) {

          case FC.READ_COIL:
            return ReadCoilsRequest.fromBuffer(buffer)

          case FC.READ_DISCRETE_INPUT:
            return ReadDiscreteInputsRequest.fromBuffer(buffer)

          case FC.READ_HOLDING_REGISTERS:
            return ReadHoldingRegistersRequest.fromBuffer(buffer)

          case FC.READ_INPUT_REGISTERS:
            return ReadInputRegistersRequest.fromBuffer(buffer)

          case FC.WRITE_SINGLE_COIL:
            return WriteSingleCoilRequest.fromBuffer(buffer)

          case FC.WRITE_SINGLE_HOLDING_REGISTER:
            return WriteSingleRegisterRequest.fromBuffer(buffer)

          case FC.WRITE_MULTIPLE_COILS:
            return WriteMultipleCoilsResponse.fromBuffer(buffer)

          case FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return WriteMultipleRegistersResponse.fromBuffer(buffer)

        }
      }

      if (fc <= 0x2B) {
        debug('Illegal Function (fc %d)', fc)
        return new ExceptionRequest(fc, 0x01)
      }
    } catch (e) {
      debug('Exception while reading function code', e)
      return null
    }
  }

}
