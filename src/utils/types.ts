export interface MovieDetails {
    id: number;
    title: string;
    originalTitle: string;
    overview: string;
    posterPath: string;
    backdropPath: string;
    runtime: number;
    genreIds: number[];
    popularity: number;
    releaseDate?: string;
    video: boolean;
    adult: boolean;
    averageVote: number;
    numberOfVotes: number;
    providers?: ProviderResponse;
    mediaType: MediaType.movie;
    createdAt?: Date;
}

export interface ProviderResponse {
    link: string;
    buy?: ProviderInfo[];
    rent?: ProviderInfo[];
    flatrate?: ProviderInfo[];
    free?: ProviderInfo[];
    ads?: ProviderInfo[];
}

export interface ProviderInfo {
    logoPath: string;
    providerId: number;
    providerName: string;
    displayPriority: number;
}

export interface Credit {
    id: number;
    cast: Cast[];
    crew: Crew[];
}
export interface CastCrew {
    adult?: boolean;
    gender?: number;
    id?: number;
    knownForDepartment?: Department;
    name?: string;
    originalName?: string;
    popularity?: number;
    posterPath: string;

}
export interface Cast extends CastCrew {
    castId?: number;
    character?: string;
    creditId?: string;
    order?: number;
    releaseDate: string;
    firstAirDate: string;
    originalTitle: string;
    title: string;
    episodeCount: number;
}
export interface Crew extends CastCrew {
    creditId?: string;
    department?: Department;
    job?: string;
}

export enum Department {
    acting = "acting",
    directing = "directing",
    writing = "writing",
    production = "production",
    editing = "editing",
    art = "art",
    sound = "sound",
    costumeMakeUp = "costumeMakeUp",
    crew = "crew",
    camera = "camera",
    visualEffects = "visualEffects",
}

export interface MultiDetails {
    id: number;
    title?: string;
    name?: string;
    originalTitle?: string;
    originalName?: string
    overview: string;
    posterPath: string;
    genreIds: number[];
    adult: boolean;
    popularity: number;
    releaseDate?: string;
    firstAirDate?: string;
    video: boolean;
    averageVote: number;
    numberOfVotes: number;
    providers?: ProviderResponse;
    mediaType: MediaType;
    knownForDepartment?: string;
    knownFor?: MovieDetails[];
}

export enum MediaType {
    movie = 'Movie',
    show = 'Show',
    person = 'Person',
}

export interface MultiListResponse {
    page: number;
    results: MultiDetails[];
    totalPages: number;
    totalResults: number;
}

export interface StarredMulti extends MultiDetails {
    creditId: string;
    character: string;
}

export interface MultiCredits {
    multis: StarredMulti[];
}

export interface ShowDetails {
    id: number;
    adult: boolean;
    backdropPath: string;
    episodeRuntime: number[];
    firstAirDate: string;
    genres: number[];
    inProduction: boolean;
    lastAirDate: string;
    numberOfEpisodes: number;
    numberOfSeasons: number;
    originalName: string;
    name: string;
    overview: string;
    popularity: number;
    posterPath: string;
    seasons: Season[];
    status: string;
    tagline: string;
    type: string;
    voteAverage: number;
    voteCount: number;
    providers?: ProviderResponse;
    mediaType: MediaType.show;
    createdAt?: Date;
}

export interface Episode {
    id: number;
    name: string;
    overview: string;
    voteAverage: number;
    voteCount: number;
    airDate: string;
    episodeNumber: number;
    runtime: number;
    seasonNumber: number;
    showId: number;
    stillPath: string;
}

export interface Network {
    id: number;
    logoPath: string;
    name: string;
    originCountry: string;
}

export interface Season {
    airDate: string;
    id: number;
    name: string;
    overview: string;
    voteAverage: number;
    episodeCount: number;
    posterPath: string;
    seasonNumber: number;
}

export interface PersonDetails {
    id: number;
    name: string;
    adult: boolean;
    alsoKnownAs: string[];
    biography: string;
    birthday: string;
    deathDay?: string;
    gender: 'male' | 'female';
    imdbId: string;
    knownForDepartment: KnownForDepartment;
    birthplace: string;
    popularity: number;
    posterPath: string;
    movieCredits: (Cast & { mediaType: MediaType.movie })[];
    showCredits: (Cast & { mediaType: MediaType.show })[];
    mediaType: MediaType.person;
}

export interface FavouriteFilters {
    genres?: Genre[];
    display?: DisplayType

}

export enum DisplayType {
    'Grid',
    'List'
}

export enum Genre {
    'Action' = 'Action',
    'Adventure' = 'Adventure',
    'Animation' = 'Animation',
    'Comedy' = 'Comedy',
    'Crime' = 'Crime',
    'Documentary' = 'Documentary',
    'Drama' = 'Drama',
    'Family' = 'Family',
    'Fantasy' = 'Fantasy',
    'History' = 'History',
    'Horror' = 'Horror',
    'Music' = 'Music',
    'Mystery' = 'Mystery',
    'Romance' = 'Romance',
    'Science Fiction' = 'Science Fiction',
    'TV Movie' = 'TV Movie',
    'Thriller' = 'Thriller',
    'War' = 'War',
    'Western' = 'Western',
    'Action & Adventure' = 'Action & Adventure',
    'Kids' = 'Kids',
    'News' = 'News',
    'Reality' = 'Reality',
    'Sci-Fi & Fantasy' = 'Sci-Fi & Fantasy',
    'Soap' = 'Soap',
    'Talk' = 'Talk',
    'War & Politics' = 'War & Politics'
}

export enum KnownForDepartment {
    Acting = "Actor",
    Directing = "Director",
    Writing = "Writor",
    Art = "Art",
    Crew = "Crew",
    Editing = "Editor",
    Production = "Production",
    Sound = "Sound",
    CostumeMakeUp = "Costume & Make-Up",
    VisualEffects = "Visual Effects",
    Unknown = "Unknown"
}

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface Friend {
  id: string; // The friend document ID (combination of both user IDs)
  userId: string; // The other user's ID
  email: string; // The other user's email
  name?: string; // The other user's name (if available)
  status: FriendStatus;
  requestedBy: string; // UID of the user who sent the request
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}