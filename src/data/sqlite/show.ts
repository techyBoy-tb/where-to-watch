import { MediaType, ShowDetails } from "@utils/types"
import { transactRead, transactWrite } from ".";
import {
    err,
    log,
    success,
    warn
} from "@utils/trace";

export const getFavouriteShowsFromDb = async () => {
    try {
        const response = await transactRead(
            'SELECT * FROM liked_shows ORDER BY createdAt DESC'
        );

        const parsedResp: ShowDetails[] = response.map(resp => {
            return {
                ...resp,
                adult: resp.video === 'true',
                episodeRuntime: JSON.parse(resp.episodeRuntime),
                genres: JSON.parse(resp.genres),
                seasons: JSON.parse(resp.seasons),
                providers: JSON.parse(resp.providers),
                mediaType: MediaType['show'],
            }
        })

        return parsedResp;

        // 
    } catch (e) {
        err('[sqlite]', 'getFavouriteShowsFromDb()');
        log(e)
    }
}

export const addFavouriteShowToDb = async (show: ShowDetails) => {
    const {
        adult,
        id,
        overview,
        popularity,
        posterPath,
        providers,
        backdropPath,
        episodeRuntime,
        firstAirDate,
        genres,
        lastAirDate,
        name,
        numberOfEpisodes,
        numberOfSeasons,
        originalName,
        seasons,
        status,
        tagline,
        type,
        voteAverage,
        voteCount,
        inProduction,
    } = show

    try {
        await transactWrite(
            `INSERT INTO liked_shows
        (
            id,
            overview,
            adult,
            backdropPath,
            episodeRuntime,
            firstAirDate,
            genres,
            inProduction,
            lastAirDate,
            numberOfEpisodes,
            numberOfSeasons,
            originalName,
            name,
            popularity,
            posterPath,
            seasons,
            status,
            tagline,
            type,
            voteAverage,
            voteCount,
            providers,
            createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
                id,
                overview,
                `${adult}`,
                backdropPath,
                JSON.stringify(episodeRuntime),
                firstAirDate,
                JSON.stringify(genres),
                `${inProduction}`,
                lastAirDate,
                numberOfEpisodes,
                numberOfSeasons,
                originalName,
                name,
                popularity,
                posterPath,
                JSON.stringify(seasons),
                status,
                tagline,
                type,
                voteAverage,
                voteCount,
                JSON.stringify(providers),
                new Date().toISOString(),
            ]
        );

        success('[sqlite]', 'addFavouriteShowToDb()');
        // 
    } catch (e) {
        err('[sqlite]', 'addFavouriteShowToDb()');
        log(e)
    }
}

export const removeFavouriteShowFromDb = async (showId: number) => {
    try {
        const result = await transactWrite(
            `DELETE from liked_shows where id = ?`,
            [showId],
        );
        if (result.changes) {
            warn(
                '[sqlite]',
                `removeFavouriteShowFromDb('${showId}') ${result.changes} rows deleted`,
            );
            return true;
        }
        return false;
    } catch (e) {
        err('[sqlite]', 'removeFavouriteShowFromDb()');
        log(e);
    }
}