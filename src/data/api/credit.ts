import config from "@data/config";
import { parseCredit } from "@utils/parse";
import { success } from "@utils/trace";
import { Credit } from "@utils/types";
import axios from "axios";

export const getCredits = async (id: number, isTvShow: boolean): Promise<Credit | undefined> => {
    const endPoint = isTvShow ? `tv/${id}/credits` : `movie/${id}/credits`;
    const url = `${config.baseUrl}${endPoint}${config.key}`;

    try {
        const creditResp = await axios.get<string>(url, {
            // responseType: 'text', // ensure we get the raw text to pass to creditFromJson
        });

        let parsedCredit: Credit | undefined = undefined;

        if (creditResp) {
            parsedCredit = parseCredit(creditResp.data);
        }

        return parsedCredit;

    } catch (error) {
        console.error('Failed to load credits', error);
        throw new Error('Failed to load credits');
    }
};