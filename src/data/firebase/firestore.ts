import { db, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy } from './index';
import { MovieDetails, ShowDetails, PersonDetails } from '@utils/types';
import { err, log, success, warn } from '@utils/trace';

// Collection names
const COLLECTIONS = {
  MOVIES: 'liked_movies',
  SHOWS: 'liked_shows',
  PEOPLE: 'liked_people'
};

// Helper to create user-specific collection path
const getUserCollection = (userId: string, collectionName: string) => {
  return `users/${userId}/${collectionName}`;
};

// ==================== MOVIES ====================

export const getFavouriteMoviesFromFirestore = async (userId: string): Promise<MovieDetails[] | undefined> => {
  try {
    const collectionRef = collection(db, getUserCollection(userId, COLLECTIONS.MOVIES));
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const movies: MovieDetails[] = [];
    querySnapshot.forEach((doc) => {
      movies.push(doc.data() as MovieDetails);
    });

    return movies;
  } catch (e) {
    err('[firestore]', 'getFavouriteMoviesFromFirestore()');
    log(e);
  }
};

export const addFavouriteMovieToFirestore = async (userId: string, movie: MovieDetails): Promise<boolean> => {
  try {
    const docRef = doc(db, getUserCollection(userId, COLLECTIONS.MOVIES), movie.id.toString());
    await setDoc(docRef, {
      ...movie,
      createdAt: new Date().toISOString()
    });

    success('[firestore]', 'addFavouriteMovieToFirestore()');
    return true;
  } catch (e) {
    err('[firestore]', 'addFavouriteMovieToFirestore()');
    log(e);
    return false;
  }
};

export const removeFavouriteMovieFromFirestore = async (userId: string, movieId: number): Promise<boolean> => {
  try {
    const docRef = doc(db, getUserCollection(userId, COLLECTIONS.MOVIES), movieId.toString());
    await deleteDoc(docRef);

    warn('[firestore]', `removeFavouriteMovieFromFirestore('${movieId}')`);
    return true;
  } catch (e) {
    err('[firestore]', 'removeFavouriteMovieFromFirestore()');
    log(e);
    return false;
  }
};

// ==================== SHOWS ====================

export const getFavouriteShowsFromFirestore = async (userId: string): Promise<ShowDetails[] | undefined> => {
  try {
    const collectionRef = collection(db, getUserCollection(userId, COLLECTIONS.SHOWS));
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const shows: ShowDetails[] = [];
    querySnapshot.forEach((doc) => {
      shows.push(doc.data() as ShowDetails);
    });

    return shows;
  } catch (e) {
    err('[firestore]', 'getFavouriteShowsFromFirestore()');
    log(e);
  }
};

export const addFavouriteShowToFirestore = async (userId: string, show: ShowDetails): Promise<boolean> => {
  try {
    const docRef = doc(db, getUserCollection(userId, COLLECTIONS.SHOWS), show.id.toString());
    await setDoc(docRef, {
      ...show,
      createdAt: new Date().toISOString()
    });

    success('[firestore]', 'addFavouriteShowToFirestore()');
    return true;
  } catch (e) {
    err('[firestore]', 'addFavouriteShowToFirestore()');
    log(e);
    return false;
  }
};

export const removeFavouriteShowFromFirestore = async (userId: string, showId: number): Promise<boolean> => {
  try {
    const docRef = doc(db, getUserCollection(userId, COLLECTIONS.SHOWS), showId.toString());
    await deleteDoc(docRef);

    warn('[firestore]', `removeFavouriteShowFromFirestore('${showId}')`);
    return true;
  } catch (e) {
    err('[firestore]', 'removeFavouriteShowFromFirestore()');
    log(e);
    return false;
  }
};

// ==================== PEOPLE ====================

export const getFavouritePeopleFromFirestore = async (userId: string): Promise<PersonDetails[] | undefined> => {
  try {
    const collectionRef = collection(db, getUserCollection(userId, COLLECTIONS.PEOPLE));
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const people: PersonDetails[] = [];
    querySnapshot.forEach((doc) => {
      people.push(doc.data() as PersonDetails);
    });

    return people;
  } catch (e) {
    err('[firestore]', 'getFavouritePeopleFromFirestore()');
    log(e);
  }
};

export const addFavouritePersonToFirestore = async (userId: string, person: PersonDetails): Promise<boolean> => {
  try {
    const docRef = doc(db, getUserCollection(userId, COLLECTIONS.PEOPLE), person.id.toString());
    await setDoc(docRef, {
      ...person,
      createdAt: new Date().toISOString()
    });

    success('[firestore]', 'addFavouritePersonToFirestore()');
    return true;
  } catch (e) {
    err('[firestore]', 'addFavouritePersonToFirestore()');
    log(e);
    return false;
  }
};

export const removeFavouritePersonFromFirestore = async (userId: string, personId: number): Promise<boolean> => {
  try {
    const docRef = doc(db, getUserCollection(userId, COLLECTIONS.PEOPLE), personId.toString());
    await deleteDoc(docRef);

    warn('[firestore]', `removeFavouritePersonFromFirestore('${personId}')`);
    return true;
  } catch (e) {
    err('[firestore]', 'removeFavouritePersonFromFirestore()');
    log(e);
    return false;
  }
};

// ==================== SYNC ====================

export interface SyncStatus {
  localMovies: number;
  localShows: number;
  localPeople: number;
  cloudMovies: number;
  cloudShows: number;
  cloudPeople: number;
  moviesToUpload: number;
  showsToUpload: number;
  peopleToUpload: number;
  moviesToDownload: number;
  showsToDownload: number;
  peopleToDownload: number;
  totalLocal: number;
  totalCloud: number;
  inSync: boolean;
}

export const getSyncStatus = async (
  userId: string,
  localMovies: MovieDetails[],
  localShows: ShowDetails[],
  localPeople: PersonDetails[]
): Promise<SyncStatus | undefined> => {
  try {
    // Get data from Firestore
    const cloudMovies = await getFavouriteMoviesFromFirestore(userId) || [];
    const cloudShows = await getFavouriteShowsFromFirestore(userId) || [];
    const cloudPeople = await getFavouritePeopleFromFirestore(userId) || [];

    // Create ID sets for efficient comparison
    const localMovieIds = new Set(localMovies.map(m => m.id));
    const localShowIds = new Set(localShows.map(s => s.id));
    const localPeopleIds = new Set(localPeople.map(p => p.id));

    const cloudMovieIds = new Set(cloudMovies.map(m => m.id));
    const cloudShowIds = new Set(cloudShows.map(s => s.id));
    const cloudPeopleIds = new Set(cloudPeople.map(p => p.id));

    // Calculate items that need to be uploaded (in local but not in cloud)
    const moviesToUpload = localMovies.filter(m => !cloudMovieIds.has(m.id)).length;
    const showsToUpload = localShows.filter(s => !cloudShowIds.has(s.id)).length;
    const peopleToUpload = localPeople.filter(p => !cloudPeopleIds.has(p.id)).length;

    // Calculate items that need to be downloaded (in cloud but not in local)
    const moviesToDownload = cloudMovies.filter(m => !localMovieIds.has(m.id)).length;
    const showsToDownload = cloudShows.filter(s => !localShowIds.has(s.id)).length;
    const peopleToDownload = cloudPeople.filter(p => !localPeopleIds.has(p.id)).length;

    const totalLocal = localMovies.length + localShows.length + localPeople.length;
    const totalCloud = cloudMovies.length + cloudShows.length + cloudPeople.length;
    const totalToSync = moviesToUpload + showsToUpload + peopleToUpload + moviesToDownload + showsToDownload + peopleToDownload;

    return {
      localMovies: localMovies.length,
      localShows: localShows.length,
      localPeople: localPeople.length,
      cloudMovies: cloudMovies.length,
      cloudShows: cloudShows.length,
      cloudPeople: cloudPeople.length,
      moviesToUpload,
      showsToUpload,
      peopleToUpload,
      moviesToDownload,
      showsToDownload,
      peopleToDownload,
      totalLocal,
      totalCloud,
      inSync: totalToSync === 0
    };
  } catch (e) {
    err('[firestore]', 'getSyncStatus()');
    log(e);
    return undefined;
  }
};

export const syncAllToFirestore = async (
  userId: string,
  movies: MovieDetails[],
  shows: ShowDetails[],
  people: PersonDetails[]
): Promise<boolean> => {
  try {
    // Upload all movies
    for (const movie of movies) {
      await addFavouriteMovieToFirestore(userId, movie);
    }

    // Upload all shows
    for (const show of shows) {
      await addFavouriteShowToFirestore(userId, show);
    }

    // Upload all people
    for (const person of people) {
      await addFavouritePersonToFirestore(userId, person);
    }

    success('[firestore]', 'syncAllToFirestore() - Complete');
    return true;
  } catch (e) {
    err('[firestore]', 'syncAllToFirestore()');
    log(e);
    return false;
  }
};

export interface MergeData {
  moviesToUpload: MovieDetails[];
  showsToUpload: ShowDetails[];
  peopleToUpload: PersonDetails[];
  moviesToDownload: MovieDetails[];
  showsToDownload: ShowDetails[];
  peopleToDownload: PersonDetails[];
  allMovies: MovieDetails[];
  allShows: ShowDetails[];
  allPeople: PersonDetails[];
}

/**
 * Bidirectional sync - compares local and cloud data and returns what needs to be synced
 */
export const getMergeData = async (
  userId: string,
  localMovies: MovieDetails[],
  localShows: ShowDetails[],
  localPeople: PersonDetails[]
): Promise<MergeData | undefined> => {
  try {
    // Get data from Firestore
    const cloudMovies = await getFavouriteMoviesFromFirestore(userId) || [];
    const cloudShows = await getFavouriteShowsFromFirestore(userId) || [];
    const cloudPeople = await getFavouritePeopleFromFirestore(userId) || [];

    // Create ID sets and maps for efficient comparison
    const localMovieIds = new Set(localMovies.map(m => m.id));
    const localShowIds = new Set(localShows.map(s => s.id));
    const localPeopleIds = new Set(localPeople.map(p => p.id));

    const cloudMovieIds = new Set(cloudMovies.map(m => m.id));
    const cloudShowIds = new Set(cloudShows.map(s => s.id));
    const cloudPeopleIds = new Set(cloudPeople.map(p => p.id));

    // Items to upload (in local but not in cloud)
    const moviesToUpload = localMovies.filter(m => !cloudMovieIds.has(m.id));
    const showsToUpload = localShows.filter(s => !cloudShowIds.has(s.id));
    const peopleToUpload = localPeople.filter(p => !cloudPeopleIds.has(p.id));

    // Items to download (in cloud but not in local)
    const moviesToDownload = cloudMovies.filter(m => !localMovieIds.has(m.id));
    const showsToDownload = cloudShows.filter(s => !localShowIds.has(s.id));
    const peopleToDownload = cloudPeople.filter(p => !localPeopleIds.has(p.id));

    // Create merged datasets (union of both)
    const allMoviesMap = new Map<number, MovieDetails>();
    [...localMovies, ...cloudMovies].forEach(m => allMoviesMap.set(m.id, m));
    const allMovies = Array.from(allMoviesMap.values());

    const allShowsMap = new Map<number, ShowDetails>();
    [...localShows, ...cloudShows].forEach(s => allShowsMap.set(s.id, s));
    const allShows = Array.from(allShowsMap.values());

    const allPeopleMap = new Map<number, PersonDetails>();
    [...localPeople, ...cloudPeople].forEach(p => allPeopleMap.set(p.id, p));
    const allPeople = Array.from(allPeopleMap.values());

    success('[firestore]', `getMergeData() - Found ${moviesToUpload.length + showsToUpload.length + peopleToUpload.length} to upload, ${moviesToDownload.length + showsToDownload.length + peopleToDownload.length} to download`);

    return {
      moviesToUpload,
      showsToUpload,
      peopleToUpload,
      moviesToDownload,
      showsToDownload,
      peopleToDownload,
      allMovies,
      allShows,
      allPeople,
    };
  } catch (e) {
    err('[firestore]', 'getMergeData()');
    log(e);
    return undefined;
  }
};
