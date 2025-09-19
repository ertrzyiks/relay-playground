import { useQueryLoader } from "react-relay";
import { RepoTooltipHovercardQuery } from "./data";
import type { data_hovercardQuery } from "./__generated__/data_hovercardQuery.graphql";
import { useTransition } from "react";

export function useRepoTooltipData(name: string) {
  const [hovercardQueryRef, loadHovercardQuery] =
    useQueryLoader<data_hovercardQuery>(RepoTooltipHovercardQuery);

  const [isPending, startTransition] = useTransition();

  return {
    hovercardQueryRef,
    isPending,
    loadHovercardQuery: () =>
      startTransition(() => loadHovercardQuery({ name })),
  };
}
