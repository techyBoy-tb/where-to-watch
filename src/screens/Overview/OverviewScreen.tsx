import React, { useCallback, useState } from 'react';
import { searchMulti } from '@data/api';
import { MediaType, MovieDetails, MultiListResponse, ShowDetails } from '@utils/types';
import { View, Image } from 'react-native';
import Carousel, {
  withCarouselContext,
} from '@r0b0t3d/react-native-carousel';
import DetailsCard from '@components/DetailsCard';
import { List, Searchbar, Text } from 'react-native-paper';
import { debounce, floor } from 'lodash';
import Wrap from '@components/Wrap';
import KeyboardAwareScrollView from '@components/ui/KeyboardAwareScrollView';
import palette from '@theme/_palette';
import SearchResultCard from '@components/SearchResultsCard';
import config from '@data/config';
import Paragraph from '@components/ui/Paragraph';

interface Props {
  upcomingMovies: MovieDetails[];
  popularMovies: MovieDetails[];
  topRatedMovies: MovieDetails[];
  upcomingShows: ShowDetails[];
  popularShows: ShowDetails[];
  topRatedShows: ShowDetails[];
}

const OverviewScreen: React.FC<Props> = ({
  upcomingMovies,
  popularMovies,
  topRatedMovies,
  upcomingShows,
  popularShows,
  topRatedShows,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<MultiListResponse>();

  const fetchResults = useCallback(async (searchTerm: string) => {
    const results = await searchMulti(searchTerm);
    setSearchResults(results);
  }, []);

  const debouncedSearch = useCallback(
    debounce((text) => fetchResults(text), 500), // 500ms debounce
    []
  );

  const onChangeSearch = (text: string) => {
    setSearchValue(text);
    debouncedSearch(text);
  };

  return (
    <Wrap>
      <KeyboardAwareScrollView>
        <Searchbar
          value={searchValue}
          onChangeText={onChangeSearch}
          placeholder='Search for your favourites'
          style={{
            backgroundColor: palette.surface,
            borderRadius: 10,
            marginHorizontal: 15,
            marginBottom: 15
          }}
          placeholderTextColor={palette.white_50}
          iconColor={palette.brightWhite}
          inputStyle={{
            color: palette.brightWhite
          }}
          onClearIconPress={() => {
            setSearchValue("")
            setSearchResults(undefined)
          }
          }
        />


        {searchResults && searchValue !== "" ? (
          <View>
            {searchResults.totalResults === 0 ? (
              <>
                <Text>Cannot find any results</Text>
              </>
            ) : (
              <>
                {searchResults?.results.map((item, index) => (
                  <SearchResultCard
                    key={`search_term_${item.id}_${index}`}
                    result={item}
                  />
                )
                )}
              </>
            )}
          </View>
        ) : (
          <>
            {upcomingMovies.length !== 0 && (
              <View>
                <Paragraph
                  variant='titleLarge'
                  style={{
                    paddingVertical: 10,
                    textAlign: 'center'
                  }}>
                  Upcoming movies
                </Paragraph>
                <Carousel
                  style={{ height: 300 }}
                  data={upcomingMovies}
                  initialPage={floor(upcomingMovies.length / 2)}
                  loop={true}
                  autoPlay={false}
                  duration={3000}
                  itemWidth={200}
                  inactiveOpacity={0.5}
                  inactiveScale={0.9}
                  firstItemAlignment="start"
                  renderItem={({ item }) => <DetailsCard details={item} />}
                />
              </View>
            )}

            {popularMovies.length !== 0 && (
              <View>
                <Paragraph
                  variant='titleLarge'
                  style={{
                    paddingVertical: 10,
                    textAlign: 'center'
                  }}>
                  Popular movies
                </Paragraph>
                <Carousel
                  style={{ height: 300 }}
                  data={popularMovies}
                  initialPage={floor(popularMovies.length / 2)}
                  loop={true}
                  autoPlay={false}
                  duration={3000}
                  itemWidth={200}
                  inactiveOpacity={0.5}
                  inactiveScale={0.9}
                  firstItemAlignment="start"
                  renderItem={({ item }) => <DetailsCard details={item} />}
                />
              </View>
            )}

            {topRatedMovies.length !== 0 && (
              <View>
                <Paragraph
                  variant='titleLarge'
                  style={{
                    paddingVertical: 10,
                    textAlign: 'center'
                  }}>
                  Top rated movies
                </Paragraph>
                <Carousel
                  style={{ height: 300 }}
                  data={topRatedMovies}
                  initialPage={floor(topRatedMovies.length / 2)}
                  loop={true}
                  autoPlay={false}
                  duration={3000}
                  itemWidth={200}
                  inactiveOpacity={0.5}
                  inactiveScale={0.9}
                  firstItemAlignment="start"
                  renderItem={({ item }) => <DetailsCard details={item} />}
                />
              </View>
            )}

            {upcomingShows.length !== 0 && (
              <View>
                <Paragraph
                  variant='titleLarge'
                  style={{
                    paddingVertical: 10,
                    textAlign: 'center'
                  }}>
                  Current shows
                </Paragraph>
                <Carousel
                  style={{ height: 300 }}
                  data={upcomingShows}
                  initialPage={floor(upcomingShows.length / 2)}
                  loop={true}
                  autoPlay={false}
                  duration={3000}
                  itemWidth={200}
                  inactiveOpacity={0.5}
                  inactiveScale={0.9}
                  firstItemAlignment="start"
                  renderItem={({ item }) => <DetailsCard details={item} />}
                />
              </View>
            )}

            {popularShows.length !== 0 && (
              <View>
                <Paragraph
                  variant='titleLarge'
                  style={{
                    paddingVertical: 10,
                    textAlign: 'center'
                  }}>
                  Popular shows
                </Paragraph>
                <Carousel
                  style={{ height: 300 }}
                  data={popularShows}
                  initialPage={floor(popularShows.length / 2)}
                  loop={true}
                  autoPlay={false}
                  duration={3000}
                  itemWidth={200}
                  inactiveOpacity={0.5}
                  inactiveScale={0.9}
                  firstItemAlignment="start"
                  renderItem={({ item }) => <DetailsCard details={item} />}
                />
              </View>
            )}

            {topRatedShows.length !== 0 && (
              <View>
                <Paragraph
                  variant='titleLarge'
                  style={{
                    paddingVertical: 10,
                    textAlign: 'center'
                  }}>
                  Top rated shows
                </Paragraph>
                <Carousel
                  style={{ height: 300 }}
                  data={topRatedShows}
                  initialPage={floor(topRatedShows.length / 2)}
                  loop={true}
                  autoPlay={false}
                  duration={3000}
                  itemWidth={200}
                  inactiveOpacity={0.5}
                  inactiveScale={0.9}
                  firstItemAlignment="start"
                  renderItem={({ item }) => <DetailsCard details={item} />}
                />
              </View>
            )}
          </>
        )}

      </KeyboardAwareScrollView>

    </Wrap>
  );
};

export default React.memo(withCarouselContext(OverviewScreen));
