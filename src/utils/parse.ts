import {
    Cast,
    Credit,
    Department,
    MediaType,
    MovieDetails,
    MultiCredits,
    MultiDetails,
    MultiListResponse,
    ProviderInfo,
    ProviderResponse,
    StarredMulti,
    ShowDetails,
    Episode,
    Season,
    Network,
    Crew,
    KnownForDepartment,
    PersonDetails,
} from "./types";

export const parseProviders = (providers: any) => {
    if (!providers || !providers.results['GB']) return undefined;
    return {
        link: providers.results['GB'].link,
        buy: parseProvider(providers.results['GB'].buy ?? []),
        rent: parseProvider(providers.results['GB'].rent ?? []),
        flatrate: parseProvider(providers.results['GB'].flatrate ?? []),
        free: parseProvider(providers.results['GB'].free ?? []),
        ads: parseProvider(providers.results['GB'].ads ?? []),
    } as ProviderResponse;
}

export const parseMovieDetails = (resp: any) => {
    return {
        id: resp.id,
        title: resp.title,
        originalTitle: resp.original_title,
        overview: resp.overview,
        posterPath: resp.poster_path, // Note: typo in your interface, should be posterPath
        backdropPath: resp.backdrop_path, // Note: typo in your interface, should be posterPath
        genreIds: resp.genre_ids || (resp.genres ? resp.genres.map((g: any) => g.id) : []),
        popularity: resp.popularity,
        runtime: resp.runtime,
        releaseDate: resp.release_date ? new Date(resp.release_date).toISOString() : undefined,
        video: Boolean(resp.video),
        adult: Boolean(resp.adult),
        averageVote: resp.vote_average,
        numberOfVotes: resp.vote_count,
        mediaType: MediaType['movie'],
        providers: resp['watch/providers'] ? parseProviders(resp['watch/providers']) : undefined,
    } as MovieDetails;
}

const parseProvider = (provider: any[]) => {
    return provider.map(p => {
        return {
            displayPriority: p['display_priority'],
            logoPath: p['logo_path'],
            providerId: p['provider_id'],
            providerName: p['provider_name']
        } as ProviderInfo
    })
}

export const genreIds: Record<number, string> = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics',
};

export const getGenres = (genreList: number[]) => {
    return genreList.map(id => genreIds[id])
        .filter(Boolean)
        .join(', ');
}

export const departmentValues: Record<string, Department> = {
    "Acting": Department.acting,
    "Art": Department.art,
    "Camera": Department.camera,
    "Costume & Make-Up": Department.costumeMakeUp,
    "Crew": Department.crew,
    "Directing": Department.directing,
    "Editing": Department.editing,
    "Production": Department.production,
    "Sound": Department.sound,
    "Visual Effects": Department.visualEffects,
    "Writing": Department.writing,
};

// Reverse lookup (Department → string)
export const reverseDepartmentValues: Record<Department, string> = Object
    .entries(departmentValues)
    .reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {} as Record<Department, string>);

export const parseCast = (json: any): Cast => {
    return {
        adult: json.adult,
        gender: json.gender,
        id: json.id,
        knownForDepartment: json.known_for_department
            ? departmentValues[json.known_for_department] ?? null
            : null,
        name: json.name,
        originalName: json.original_name,
        popularity: json.popularity ? Number(json.popularity) : undefined,
        posterPath: json.profile_path ?? json.poster_path,
        castId: json.cast_id,
        character: json.character,
        creditId: json.credit_id,
        order: json.order,
        department: json.department
            ? departmentValues[json.department] ?? null
            : null,
        releaseDate: json.release_date,
        firstAirDate: json.first_air_date,
        originalTitle: json.original_title,
        title: json.title,
        episodeCount: json.episode_count,
    } as Cast;
};
export const parseCrew = (json: any): Crew => {
    return {
        adult: json.adult,
        gender: json.gender,
        id: json.id,
        knownForDepartment: json.known_for_department
            ? departmentValues[json.known_for_department] ?? null
            : null,
        name: json.name,
        originalName: json.original_name,
        popularity: json.popularity ? Number(json.popularity) : undefined,
        posterPath: json.poster_path,
        castId: json.cast_id,
        order: json.order,
        department: json.department
            ? departmentValues[json.department] ?? null
            : null,
        job: json.job,
    } as Crew;
};

export const parseCredit = (resp: any): Credit => {
    return {
        id: resp.id,
        cast: resp.cast.map((c: any) => parseCast(c)),
        crew: resp.crew.map((c: any) => parseCrew(c)),
    } as Credit;
};

// -----------------------------
// ProviderInfo
// -----------------------------

export const parseProviderInfo = (json: any): ProviderInfo => {
    return {
        logoPath: json['logo_path'],
        providerId: json['provider_id'],
        providerName: json['provider_name'],
        displayPriority: json['display_priority'],
    };
};

export const serializeProviderInfo = (p: ProviderInfo) => ({
    logo_path: p.logoPath,
    provider_id: p.providerId,
    provider_name: p.providerName,
    display_priority: p.displayPriority,
});

// -----------------------------
// ProviderResponse
// -----------------------------

const parseProviderList = (list: any[] | undefined): ProviderInfo[] | undefined =>
    list ? list.map(parseProviderInfo) : undefined;

export const parseProviderResponse = (json: any): ProviderResponse => {
    return {
        link: json['link'],
        buy: parseProviderList(json['buy']),
        rent: parseProviderList(json['rent']),
        flatrate: parseProviderList(json['flatrate']),
        free: parseProviderList(json['free']),
        ads: parseProviderList(json['ads']),
    };
};

export const serializeProviderResponse = (pr: ProviderResponse) => ({
    link: pr.link,
    buy: pr.buy?.map(serializeProviderInfo),
    rent: pr.rent?.map(serializeProviderInfo),
    flatrate: pr.flatrate?.map(serializeProviderInfo),
    free: pr.free?.map(serializeProviderInfo),
    ads: pr.ads?.map(serializeProviderInfo),
});

// -----------------------------
// Media Types
// -----------------------------

export const MediaTypes = {
    movie: MediaType['movie'],
    show: MediaType['show'],
    person: MediaType['person'],
} as const;

// -----------------------------
// MultiDetails
// -----------------------------

export const parseMultiDetails = (json: any): MultiDetails => {
    // genre ids
    const genreIds =
        json.genre_ids ??
        (json.genres ? json.genres.map((g: any) => g.id) : []);

    // providers
    let providers: ProviderResponse | undefined = undefined;
    if (json['watch/providers']?.results?.GB) {
        providers = parseProviderResponse(json['watch/providers'].results.GB);
    }

    // release date
    let releaseDate: string | undefined = undefined;
    if (json["release_date"] && json["release_date"] !== "") {
        releaseDate = new Date(json["release_date"]).toISOString();
    }

    // media type
    let mediaType: MediaType = MediaTypes.movie;
    if (json['media_type'] === "tv") mediaType = MediaTypes.show;
    if (json['media_type'] === "person") mediaType = MediaTypes.person;

    return {
        adult: Boolean(json['adult']),
        id: json['id'],
        title: json['title'],
        name: json['name'],
        originalTitle: json['original_title'] ?? "",
        originalName: json['original_name'],
        overview: json['overview'] ?? "",
        posterPath: json['poster_path'] ?? json['profile_path'],
        knownForDepartment: mediaType === MediaType['person'] ? parseKnownForDepartment(json['known_for_department']) : undefined,
        knownFor: mediaType === MediaType['person'] && json['known_for'].map((i: any) => parseMovieDetails(i)),
        genreIds: Array.from(genreIds),
        popularity: Number(json['popularity']) || 0,
        releaseDate: json.release_date ? new Date(json.release_date).toISOString() : undefined,
        firstAirDate: json.first_air_date ? new Date(json.first_air_date).toISOString() : undefined,
        video: Boolean(json['video']),
        averageVote: Number(json['vote_average']) || 0,
        numberOfVotes: Number(json['vote_count']) || 0,
        providers,
        mediaType,
    };
};

export const serializeMultiDetails = (m: MultiDetails) => ({
    adult: m.adult,
    id: m.id,
    title: m.title,
    originalTitle: m.originalTitle,
    overview: m.overview,
    posterPath: m.posterPath,
    genreIds: m.genreIds,
    popularity: m.popularity,
    releaseDate: m.releaseDate,
    video: m.video,
    averageVote: m.averageVote,
    numberOfVotes: m.numberOfVotes,
    providers: m.providers ? serializeProviderResponse(m.providers) : undefined,
    mediaType: m.mediaType,
});

// -----------------------------
// MultiListResponse
// -----------------------------

export const parseMultiListResponse = (json: any): MultiListResponse => {
    return {
        page: json.page,
        results: json.results?.map((r: any) => parseMultiDetails(r)) ?? [],
        totalPages: json.total_pages,
        totalResults: json.total_results,
    };
};

export const serializeMultiListResponse = (m: MultiListResponse) => ({
    page: m.page,
    results: m.results.map(serializeMultiDetails),
    total_pages: m.totalPages,
    total_results: m.totalResults,
});

// -----------------------------
// StarredMulti
// -----------------------------

export const parseStarredMulti = (json: any): StarredMulti => {
    return {
        character: json['character'] ?? "",
        creditId: json['credit_id'] ?? "",
        adult: Boolean(json['adult']),
        id: json['id'],
        title: json['title'],
        name: json['name'],
        originalTitle: json['original_title'],
        originalName: json['original_name'],
        overview: json['overview'] ?? "",
        posterPath: json['poster_path'] ??
            "http://www.familylore.org/images/2/25/UnknownPerson.png",
        genreIds: json.genre_ids ? json.genre_ids.map((x: any) => x) : [],
        popularity: Number(json['popularity']) || 0,
        releaseDate:
            !json["release_date"] || json["release_date"] === ""
                ? undefined
                : new Date(json["release_date"]).toISOString(),
        video: Boolean(json['video']),
        averageVote: Number(json['vote_average']) || 0,
        numberOfVotes: Number(json['vote_count']) || 0,
        mediaType: json['media_type'] ?? MediaTypes.movie,
    };
};

export const serializeStarredMulti = (m: StarredMulti) => ({
    character: m.character,
    creditId: m.creditId,
    adult: m.adult,
    id: m.id,
    title: m.title,
    originalTitle: m.originalTitle,
    overview: m.overview,
    posterPath: m.posterPath,
    genreIds: m.genreIds,
    popularity: m.popularity,
    releaseDate: m.releaseDate,
    video: m.video,
    averageVote: m.averageVote,
    numberOfVotes: m.numberOfVotes,
    mediaType: m.mediaType,
});

// -----------------------------
// MultiCredits
// -----------------------------

export const parseMultiCredits = (json: any): MultiCredits => {
    return {
        multis: json.cast?.map((c: any) => parseStarredMulti(c)) ?? [],
    };
};

export const serializeMultiCredits = (m: MultiCredits) => ({
    multis: m.multis.map(serializeStarredMulti),
});

// ---------------------------------------------
// SUPPORTING PARSERS
// ---------------------------------------------

export const parseEpisode = (json: any): Episode => {
    return {
        id: json.id,
        name: json.name,
        overview: json.overview ?? "",
        voteAverage: Number(json.vote_average) || 0,
        voteCount: Number(json.vote_count) || 0,
        airDate: json.air_date || "",
        episodeNumber: json.episode_number ?? 0,
        runtime: json.runtime ?? 0,
        seasonNumber: json.season_number ?? 0,
        showId: json.show_id ?? 0,
        stillPath: json.still_path ?? ""
    };
};

const parseNetwork = (json: any): Network => {
    return {
        id: json.id,
        logoPath: json.logo_path ?? "",
        name: json.name ?? "",
        originCountry: json.origin_country ?? "",
    };
};

const parseSeason = (json: any): Season => {
    return {
        airDate: json.air_date ?? "",
        id: json.id,
        name: json.name ?? "",
        overview: json.overview ?? "",
        voteAverage: Number(json.vote_average) || 0,
        episodeCount: json.episode_count ?? 0,
        posterPath: json.poster_path ?? "",
        seasonNumber: json.season_number ?? 0,
    };
};

// ---------------------------------------------
// SHOW DETAILS PARSER
// ---------------------------------------------

export const parseShowDetails = (resp: any): ShowDetails => {
    return {
        id: resp.id,
        name: resp.name,
        adult: Boolean(resp.adult),
        backdropPath: resp.backdrop_path ?? "",
        episodeRuntime: Array.isArray(resp.episode_run_time)
            ? resp.episode_run_time
            : [],
        firstAirDate: resp.first_air_date ?? "",
        genres: resp.genres
            ? resp.genres.map((g: any) => g.id)
            : resp.genre_ids ?? [],
        inProduction: Boolean(resp.in_production),
        lastAirDate: resp.last_air_date ?? "",
        numberOfEpisodes: resp.number_of_episodes ?? 0,
        numberOfSeasons: resp.number_of_seasons ?? 0,
        originalName: resp.original_name ?? "",
        overview: resp.overview ?? "",
        popularity: Number(resp.popularity) || 0,
        posterPath: resp.poster_path ?? "",
        seasons: resp.seasons
            ? resp.seasons.map((s: any) => parseSeason(s))
            : [],
        status: resp.status ?? "",
        tagline: resp.tagline ?? "",
        type: resp.type ?? "",
        voteAverage: Number(resp.vote_average) || 0,
        voteCount: Number(resp.vote_count) || 0,
        mediaType: MediaType['show'],
        providers: resp['watch/providers'] ? parseProviders(resp['watch/providers']) : undefined,
    };
};

// export const parseEpisode = (resp: any): Episode => {
//     return {
//         airDate: resp.air_date,
//         episodeNumber: resp.episode_number,
//         // episodeType: resp.episode_type,
//         id: resp.id,
//         name: resp.name,
//         overview: resp.overview,
//         // production_code: resp.production_code,
//         runtime: resp.runtime,
//         seasonNumber: resp.season_number,
//         showId: resp.show_id,
//         stillPath: resp.still_path,
//         voteAverage: resp.vote_average,
//         voteCount: resp.vote_count,
//         // "crew": [],
//         // "guest_stars": []
//     };
// };

// ---------------------------------------------
// SERIALIZERS
// ---------------------------------------------

const serializeEpisode = (e: Episode) => ({
    id: e.id,
    name: e.name,
    overview: e.overview,
    vote_average: e.voteAverage,
    vote_count: e.voteCount,
    air_date: e.airDate,
    episode_number: e.episodeNumber,
    runtime: e.runtime,
    season_number: e.seasonNumber,
    show_id: e.showId,
});

const serializeNetwork = (n: Network) => ({
    id: n.id,
    logo_path: n.logoPath,
    name: n.name,
    origin_country: n.originCountry,
});

const serializeSeason = (s: Season) => ({
    air_date: s.airDate,
    id: s.id,
    name: s.name,
    overview: s.overview,
    vote_average: s.voteAverage,
    episode_count: s.episodeCount,
    poster_path: s.posterPath,
    season_number: s.seasonNumber,
});

export const serializeShowDetails = (s: ShowDetails) => ({
    id: s.id,
    adult: s.adult,
    backdrop_path: s.backdropPath,
    episode_run_time: s.episodeRuntime,
    first_air_date: s.firstAirDate,
    genres: s.genres,
    in_production: s.inProduction,
    last_air_date: s.lastAirDate,
    number_of_episodes: s.numberOfEpisodes,
    number_of_seasons: s.numberOfSeasons,
    original_name: s.originalName,
    overview: s.overview,
    popularity: s.popularity,
    poster_path: s.posterPath,
    seasons: s.seasons.map(serializeSeason),
    status: s.status,
    tagline: s.tagline,
    type: s.type,
    vote_average: s.voteAverage,
    vote_count: s.voteCount,
});

export function parseKnownForDepartment(input: string): KnownForDepartment {
    switch (input) {
        case "Acting":
            return KnownForDepartment.Acting;
        case "Directing":
            return KnownForDepartment.Directing;
        case "Writing":
            return KnownForDepartment.Writing;
        case "Art":
            return KnownForDepartment.Art;
        case "Crew":
            return KnownForDepartment.Crew;
        case "Editing":
            return KnownForDepartment.Editing;
        case "Production":
            return KnownForDepartment.Production;
        case "Sound":
            return KnownForDepartment.Sound;
        case "Costume & Make-Up":
            return KnownForDepartment.CostumeMakeUp;
        case "Visual Effects":
            return KnownForDepartment.VisualEffects;

        default: {
            return KnownForDepartment.Unknown
        }

    }
}

export const parsePersonDetails = (resp: any): PersonDetails => {
    return {
        id: resp['id'],
        name: resp['name'],
        adult: resp['adult'],
        alsoKnownAs: resp['also_known_as'],
        biography: resp['biography'],
        birthday: resp['birthday'],
        birthplace: resp['birthplace'],
        gender: resp['gender'],
        imdbId: resp['imdb_id'],
        knownForDepartment: parseKnownForDepartment(resp['known_for_department']),
        popularity: resp['popularity'],
        posterPath: resp['profile_path'],
        deathDay: resp['death_day'],
        mediaType: MediaType['person'],
        movieCredits: (resp['movie_credits'].cast ?? []).map((i: any) => ({ ...parseCast(i), mediaType: MediaType['movie'] })),
        showCredits: (resp['tv_credits'].cast ?? []).map((i: any) => ({ ...parseCast(i), mediaType: MediaType['show'] })),
    }
}