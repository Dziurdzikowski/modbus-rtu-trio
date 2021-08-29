import { FrameCodes, FrameDictionary } from './FrameConstant'
import RequestDataFrame from './RequestDataFrame'

export default class ResponseDataFrame {
    readonly frameLength: number;
    readonly frameCode: number;
    readonly frameType: FrameCodes;

    private data: Buffer;
    private _value?: number[];
    private _slaveID?: number;
    private _address?: number;
    private _request: RequestDataFrame;
    private _quantity?: number;

    constructor(receivedData: Buffer, receivedRequest: RequestDataFrame) {
        this._request = receivedRequest;
        this.frameLength = receivedData.length;
        this.data = receivedData;
        this._slaveID = receivedData.readUInt8(0);
        this.frameCode = receivedData.readUInt8(1);

        switch (this.frameCode) {
            case FrameCodes.READ_COIL:
                this.frameType = FrameCodes.READ_COIL;
                this.parseReadCoilData();
                break;
            case FrameCodes.READ_HOLDING_REGISTERS:
                this.frameType = FrameCodes.READ_HOLDING_REGISTERS;
                this.parseReadHoldingRegistersData();
                break;
            case FrameCodes.WRITE_SINGLE_HOLDING_REGISTER:
                this.frameType = FrameCodes.WRITE_SINGLE_HOLDING_REGISTER;
                this.parseWrtieSingleHoldingRegistersData();
                break;
            case FrameCodes.WRITE_MULTIPLE_HOLDING_REGISTERS:
                this.frameType = FrameCodes.WRITE_MULTIPLE_HOLDING_REGISTERS;
                this.parseWrtieMultipleHoldingRegistersData();
                break;
            case FrameCodes.WRITE_SINGLE_COIL:
                this.frameType = FrameCodes.WRITE_SINGLE_COIL;
                this.parseWrtieSingleCoilData();
                break;
            case FrameCodes.WRITE_MULTIPLE_COILS:
                this.frameType = FrameCodes.WRITE_MULTIPLE_COILS;
                this.parseWrtieMultipleCoilData();
                break;
            case FrameCodes.READ_DISCRETE_INPUT:
                this.frameType = FrameCodes.READ_DISCRETE_INPUT;
                this.parseReadDiscreteDataInputData();
                break;
            default:
                this.frameType = FrameCodes.UNKOWN;
                break;
        }
    }

    get quantity(): number { return this._quantity ? this._quantity : 0; }
    get value() { return this._value; }
    get address() { return this._address; }
    get slaveID() { return this._slaveID; }

    protected parseReadDiscreteDataInputData() {
        this._value = [];
        this._quantity = this._request.quantity;
        this._address = this._request.address;
        const byteCount = this.data.readUInt8(2)
        const tmp: Buffer = this.data.slice(3, 3 + byteCount);
        let quantityLasts = this.quantity;

        for (let i = 0; i < byteCount; i++) {
            tmp.readUInt8(i).toString(2).padStart(
                quantityLasts > 8 ? 8 : quantityLasts,
                '0'
            ).split('').forEach((bit) => {
                this._value?.push(
                    parseInt(bit)
                );
            });

            quantityLasts--;
        }
    }

    protected parseReadCoilData() {
        this._value = [];
        this._quantity = this._request.quantity;
        this._address = this._request.address;
        const byteCount = this.data.readUInt8(2);

        const tmp: Buffer = this.data.slice(3, 3 + byteCount);
        let quantityLasts = this._quantity ? this._quantity : 0;

        for (let i = 0; i < byteCount; i++) {

            tmp.readUInt8(i).toString(2).padStart(
                quantityLasts > 8 ? 8 : quantityLasts,
                '0'
            ).split('').forEach((bit) => {
                this._value?.push(
                    parseInt(bit)
                );
            });

            quantityLasts -= 8;
        }
    }

    protected parseReadHoldingRegistersData() {
        this._value = [];
        this._quantity = this._request.quantity;
        this._address = this._request.address;
        const byteCount = this.data.readUInt8(2);
        const tmp: Buffer = this.data.slice(3, 3 + byteCount);

        for (let i = 0; i < byteCount; i+=2) {
            this._value?.push(
                tmp.readUInt16BE(i)
            );
        }
    }

    protected parseWrtieSingleHoldingRegistersData() {
        this._address = this.data.readUInt16BE(2);
        this._value = [
            this.data.readUInt16BE(4)
        ];
    }

    protected parseWrtieMultipleHoldingRegistersData() {
        this.parseWrtieMultipleCoilData();
    }

    protected parseWrtieSingleCoilData() {
        this._address = this.data.readUInt16BE(2);
        this._value = [
            this.data.readUInt16BE(4) === 0xFF00 ? 1 : 0
        ];
    }

    protected parseWrtieMultipleCoilData() {
        this._address = this.data.readUInt16BE(2);
        this._quantity = this.data.readUInt16BE(4);
    }

    toString(): string {
        let frameLog = `[RESPONSE][${FrameDictionary[this.frameCode]}] `;

        switch (this.frameType) {
            case FrameCodes.WRITE_SINGLE_COIL:
            case FrameCodes.WRITE_SINGLE_HOLDING_REGISTER:
                frameLog += `Address: ${this._address}, Value: ${this._value?.join(', ')}`;
                break;
            case FrameCodes.WRITE_MULTIPLE_COILS:
            case FrameCodes.WRITE_MULTIPLE_HOLDING_REGISTERS:
                frameLog += `Address: ${this._address}, Quantity: ${this._quantity}`;
                break;
            case FrameCodes.READ_COIL:
            case FrameCodes.READ_DISCRETE_INPUT:
            case FrameCodes.READ_HOLDING_REGISTERS:
                frameLog += `Address: ${this._address}, Quantity: ${this._quantity}, Value: ${this._value?.join(', ')}`;
                break;
        }

        return frameLog;
    }

    logInfo() {
        console.log(this.toString());
    }
}

