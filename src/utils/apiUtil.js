import StorageUtil from "utils/storageUtil";
import DateUtil from "utils/dateUtil";
import { Platform } from "react-native";

export default class ApiUtil {

    /**
     * Get header api 
     */
    static getHeader() {
        let header = new Headers({
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'X-APITOKEN': global.token,
            'X-CLIENT-TIME': DateUtil.parseNow(DateUtil.FORMAT_DATE_TIME_ZONE),
            'X-PLATFORM' : Platform.OS,
            'X-DEVICE-ID': global.deviceId,
            'X-APP-TYPE' : global.bundleId
        })
        console.log('API header', header)
        return header
    }

    /**
     * Get header api tenor
     */
    static getHeaderTenor() {
        let header = new Headers({
            "Accept": "application/json",
            'Content-Type': 'application/json'
        })
        console.log('API header', header)
        return header
    }
}