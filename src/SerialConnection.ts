
// Callbacks Type Defs
type ErrorCallback = (error?: Error | null) => void;
type ModemBitsCallback = (error: Error | null | undefined, status: { cts: boolean, dsr: boolean, dcd: boolean }) => void;

// Options Type Defs
interface OpenOptions {
    autoOpen?: boolean | undefined;
    baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number | undefined;
    dataBits?: 8 | 7 | 6 | 5 | undefined;
    highWaterMark?: number | undefined;
    lock?: boolean | undefined;
    stopBits?: 1 | 2 | undefined;
    parity?: 'none' | 'even' | 'mark' | 'odd' | 'space' | undefined;
    rtscts?: boolean | undefined;
    xon?: boolean | undefined;
    xoff?: boolean | undefined;
    xany?: boolean | undefined;
    binding?: BaseBinding | undefined;
    bindingOptions?: {
        vmin?: number | undefined;
        vtime?: number | undefined;
    } | undefined;
}
interface UpdateOptions {
    baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number | undefined;
}
interface SetOptions {
    brk?: boolean | undefined;
    cts?: boolean | undefined;
    dsr?: boolean | undefined;
    dtr?: boolean | undefined;
    rts?: boolean | undefined;
}

interface PortInfo {
    path: string;
    manufacturer?: string | undefined;
    serialNumber?: string | undefined;
    pnpId?: string | undefined;
    locationId?: string | undefined;
    productId?: string | undefined;
    vendorId?: string | undefined;
}

// declare namespace parsers {
//     class ByteLength extends Stream.Transform {
//         constructor(options: { length: number });
//     }
//     class CCTalk extends Stream.Transform {
//         constructor();
//     }
//     class Delimiter extends Stream.Transform {
//         constructor(options: { delimiter: string | Buffer | number[], includeDelimiter?: boolean | undefined });
//     }
//     class Readline extends Delimiter {
//         constructor(options: { delimiter: string | Buffer | number[], encoding?: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex' | undefined, includeDelimiter?: boolean | undefined });
//     }
//     class Ready extends Stream.Transform {
//         constructor(options: { delimiter: string | Buffer | number[] });
//     }
//     class Regex extends Stream.Transform {
//         constructor(options: { regex: RegExp });
//     }
// }

// Binding Type Defs
type win32Binding = BaseBinding;
type darwinBinding = BaseBinding;
type linuxBinding = BaseBinding;

// Binding Type Def
declare class BaseBinding {
    constructor(options: any);

    open(path: string, options: OpenOptions): Promise<any>;
    close(): Promise<any>;

    read(data: Buffer, offset: number, length: number): Promise<any>;
    write(data: Buffer): Promise<any>;
    update(options?: UpdateOptions): Promise<any>;
    set(options?: SetOptions): Promise<any>;
    get(): Promise<any>;
    flush(): Promise<any>;
    drain(): Promise<any>;
    static list(): Promise<PortInfo[]>;
}

// tslint:disable-next-line: max-classes-per-file
declare class SerialPortClass extends Stream.Duplex {
    static Binding: any;
    static parsers: { ByteLength: any; CCTalk: any; Delimiter: any; InterByteTimeout: any; Readline: any; Ready: any; Regex: any; };
    constructor(path: string, callback?: ErrorCallback);
    constructor(path: string, options?: OpenOptions, callback?: ErrorCallback);

    readonly baudRate: number;
    readonly binding: BaseBinding;
    readonly isOpen: boolean;
    readonly path: string;

    open(callback?: ErrorCallback): void;
    update(options: UpdateOptions, callback?: ErrorCallback): void;

    write(data: string | number[] | Buffer, callback?: (error: Error | null | undefined, bytesWritten: number) => void): boolean;
    write(buffer: string | number[] | Buffer, encoding?: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex', callback?: (error: Error | null | undefined, bytesWritten: number) => void): boolean;

    read(size?: number): string | Buffer | null;

    close(callback?: (error?: Error | null) => void): void;

    set(options: SetOptions, callback?: ErrorCallback): void;
    get(callback?: ModemBitsCallback): void;

    flush(callback?: ErrorCallback): void;
    drain(callback?: ErrorCallback): void;

    pause(): this | any;
    resume(): this | any;

    on(event: string, callback: (data?: any) => void): this | any;

    // static Binding: BaseBinding;

    static list(): Promise<PortInfo[]>;
}

// tslint:disable-next-line: no-var-requires
const SerialPort: typeof SerialPortClass = require('@serialport/stream');
import { default as Binding } from '@serialport/bindings';
import { Stream } from 'stream';


SerialPort.Binding = Binding
SerialPort.parsers = {
    ByteLength: require('@serialport/parser-byte-length'),
    CCTalk: require('@serialport/parser-cctalk'),
    Delimiter: require('@serialport/parser-delimiter'),
    InterByteTimeout: require('@serialport/parser-inter-byte-timeout'),
    Readline: require('@serialport/parser-readline'),
    Ready: require('@serialport/parser-ready'),
    Regex: require('@serialport/parser-regex'),
}
// tslint:disable-next-line: max-classes-per-file
export default class SerialConnection extends SerialPort {
    constructor(path: string, options: OpenOptions = { baudRate: 9600 }) {
        super(
            path,
            options,
            (error) => {
                if (typeof error === 'undefined' || error === null) {
                    return;
                }
                console.log(error);
                process.exit(1)
            }
        )
    }
};
