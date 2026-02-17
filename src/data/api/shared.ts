import config from "@data/config"
import axios from "axios";
import { MultiListResponse } from "@utils/types";
import { err, success } from "@utils/trace";
import { parseMultiListResponse } from "@utils/parse";

export const searchMulti = async (searchTerm: string) => {
    const url = `${config.baseUrl}search/multi${config.key}&language=en-GB&page=1&query=${searchTerm}`;

    const searchResp = await axios.get(url).catch(err);

    let parsedResp: MultiListResponse | undefined = undefined;
    if (searchResp) {
        parsedResp = parseMultiListResponse(searchResp.data)
    }

    return parsedResp
}