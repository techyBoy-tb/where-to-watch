import config from "@data/config";
import { err, success } from "@utils/trace";
import axios from "axios";
import { parseEpisode, parseShowDetails } from "@utils/parse";
import { Episode, ShowDetails } from "@utils/types";

export const getShowDetails = async (showId: number) => {
    const url = `${config.baseUrl}tv/${showId}${config.key}&append_to_response=watch/providers`;

    const showDetailsResp = await axios.get(url).catch(err);
    let parsedResp;

    if (showDetailsResp) {
        parsedResp = parseShowDetails(showDetailsResp.data)
    }

    return parsedResp;
}

export const getPopularShows = async () => {
    const url = `${config.baseUrl}tv/popular${config.key}&language=en-GB&page=1`;

    const showDetailsResp = await axios.get(url).catch(err);
    const parsedResp: ShowDetails[] = [];

    if (showDetailsResp) {
        showDetailsResp.data.results.forEach((movie: any) => {
            parsedResp.push(parseShowDetails(movie))
        })
    }

    return parsedResp;
}

export const getUpcomingShows = async () => {
    const url = `${config.baseUrl}tv/on_the_air${config.key}&language=en-GB&page=1`;

    const showDetailsResp = await axios.get(url).catch(err);
    const parsedResp: ShowDetails[] = [];

    if (showDetailsResp) {
        showDetailsResp.data.results.forEach((movie: any) => {
            parsedResp.push(parseShowDetails(movie))
        })
    }

    return parsedResp;
}

export const getTopRatedShows = async () => {
    const url = `${config.baseUrl}tv/top_rated${config.key}&language=en-GB&page=1`;

    const showDetailsResp = await axios.get(url).catch(err);
    const parsedResp: ShowDetails[] = [];

    if (showDetailsResp) {
        showDetailsResp.data.results.forEach((movie: any) => {
            parsedResp.push(parseShowDetails(movie))
        })
    }

    return parsedResp;
}

export const getEpisodes = async (showId: number, seasonNumber: number) => {
    const url = `${config.baseUrl}tv/${showId}/season/${seasonNumber}${config.key}&language=en-GB&page=1`;

    const episodeResp = await axios.get(url).catch(err);
    const parsedResp: Episode[] = [];

    if (episodeResp) {
        episodeResp.data.episodes.forEach((episode: any) => {
            parsedResp.push(parseEpisode(episode))
        })
    }

    return parsedResp;
}

export const getShowCredits = async (personId: number) => {
    const url = `${config.baseUrl}person/${personId}/tv_credits${config.key}&language=en-GB&page=1`;

    const episodeResp = await axios.get(url).catch(err);
    const parsedResp: Episode[] = [];

    if (episodeResp) {
        episodeResp.data.episodes.forEach((episode: any) => {
            parsedResp.push(parseEpisode(episode))
        })
    }

    return parsedResp;
}