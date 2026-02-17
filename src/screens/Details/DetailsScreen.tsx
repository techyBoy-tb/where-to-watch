import React from "react";
import { Credit, MediaType, MovieDetails, PersonDetails, ShowDetails } from "@utils/types";
import DetailsMovie from "@components/DetailsMovie";
import DetailsShow from "@components/DetailsShow";
import DetailsPerson from "@components/DetailsPerson";
import { success } from "@utils/trace";

interface Props {
  details: MovieDetails | ShowDetails | PersonDetails;
  mediaType: MediaType;
  credits?: Credit;
}

const DetailsScreen: React.FC<Props> = ({
  details,
  mediaType,
  credits,
}) => {

  if (mediaType === MediaType['movie']) {
    return <DetailsMovie
      movie={details as MovieDetails}
      cast={credits?.cast ?? []}
      director={credits?.crew.find(({ job }) => job === 'Director')}
    />
  }

  if (mediaType === MediaType['show']) {
    return <DetailsShow
      show={details as ShowDetails}
      cast={credits?.cast ?? []}
    />
  }

  if (mediaType === MediaType['person']) {
    success('MEDIA TYPEE PERSON')
    return <DetailsPerson
      person={details as PersonDetails}
    />
  }
}

export default DetailsScreen;