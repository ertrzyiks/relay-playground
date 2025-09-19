import { type PreloadedQuery } from "react-relay";
import type { data_hovercardQuery } from "./__generated__/data_hovercardQuery.graphql";
import { lazy, Suspense } from "react";

const RepoTooltipContentLazy = lazy(() => import("./RepoTooltipContent"));
function RepoTooltipInternal({
  repoRef,
}: {
  repoRef: PreloadedQuery<data_hovercardQuery> | null | undefined;
}) {
  if (!repoRef) {
    return <div>Loading...</div>;
  }

  return <RepoTooltipContentLazy repoRef={repoRef} />;
}

export function RepoTooltip({
  repoRef,
}: {
  repoRef: PreloadedQuery<data_hovercardQuery> | null | undefined;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RepoTooltipInternal repoRef={repoRef} />
    </Suspense>
  );
}
