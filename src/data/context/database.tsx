import {
  getFavouriteMoviesFromDb,
  addFavouriteMovieToDb,
  removeFavouriteMovieFromDb
} from '@data/sqlite/movie';
import {
  getFavouriteShowsFromDb,
  addFavouriteShowToDb,
  removeFavouriteShowFromDb,
} from '@data/sqlite/show';
import {
  getFavouritePeopleFromDb,
  addFavouritePersonToDb,
  removeFavouritePersonFromDb,
} from '@data/sqlite/person';
import { transactWrite } from '@data/sqlite';
import {
  getFavouriteMoviesFromFirestore,
  addFavouriteMovieToFirestore,
  removeFavouriteMovieFromFirestore,
  getFavouriteShowsFromFirestore,
  addFavouriteShowToFirestore,
  removeFavouriteShowFromFirestore,
  getFavouritePeopleFromFirestore,
  addFavouritePersonToFirestore,
  removeFavouritePersonFromFirestore,
  syncAllToFirestore,
  getSyncStatus,
  SyncStatus,
  getMergeData,
} from '@data/firebase/firestore';
import { MovieDetails, PersonDetails, ShowDetails } from '@utils/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { authContext } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { err, log, info, success } from '@utils/trace';

interface DatabaseContext {
  favouriteMovies: MovieDetails[];
  favouriteShows: ShowDetails[];
  favouritePeople: PersonDetails[];
  //
  addFavouriteMovie: (movie: MovieDetails) => Promise<void>;
  addFavouriteShow: (show: ShowDetails) => Promise<void>;
  addFavouritePerson: (person: PersonDetails) => Promise<void>;
  //
  removeFavouriteMovie: (id: number) => Promise<void>;
  removeFavouriteShow: (id: number) => Promise<void>;
  removeFavouritePerson: (id: number) => Promise<void>;
  //
  refresh: () => Promise<void>;
  syncWithCloud: () => Promise<boolean>;
  loadFromCloud: () => Promise<boolean>;
  bidirectionalSync: () => Promise<boolean>;
  getSyncStatusData: () => Promise<SyncStatus | undefined>;
  syncStatus?: SyncStatus;
  lastSyncDate?: Date;
  //
  wipeDatabase: () => Promise<void>;
}

export const databaseContext = React.createContext<DatabaseContext>({
  favouriteMovies: [],
  favouriteShows: [],
  favouritePeople: [],
  //
  addFavouriteMovie: () => Promise.resolve(),
  addFavouriteShow: () => Promise.resolve(),
  addFavouritePerson: () => Promise.resolve(),
  //
  removeFavouriteMovie: () => Promise.resolve(),
  removeFavouriteShow: () => Promise.resolve(),
  removeFavouritePerson: () => Promise.resolve(),
  //
  refresh: () => Promise.resolve(),
  syncWithCloud: () => Promise.resolve(false),
  loadFromCloud: () => Promise.resolve(false),
  bidirectionalSync: () => Promise.resolve(false),
  getSyncStatusData: () => Promise.resolve(undefined),
  //
  wipeDatabase: () => Promise.resolve(),
});

const { Provider } = databaseContext;

interface Props {
  children?: React.ReactNode;
}

export const DatabaseProvider: React.FC<Props> = ({ children }) => {
  const { user } = useContext(authContext);

  const [hasInit, setHasInit] = useState(false);
  const [favouriteMovies, setFavouriteMovies] = useState<MovieDetails[]>([]);
  const [favouriteShows, setFavouriteShows] = useState<ShowDetails[]>([]);
  const [favouritePeople, setFavouritePeople] = useState<PersonDetails[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>();
  const [lastSyncDate, setLastSyncDate] = useState<Date>();
  const [hasAutoSynced, setHasAutoSynced] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const lastSync = await AsyncStorage.getItem('last-sync-date');
        if (lastSync) {
          setLastSyncDate(new Date(lastSync));
        }
      } catch (e) {
        err('[databaseContext]', 'Failed to load last sync date');
        log(e);
      }
      getDatabaseInfo();
      setHasInit(true);
    }

    if (!hasInit) {
      init();
    }
  }, []);

  // Bidirectional sync - merges local and cloud data
  const bidirectionalSync = useCallback(async (): Promise<boolean> => {
    if (!user?.uid) {
      return false;
    }

    try {
      info('[databaseContext]', 'Starting bidirectional sync...');

      // Get merge data (what needs to be uploaded/downloaded)
      const mergeData = await getMergeData(user.uid, favouriteMovies, favouriteShows, favouritePeople);

      if (!mergeData) {
        err('[databaseContext]', 'Failed to get merge data');
        return false;
      }

      // Upload items to Firestore that don't exist in cloud
      if (mergeData.moviesToUpload.length > 0) {
        info('[databaseContext]', `Uploading ${mergeData.moviesToUpload.length} movies to cloud`);
        for (const movie of mergeData.moviesToUpload) {
          await addFavouriteMovieToFirestore(user.uid, movie);
        }
      }

      if (mergeData.showsToUpload.length > 0) {
        info('[databaseContext]', `Uploading ${mergeData.showsToUpload.length} shows to cloud`);
        for (const show of mergeData.showsToUpload) {
          await addFavouriteShowToFirestore(user.uid, show);
        }
      }

      if (mergeData.peopleToUpload.length > 0) {
        info('[databaseContext]', `Uploading ${mergeData.peopleToUpload.length} people to cloud`);
        for (const person of mergeData.peopleToUpload) {
          await addFavouritePersonToFirestore(user.uid, person);
        }
      }

      // Download items from Firestore that don't exist locally
      if (mergeData.moviesToDownload.length > 0) {
        info('[databaseContext]', `Downloading ${mergeData.moviesToDownload.length} movies from cloud`);
        for (const movie of mergeData.moviesToDownload) {
          await addFavouriteMovieToDb(movie);
        }
      }

      if (mergeData.showsToDownload.length > 0) {
        info('[databaseContext]', `Downloading ${mergeData.showsToDownload.length} shows from cloud`);
        for (const show of mergeData.showsToDownload) {
          await addFavouriteShowToDb(show);
        }
      }

      if (mergeData.peopleToDownload.length > 0) {
        info('[databaseContext]', `Downloading ${mergeData.peopleToDownload.length} people from cloud`);
        for (const person of mergeData.peopleToDownload) {
          await addFavouritePersonToDb(person);
        }
      }

      // Update local state with merged data
      setFavouriteMovies(mergeData.allMovies);
      setFavouriteShows(mergeData.allShows);
      setFavouritePeople(mergeData.allPeople);

      // Update sync date
      const now = new Date();
      await AsyncStorage.setItem('last-sync-date', now.toISOString());
      setLastSyncDate(now);

      // Refresh sync status
      await getSyncStatusData();

      success('[databaseContext]', 'Bidirectional sync completed successfully');
      return true;
    } catch (e) {
      err('[databaseContext]', 'Bidirectional sync failed');
      log(e);
      return false;
    }
  }, [user, favouriteMovies, favouriteShows, favouritePeople]);

  // Auto-sync when user logs in
  useEffect(() => {
    async function performAutoSync() {
      if (user?.uid && hasInit && !hasAutoSynced) {
        info('[databaseContext]', 'User logged in - performing automatic bidirectional sync');
        setHasAutoSynced(true);
        await bidirectionalSync();
      }
    }

    performAutoSync();
  }, [user?.uid, hasInit, hasAutoSynced, bidirectionalSync]);

  // Reset auto-sync flag when user logs out
  useEffect(() => {
    if (!user?.uid) {
      setHasAutoSynced(false);
    }
  }, [user?.uid]);

  const getDatabaseInfo = useCallback(async () => {
    const foundMovies = await getFavouriteMoviesFromDb();
    if (foundMovies) {
      setFavouriteMovies(foundMovies);
    }

    const foundShows = await getFavouriteShowsFromDb();
    if (foundShows) {
      setFavouriteShows(foundShows);
    }

    const foundPeople = await getFavouritePeopleFromDb();
    if (foundPeople) {
      success("This is the found people", foundPeople);
      setFavouritePeople(foundPeople);
    }
  }, []);

  const addFavouriteMovie = useCallback(async (movie: MovieDetails) => {
    // Always save to local SQLite
    await addFavouriteMovieToDb(movie);

    // Also save to Firestore if user is logged in
    if (user?.uid) {
      await addFavouriteMovieToFirestore(user.uid, movie);
    }

    setFavouriteMovies(prev => ([movie, ...prev]));
    await refresh();
  }, [user]);

  const addFavouriteShow = useCallback(async (show: ShowDetails) => {
    // Always save to local SQLite
    await addFavouriteShowToDb(show);

    // Also save to Firestore if user is logged in
    if (user?.uid) {
      await addFavouriteShowToFirestore(user.uid, show);
    }

    setFavouriteShows(prev => ([show, ...prev]));
    await refresh();
  }, [user]);

  const addFavouritePerson = useCallback(async (person: PersonDetails) => {
    // Always save to local SQLite
    await addFavouritePersonToDb(person);

    // Also save to Firestore if user is logged in
    if (user?.uid) {
      await addFavouritePersonToFirestore(user.uid, person);
    }

    setFavouritePeople(prev => ([person, ...prev]));
    await refresh();
  }, [user]);

  const removeFavouriteMovie = useCallback(async (movieId: number) => {
    // Always remove from local SQLite
    await removeFavouriteMovieFromDb(movieId);

    // Also remove from Firestore if user is logged in
    if (user?.uid) {
      await removeFavouriteMovieFromFirestore(user.uid, movieId);
    }

    setFavouriteMovies(prev => (prev.filter(({ id }) => id !== movieId)));
    await refresh();
  }, [user]);

  const removeFavouriteShow = useCallback(async (showId: number) => {
    // Always remove from local SQLite
    await removeFavouriteShowFromDb(showId);

    // Also remove from Firestore if user is logged in
    if (user?.uid) {
      await removeFavouriteShowFromFirestore(user.uid, showId);
    }

    setFavouriteShows(prev => (prev.filter(({ id }) => id !== showId)));
    await refresh();
  }, [user]);

  const removeFavouritePerson = useCallback(async (personId: number) => {
    // Always remove from local SQLite
    await removeFavouritePersonFromDb(personId);

    // Also remove from Firestore if user is logged in
    if (user?.uid) {
      await removeFavouritePersonFromFirestore(user.uid, personId);
    }

    setFavouritePeople(prev => (prev.filter(({ id }) => id !== personId)));
    await refresh();
  }, [user]);

  // Sync local data to Firestore
  const syncWithCloud = useCallback(async (): Promise<boolean> => {
    if (!user?.uid) {
      return false;
    }

    try {
      await syncAllToFirestore(user.uid, favouriteMovies, favouriteShows, favouritePeople);
      const now = new Date();
      await AsyncStorage.setItem('last-sync-date', now.toISOString());
      setLastSyncDate(now);
      return true;
    } catch (e) {
      return false;
    }
  }, [user, favouriteMovies, favouriteShows, favouritePeople]);

  // Load data from Firestore and merge with local
  const loadFromCloud = useCallback(async (): Promise<boolean> => {
    if (!user?.uid) {
      return false;
    }

    try {
      const cloudMovies = await getFavouriteMoviesFromFirestore(user.uid);
      const cloudShows = await getFavouriteShowsFromFirestore(user.uid);
      const cloudPeople = await getFavouritePeopleFromFirestore(user.uid);

      // Merge cloud data with local data (cloud takes precedence)
      if (cloudMovies) {
        setFavouriteMovies(cloudMovies);
        // Optionally sync to local SQLite
        for (const movie of cloudMovies) {
          await addFavouriteMovieToDb(movie);
        }
      }

      if (cloudShows) {
        setFavouriteShows(cloudShows);
        // Optionally sync to local SQLite
        for (const show of cloudShows) {
          await addFavouriteShowToDb(show);
        }
      }

      if (cloudPeople) {
        setFavouritePeople(cloudPeople);
        // Optionally sync to local SQLite
        for (const person of cloudPeople) {
          await addFavouritePersonToDb(person);
        }
      }

      return true;
    } catch (e) {
      return false;
    }
  }, [user]);

  // Get sync status
  const getSyncStatusData = useCallback(async (): Promise<SyncStatus | undefined> => {
    if (!user?.uid) {
      return undefined;
    }

    try {
      const status = await getSyncStatus(user.uid, favouriteMovies, favouriteShows, favouritePeople);
      setSyncStatus(status);
      return status;
    } catch (e) {
      return undefined;
    }
  }, [user, favouriteMovies, favouriteShows, favouritePeople]);

  const refresh = useCallback(async () => {
    await getDatabaseInfo();
  }, [getDatabaseInfo]);

  const wipeDatabase = useCallback(async () => {
    try {
      // Clear all rows from SQLite tables while keeping table structure
      await transactWrite('DELETE FROM liked_movies');
      await transactWrite('DELETE FROM liked_shows');
      await transactWrite('DELETE FROM liked_people');

      // Clear local state
      setFavouriteMovies([]);
      setFavouriteShows([]);
      setFavouritePeople([]);
      setSyncStatus(undefined);

      // Clear AsyncStorage sync date
      await AsyncStorage.removeItem('last-sync-date');
      setLastSyncDate(undefined);
    } catch (e) {
      err('[databaseContext]', 'Failed to wipe database');
      log(e);
    }
  }, []);

  return <Provider
    value={{
      favouriteMovies,
      favouriteShows,
      favouritePeople,
      //
      addFavouriteMovie,
      addFavouriteShow,
      addFavouritePerson,
      //
      removeFavouriteMovie,
      removeFavouriteShow,
      removeFavouritePerson,
      //
      refresh,
      syncWithCloud,
      loadFromCloud,
      bidirectionalSync,
      getSyncStatusData,
      syncStatus,
      lastSyncDate,
      //
      wipeDatabase,
    }}
  >
    {children}
  </Provider>;
};
