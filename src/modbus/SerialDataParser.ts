import RequestDataFrame from './RequestDataFrame';
import ResponseDataFrame from './ResponseDataFrame';

export default class SerialDataParser {
    static ParseRequest(receivedData: Buffer): RequestDataFrame {
        return new RequestDataFrame(receivedData);
    }

    static ParseResponse(receivedData: Buffer, receivedRequest: RequestDataFrame): ResponseDataFrame {
        return new ResponseDataFrame(receivedData, receivedRequest);
    }
}
