import config from "@data/config";
import { parsePersonDetails } from "@utils/parse";
import { err, success } from "@utils/trace";
import axios from "axios";

export const getPersonDetails = async (actorId: number) => {
    const url = `${config.baseUrl}person/${actorId}${config.key}&append_to_response=movie_credits,tv_credits`;

    const detailsResp = await axios.get(url).catch(err);
    let parsedResp;

    if (detailsResp) {
        parsedResp = parsePersonDetails(detailsResp.data);
    }

    return parsedResp;
}