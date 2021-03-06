import Debug = require('debug'); const debug = Debug('read-coils-response')
import BufferUtils from '../buffer-utils'
import { FC } from '../codes'
import { BooleanArray } from '../constants'
import ReadCoilsRequestBody from '../request/read-coils'
import ModbusReadResponseBody from './read-response-body'

const {
  bufferToArrayStatus,
  arrayStatusToBuffer,
  bufferToArrayBool
} = BufferUtils

/** Read Coils Response Body
 * @extends ModbusResponseBody
 * @class
 */
export default class ReadCoilsResponseBody extends ModbusReadResponseBody {

  /** Coils */
  get values () {
    return this._coils
  }

  get valuesAsArray () {
    return this._valuesAsArray
  }

  get valuesAsBuffer () {
    return this._valuesAsBuffer
  }

  /** Length */
  get numberOfBytes () {
    return this._numberOfBytes
  }

  get byteCount () {
    return this._numberOfBytes + 2
  }

  /** Creates a response body from a request body and
   * the coils buffer
   * @param {ReadCoilsRequestBody} request
   * @param {Buffer} coils
   * @returns {ReadCoilsResponseBody}
   */
  public static fromRequest (requestBody: ReadCoilsRequestBody, coils: Buffer) {
    const coilsStatus = bufferToArrayBool(coils)

    const start = requestBody.start
    const end = start + requestBody.count

    // Extract the segment of coils status
    const coilsSegment = coilsStatus.slice(start, end)

    return new ReadCoilsResponseBody(coilsSegment, Math.ceil(coilsSegment.length / 8))
  }

  /** Create ReadCoilsResponseBody from buffer.
   * @param {Buffer} buffer
   * @returns {ReadCoilsResponseBody} Returns Null of not enough data located in the buffer.
   */
  public static fromBuffer (buffer: Buffer) {
    try {
      const fc = buffer.readUInt8(0)
      const byteCount = buffer.readUInt8(1)
      const coilStatus = buffer.slice(2, 2 + byteCount)

      if (coilStatus.length !== byteCount) {
        return null
      }

      if (fc !== FC.READ_COIL) {
        return null
      }

      return new ReadCoilsResponseBody(coilStatus, byteCount)
    } catch (e) {
      debug('no valid read coils response body in the buffer yet')
      return null
    }
  }
  protected _valuesAsArray: BooleanArray
  protected _valuesAsBuffer: Buffer
  private _coils: BooleanArray | Buffer
  private _numberOfBytes: number

  /**
   * Create new ReadCoilsResponseBody
   * @param {(BooleanArray | Buffer)} coils
   * @param {number} numberOfBytes
   * @memberof ReadCoilsResponseBody
   */
  constructor (coils: BooleanArray | Buffer, numberOfBytes: number) {
    super(FC.READ_COIL)
    this._coils = coils
    this._numberOfBytes = numberOfBytes

    if (coils instanceof Array) {
      this._valuesAsArray = coils
      this._valuesAsBuffer = arrayStatusToBuffer(coils)
    } else if (coils instanceof Buffer) {
      this._valuesAsBuffer = coils
      this._valuesAsArray = bufferToArrayStatus(coils)
    } else {
      throw new Error('InvalidCoilsInput')
    }
  }

  public createPayload () {
    const payload = Buffer.alloc(this.byteCount)

    payload.writeUInt8(this._fc, 0)
    payload.writeUInt8(this._numberOfBytes, 1)

    this._valuesAsBuffer.copy(payload, 2)

    return payload
  }
}
