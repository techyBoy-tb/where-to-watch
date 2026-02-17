import { MediaType, MovieDetails } from "@utils/types"
import { transactRead, transactWrite } from ".";
import {
    err,
    log,
    success,
    warn
} from "@utils/trace";

export const getFavouriteMoviesFromDb = async () => {
    try {
        const response = await transactRead(
            'SELECT * FROM liked_movies ORDER BY createdAt DESC'
        );

        const parsedResp: MovieDetails[] = response.map(resp => {
            return {
                ...resp,
                genreIds: JSON.parse(resp.genreIds),
                providers: JSON.parse(resp.providers),
                video: resp.video === 'true',
                adult: resp.video === 'true',
                mediaType: MediaType['movie'],
            }
        })

        return parsedResp;

        // 
    } catch (e) {
        err('[sqlite]', 'getFavouriteMoviesFromDb()');
        log(e)
    }
}

export const addFavouriteMovieToDb = async (movie: MovieDetails) => {
    const {
        adult,
        averageVote,
        genreIds,
        id,
        numberOfVotes,
        originalTitle,
        overview,
        popularity,
        posterPath,
        title,
        video,
        providers,
        releaseDate
    } = movie

    try {
        await transactWrite(
            `INSERT INTO liked_movies
        (
            id,
            title,
            originalTitle,
            overview,
            posterPath,
            genreIds,
            popularity,
            releaseDate,
            video,
            adult,
            averageVote,
            numberOfVotes,
            providers,
            createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
            [
                id,
                title,
                originalTitle,
                overview,
                posterPath,
                JSON.stringify(genreIds),
                popularity,
                releaseDate ?? "",
                `${video}`,
                `${adult}`,
                averageVote,
                numberOfVotes,
                JSON.stringify(providers),
                new Date().toISOString(),
            ]
        );

        success('[sqlite]', 'addFavouriteMovieToDb()');
        // 
    } catch (e) {
        err('[sqlite]', 'addFavouriteMovieToDb()');
        log(e)
    }
}

export const removeFavouriteMovieFromDb = async (movieId: number) => {
    try {
        const result = await transactWrite(
            `DELETE from liked_movies where id = ?`,
            [movieId],
        );
        if (result.changes) {
            warn(
                '[sqlite]',
                `removeFavouriteMovieFromDb('${movieId}') ${result.changes} rows deleted`,
            );
            return true;
        }
        return false;
    } catch (e) {
        err('[sqlite]', 'removeFavouriteMovieFromDb()');
        log(e);
    }
}