import config from "@data/config"
import { parseMovieDetails } from "@utils/parse";
import { err } from "@utils/trace";
import { MovieDetails } from "@utils/types";
import axios from "axios";
import { getCredits } from "./credit";

export const getMovieDetails = async (movieId: number) => {
    const url = `${config.baseUrl}movie/${movieId}${config.key}&append_to_response=watch/providers`;

    const movieDetailsResp = await axios.get(url).catch(err);
    let parsedResp;

    if (movieDetailsResp) {
        parsedResp = parseMovieDetails(movieDetailsResp.data)
    }

    return parsedResp;
}

export const getPopularMovies = async () => {
    const url = `${config.baseUrl}movie/popular${config.key}&language=en-GB&page=1`;

    const movieDetailsResp = await axios.get(url).catch(err);
    const parsedResp: MovieDetails[] = [];

    if (movieDetailsResp) {
        movieDetailsResp.data.results.forEach((movie: any) => {
            parsedResp.push(parseMovieDetails(movie))
        })
    }

    return parsedResp;
}

export const getUpcomingMovies = async () => {
    const url = `${config.baseUrl}movie/upcoming${config.key}&language=en-GB&page=1`;

    const movieDetailsResp = await axios.get(url).catch(err);
    const parsedResp: MovieDetails[] = [];

    if (movieDetailsResp) {
        movieDetailsResp.data.results.forEach((movie: any) => {
            parsedResp.push(parseMovieDetails(movie))
        })
    }

    return parsedResp;
}

export const getTopRatedMovies = async () => {
    const url = `${config.baseUrl}movie/top_rated${config.key}&language=en-GB&page=1`;

    const movieDetailsResp = await axios.get(url).catch(err);
    const parsedResp: MovieDetails[] = [];

    if (movieDetailsResp) {
        movieDetailsResp.data.results.forEach((movie: any) => {
            parsedResp.push(parseMovieDetails(movie))
        })
    }

    return parsedResp;
}

export const getDirector = async (movieId: number) => {
    const credits = await getCredits(movieId, false);
    const foundDirector = credits?.crew.find(({ job }) => job === 'Director');

    return foundDirector;
}