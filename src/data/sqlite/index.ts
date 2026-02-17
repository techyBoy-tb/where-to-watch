/**
 *
 * DO NOT IMPORT FROM OTHER FILES THAT IMPORT THE transact() FUNCTION!
 *
 * What that would do is create an import loop – which is bad.
 *
 * If you need to use the transact() function for any new features you are
 *  building, just code that feature as a function _in this file_.
 *
 */
import * as SQLite from 'expo-sqlite';

import { err, info, log, success } from '@utils/trace';
import { version } from '../../../package.json';

let db: SQLite.SQLiteDatabase | undefined;

export const databaseFile = 'moviedb.db';

/**
 * Create & connect to the SQLite database
 */
export const initialiseDatabase = async () => {
    // Running this will delete the database file
    // await nuke();

    info('[sqlite] Opening database');
    db = await SQLite.openDatabaseAsync(databaseFile);

    success('THIS IS THE PLACE', db.databasePath);

    await createTables();

    // Your app's migrations
    await upsertCurrentVersion(version);
};

/**
 * Execute a SQL WRITE query
 * Returns SqliteRunResult (insert/update/delete)
 */
export const transactWrite = async (
    sql: string,
    args?: (string | number)[]
): Promise<SQLite.SQLiteRunResult> => {
    if (!db) throw new Error("The database has not been initialised");

    try {
        return await db.runAsync(sql, args ?? []);
    } catch (error) {
        err(`SQLite error for: ${sql}`);
        log(error);
        throw error;
    }
};

/**
 * Execute a SQL READ query
 * Returns T
 */
export const transactRead = async <T = any>(
    sql: string,
    args?: (string | number)[]
): Promise<T[]> => {
    if (!db) throw new Error("The database has not been initialised");

    try {
        return await db.getAllAsync<T>(sql, args ?? []);
    } catch (error) {
        err(`SQLite SELECT error for: ${sql}`);
        log(error);
        throw error;
    }
};

/**
 * Delete the database
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nuke = async () => {
    err('');
    err('');
    err('☢️  Nuking database', databaseFile);

    await SQLite.deleteDatabaseAsync(databaseFile);

    err('');
    err('');
    throw new Error('Nuked! Please uncomment the nuke()');
};


const createTables = async () => {
    // Create `settings` table
    await transactWrite(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT UNIQUE,
      value TEXT
    );
  `); // keep types.ts updated!

    /**
     * Note: Here providers, genreIds & releaseDate are all STRINGIFIED
     */
    // Create `active_session` table
    await transactWrite(`
    CREATE TABLE IF NOT EXISTS liked_movies (
      id INT PRIMARY KEY NOT NULL,
      title TEXT,
      originalTitle TEXT,
      overview TEXT,
      posterPath TEXT,
      backdropPath TEXT,
      genreIds TEXT, 
      popularity REAL,
      releaseDate TEXT,
      video BOOL,
      runtime INT,
      adult BOOL,
      averageVote REAL,
      numberOfVotes INT,
      providers TEXT,
      createdAt REAL
    );
  `); // keep types.ts updated!

    /**
   * Note: Here providers, genres & seasons are all STRINGIFIED
   * lastEpisodeToAir should be the NAME of the episode
   */
    // Create `active_session` table
    await transactWrite(`
    CREATE TABLE IF NOT EXISTS liked_shows (
      id INT PRIMARY KEY NOT NULL,
      adult BOOL,
      overview TEXT,
      backdropPath TEXT,
      episodeRuntime TEXT,
      firstAirDate TEXT,
      genres TEXT, 
      inProduction BOOL,
      lastAirDate TEXT,
      numberOfEpisodes INT,
      numberOfSeasons INT,
      originalName TEXT,
      name TEXT,
      popularity REAL,
      posterPath TEXT,
      seasons TEXT,
      status TEXT,
      tagline TEXT,
      type TEXT,
      voteAverage REAL,
      voteCount INT,
      providers TEXT,
      createdAt REAL
    );
  `); // keep types.ts updated!

    /**
   * Note: Here alsoKnownAs, movieCredits & showCredits are all STRINGIFIED
   */
    // Create `liked_people` table
    await transactWrite(`
    CREATE TABLE IF NOT EXISTS liked_people (
      id INT PRIMARY KEY NOT NULL,
      name TEXT,
      adult BOOL,
      alsoKnownAs TEXT,
      biography TEXT,
      birthday TEXT,
      deathDay TEXT,
      gender TEXT,
      imdbId TEXT,
      knownForDepartment TEXT,
      birthplace TEXT,
      popularity REAL,
      posterPath TEXT,
      movieCredits TEXT,
      showCredits TEXT,
      createdAt REAL
    );
  `); // keep types.ts updated!
};

const upsertCurrentVersion = async (version: string) => {
    try {
        await transactWrite(
            `
      INSERT OR REPLACE
        INTO settings (key, value)
        VALUES ('version', ?)
    `,
            [version],
        );

        //
    } catch (e) {
        err('upsertCurrentVersion()');
        log(e);
    }
};

// #region Migrations

// -> Put schema migrations in functions here
//     and REMEMBER TO UPDATE THE SCHEMAS ABOVE WITH ALL CHANGES!

// #endregion Migrations
