import { MediaType, PersonDetails } from "@utils/types"
import { transactRead, transactWrite } from ".";
import {
    err,
    log,
    success,
    warn
} from "@utils/trace";

export const getFavouritePeopleFromDb = async () => {
    try {
        const response = await transactRead(
            'SELECT * FROM liked_people ORDER BY createdAt DESC'
        );

        const parsedResp: PersonDetails[] = response.map(resp => {
            return {
                ...resp,
                adult: resp.adult === 'true',
                alsoKnownAs: JSON.parse(resp.alsoKnownAs),
                movieCredits: JSON.parse(resp.movieCredits),
                showCredits: JSON.parse(resp.showCredits),
                mediaType: MediaType['person'],
            }
        })

        return parsedResp;

        //
    } catch (e) {
        err('[sqlite]', 'getFavouritePeopleFromDb()');
        log(e)
    }
}

export const addFavouritePersonToDb = async (person: PersonDetails) => {
    const {
        id,
        name,
        adult,
        alsoKnownAs,
        biography,
        birthday,
        deathDay,
        gender,
        imdbId,
        knownForDepartment,
        birthplace,
        popularity,
        posterPath,
        movieCredits,
        showCredits,
    } = person

    try {
        await transactWrite(
            `INSERT INTO liked_people
        (
            id,
            name,
            adult,
            alsoKnownAs,
            biography,
            birthday,
            deathDay,
            gender,
            imdbId,
            knownForDepartment,
            birthplace,
            popularity,
            posterPath,
            movieCredits,
            showCredits,
            createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
            [
                id,
                name,
                `${adult}`,
                JSON.stringify(alsoKnownAs),
                biography,
                birthday,
                deathDay ?? "",
                gender,
                imdbId,
                knownForDepartment,
                birthplace,
                popularity,
                posterPath,
                JSON.stringify(movieCredits),
                JSON.stringify(showCredits),
                new Date().toISOString(),
            ]
        );

        success('[sqlite]', 'addFavouritePersonToDb()');
        //
    } catch (e) {
        err('[sqlite]', 'addFavouritePersonToDb()');
        log(e)
    }
}

export const removeFavouritePersonFromDb = async (personId: number) => {
    try {
        const result = await transactWrite(
            `DELETE from liked_people where id = ?`,
            [personId],
        );
        if (result.changes) {
            warn(
                '[sqlite]',
                `removeFavouritePersonFromDb('${personId}') ${result.changes} rows deleted`,
            );
            return true;
        }
        return false;
    } catch (e) {
        err('[sqlite]', 'removeFavouritePersonFromDb()');
        log(e);
    }
}
