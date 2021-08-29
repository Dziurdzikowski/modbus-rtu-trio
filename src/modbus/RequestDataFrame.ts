import { FrameCodes, FrameDictionary } from './FrameConstant'

export default class RequestDataFrame {
    readonly frameLength: number;
    readonly frameCode: number;
    readonly frameType: FrameCodes;

    private data: Buffer;
    private _value?: number[];
    private _slaveID?: number;
    private _address?: number;
    private _quantity?: number;

    constructor(receivedData: Buffer) {
        this.frameLength = receivedData.length;
        this.data = receivedData;
        this._slaveID = receivedData.readUInt8(0);
        this.frameCode = receivedData.readUInt8(1);

        switch (this.frameCode) {
            case FrameCodes.READ_COIL:
                this.frameType = FrameCodes.READ_COIL;
                this.baseReadParse();
                break;
            case FrameCodes.WRITE_SINGLE_COIL:
                this.frameType = FrameCodes.WRITE_SINGLE_COIL;
                this.parseWriteSingleCoilData();
                break;
            case FrameCodes.WRITE_MULTIPLE_COILS:
                this.frameType = FrameCodes.WRITE_MULTIPLE_COILS;
                this.parseWriteMultipleCoilData();
                break;
            case FrameCodes.READ_DISCRETE_INPUT:
                this.frameType = FrameCodes.READ_DISCRETE_INPUT;
                this.baseReadParse();
                break;
            case FrameCodes.READ_HOLDING_REGISTERS:
                this.frameType = FrameCodes.READ_HOLDING_REGISTERS;
                this.baseReadParse();
                break;
            case FrameCodes.WRITE_SINGLE_HOLDING_REGISTER:
                this.frameType = FrameCodes.WRITE_SINGLE_HOLDING_REGISTER;
                this.parseSingleWriteHoldingRegisterData();
                break;
            case FrameCodes.WRITE_MULTIPLE_HOLDING_REGISTERS:
                this.frameType = FrameCodes.WRITE_MULTIPLE_HOLDING_REGISTERS;
                this.parseMultiWriteHoldingRegisterData();
                break;
            default:
                this.frameType = FrameCodes.UNKOWN;
                break;
        }
    }

    get quantity() {
        return this._quantity;
    }

    get value() {
        return this._value;
    }

    get address() {
        return this._address;
    }

    get slaveID() {
        return this._slaveID;
    }

    protected parseMultiWriteHoldingRegisterData() {
        this._value = [];
        this._address = this.data.readUInt16BE(2);
        const bytesQuantity = this.data.readUInt8(6)

        const tmpBuf = this.data.slice(7, 7 + bytesQuantity);
        this._quantity = Math.floor(tmpBuf?.length / 2)

        for (let i = 0; i < this._quantity; i++) {
            this._value.push(
                tmpBuf.readUInt16BE(
                    i * 2
                )
            );
        }
    }

    protected parseSingleWriteHoldingRegisterData() {
        this._address = this.data.readUInt16BE(2);
        this._value = [this.data.readUInt16BE(4)];
    }

    protected baseReadParse() {
        this._address = this.data.readUInt16BE(2);
        this._quantity = this.data.readUInt16BE(4);
    }

    protected parseWriteSingleCoilData() {
        this._address = this.data.readUInt16BE(2);
        const tmp = this.data.readUInt16BE(4);
        this._value = [
            (tmp === 0xFF ? 1 : 0)
        ];
    }

    protected parseWriteMultipleCoilData() {
        this._value = [];
        this._address = this.data.readUInt16BE(2);
        this._quantity = this.data.readUInt16BE(4);
        const bytesQuantity = this.data.readUInt8(6)
        const tmp: Buffer = this.data.slice(7, 7 + bytesQuantity);
        let quantityLasts = this._quantity;

        for (let i = 0; i < bytesQuantity; i++) {

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

    toString(): string {
        let frameLog = `[REQUEST][${FrameDictionary[this.frameCode]}]`;

        switch (this.frameType) {
            case FrameCodes.WRITE_SINGLE_COIL:
            case FrameCodes.WRITE_SINGLE_HOLDING_REGISTER:
                const value = (this._value as number[])[0];
                frameLog += ` Address: ${this._address}, Value: ${value.toString()}`;
                break;
            case FrameCodes.READ_COIL:
            case FrameCodes.READ_DISCRETE_INPUT:
            case FrameCodes.READ_HOLDING_REGISTERS:
                frameLog += ` Address: ${this._address}, Quantity: ${this._quantity}`;
                break;
            case FrameCodes.WRITE_MULTIPLE_COILS:
            case FrameCodes.WRITE_MULTIPLE_HOLDING_REGISTERS:
                frameLog += ` Address: ${this._address}, Quantity: ${this._quantity}, Value: ${this._value?.join(', ')}`;
                break;
        }

        return frameLog;
    }

    logInfo(): void {
        console.log(
            this.toString()
        );
    }
}

