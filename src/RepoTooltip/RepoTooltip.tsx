import { type PreloadedQuery } from "react-relay";
import { RepoTooltipContent } from "./RepoTooltipContent";
import type { data_hovercardQuery } from "./__generated__/data_hovercardQuery.graphql";

export function RepoTooltip({
  repoRef,
}: {
  repoRef: PreloadedQuery<data_hovercardQuery> | null | undefined;
}) {
  return <>{repoRef && <RepoTooltipContent repoRef={repoRef} />}</>;
}
