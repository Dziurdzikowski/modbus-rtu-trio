import SerialDataFrame from './SerialDataFrame';
import RequestDataFrame from './RequestDataFrame';

export default class SerialDataParser {
    static ParseDate(receivedData: Buffer): SerialDataFrame {
        return new SerialDataFrame(receivedData);
    }

    static ParseRequest(receivedData: Buffer): RequestDataFrame {
        return new RequestDataFrame(receivedData);
    }
}
