import { FrameCodes, FrameDictionary } from './FrameConstant'

export default class SerialDataFrame {
    readonly frameLength: number;
    readonly frameCode: number;
    readonly frameType: FrameCodes;

    private data: Buffer;
    private _value?: number[];
    private _deviceID?: number;
    private _address?: number;
    private _quantity?: number;
    private isResponse: boolean;

    constructor(receivedData: Buffer) {
        this.frameLength = receivedData.length;
        this.data = receivedData;
        this._deviceID = receivedData.readUInt8(0);
        this.frameCode = receivedData.readUInt8(1);
        this.isResponse = false;

        switch (this.frameCode) {
            case FrameCodes.READ_COIL:
                this.frameType = FrameCodes.READ_COIL;
                this.parseReadCoilData();
                break;
            default:
                this.frameType = FrameCodes.UNKOWN;
                break;
        }
    }

    protected parseReadCoilData() {
        if (this.frameLength === 5) {
            this.parseReadCoilDataRequest();
        } else {
            this.isResponse = true;
            this.parseReadCoilDataResponse();
        }
    }

    protected parseReadCoilDataRequest() {
        this._address = this.data.readUInt16BE(1);
        this._quantity = this.data.readUInt16BE(3);
    }

    protected parseReadCoilDataResponse() {
        this._quantity = this.data.readUInt8(1);
        this._value = [];
        const bytesQuantity: number = parseInt((this._quantity / 8).toString()) + ((this._quantity % 8) > 0 ? 1 : 0);
        const tmp: Buffer = this.data.slice(2, 2 + bytesQuantity);
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

            quantityLasts -= 8;
        }

        this._value = this._value
    }

    toString(): string {
        let frameLog = `[${FrameDictionary[this.frameCode]}]`;
        frameLog += `[${this.isResponse ? 'RESPONSE' : 'REQUEST'}]`;

        switch (this.frameType) {
            case FrameCodes.READ_COIL:
                if (this.isResponse) {
                    frameLog += ` Quantity: ${this._quantity}, Value: ${this._value?.join(', ')}`;
                }
        }
        // console.log(
        //     `${ this.} `
        // )
        return frameLog;
    }
}

