import Debug = require('debug'); const debug = Debug('response-factory')

import { FC } from '../codes/index'
import ExceptionResponseBody from './exception'
import ReadCoilsResponseBody from './read-coils'
import ReadDiscreteInputsBody from './read-discrete-inputs'
import ReadHoldingRegistersBody from './read-holding-registers'
import ReadInputRegistersBody from './read-input-registers'
import WriteMultipleCoilsBody from './write-multiple-coils'
import WriteMultipleRegistersBody from './write-multiple-registers'
import WriteSingleCoilBody from './write-single-coil'
import WriteSingleRegisterBody from './write-single-register'

/** Response Factory
 * @factory
 */
export default class ResponseFactory {
  public static fromBuffer (buffer: Buffer) {
    try {
      const fc = buffer.readUInt8(0)

      debug('fc', fc, 'payload', buffer)

      /* Exception Response */
      if (fc > 0x80) {
        return ExceptionResponseBody.fromBuffer(buffer)
      }

      /* Read Coils Response */
      if (fc === FC.READ_COIL) {
        return ReadCoilsResponseBody.fromBuffer(buffer)
      }

      /* Read Discrete Inputs Response */
      if (fc === FC.READ_DISCRETE_INPUT) {
        return ReadDiscreteInputsBody.fromBuffer(buffer)
      }

      /* Read Holding Registers Response */
      if (fc === FC.READ_HOLDING_REGISTERS) {
        return ReadHoldingRegistersBody.fromBuffer(buffer)
      }

      /* Read Input Registers Response */
      if (fc === FC.READ_INPUT_REGISTERS) {
        return ReadInputRegistersBody.fromBuffer(buffer)
      }

      /* Write Single Coil Response */
      if (fc === FC.WRITE_SINGLE_COIL) {
        return WriteSingleCoilBody.fromBuffer(buffer)
      }

      /* Write Single Register Response */
      if (fc === FC.WRITE_SINGLE_HOLDING_REGISTER) {
        return WriteSingleRegisterBody.fromBuffer(buffer)
      }

      /* Write Multiple Coils Response */
      if (fc === FC.WRITE_MULTIPLE_COILS) {
        return WriteMultipleCoilsBody.fromBuffer(buffer)
      }

      /* Write Multiple Registers Response */
      if (fc === FC.WRITE_MULTIPLE_HOLDING_REGISTERS) {
        return WriteMultipleRegistersBody.fromBuffer(buffer)
      }

      return null
    } catch (e) {
      debug('when NoSuchIndex Exception, the buffer does not contain a complete message')
      debug(e)
      return null
    }
  }
}
