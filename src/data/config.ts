import { currentEnv } from '@utils/environment';
import { info } from '@utils/trace';

const app = {
    baseUrl: 'https://api.themoviedb.org/3/',
    imageUrl: 'https://image.tmdb.org/t/p/w500',

    apiKey: '77f767cfb42ab646ba6a5669c08eefe3',
    key: '?api_key=77f767cfb42ab646ba6a5669c08eefe3',

    // The AsyncStorage keys for the auth tokens
    tokenKey: 'movie-finder-bearer-token',
    refreshTokenKey: 'movie-finder-refresh-token',

    /**
     * Database keys for Settings
     *
     * @implementation src/data/sqlite/settings.ts
     *
     * @note keys and their value types in comments!
     * Everything is stored as a string in sqlite, so add the value type to parse!
     */
    settings: {
    },
};

const config = () => {
    info('Loading config =>', 'default');

    //
    // Overrides for beta
    if (currentEnv === 'beta') {
        info('Overriding config =>', 'beta');
    }
    //
    // Overrides for production
    if (currentEnv === 'production') {
        info('Overriding config =>', 'production');
    }

    return app;
};

export default config();
