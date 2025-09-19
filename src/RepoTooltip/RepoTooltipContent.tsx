import {
  graphql,
  useFragment,
  usePreloadedQuery,
  type PreloadedQuery,
} from "react-relay";
import type { RepoTooltipContent_details$key } from "./__generated__/RepoTooltipContent_details.graphql";

import { RepoTooltipHovercardQuery } from "./data";
import type { data_hovercardQuery } from "./__generated__/data_hovercardQuery.graphql";

export function RepoTooltipContent(props: {
  repoRef: PreloadedQuery<data_hovercardQuery>;
}) {
  const data = usePreloadedQuery(RepoTooltipHovercardQuery, props.repoRef);
  if (!data.repository) {
    return <div>No data</div>;
  }

  return (
    <div>
      <RepoTooltipContentBody repo={data.repository} />
    </div>
  );
}

function RepoTooltipContentBody(props: {
  repo: RepoTooltipContent_details$key;
}) {
  const data = useFragment(
    graphql`
      fragment RepoTooltipContent_details on Repository {
        name
        description
      }
    `,
    props.repo
  );

  return (
    <div className="text-gray-900">
      <p>{data.description}</p>
    </div>
  );
}
