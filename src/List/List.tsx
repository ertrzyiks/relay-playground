import { graphql, useFragment, usePaginationFragment } from "react-relay";
import { forwardRef, Suspense, useRef, useState, useTransition } from "react";
import type { List_Repository$key } from "./__generated__/List_Repository.graphql";
import type { List_Repository_item$key } from "./__generated__/List_Repository_item.graphql";
import { RepoTooltip } from "../RepoTooltip/RepoTooltip";
import { HoverCard } from "../HoverCard/HoverCard";
import { useRepoTooltipData } from "../RepoTooltip/useRepoTooltipData";
import { useVirtualizer } from "@tanstack/react-virtual";

const Item = forwardRef<
  HTMLLIElement,
  { style: any; repo: List_Repository_item$key; "data-index": number }
>(function (props, ref) {
  const repo = useFragment<List_Repository_item$key>(
    graphql`
      fragment List_Repository_item on Repository {
        name
        homepageUrl
      }
    `,
    props.repo
  );

  const { hovercardQueryRef, loadHovercardQuery } = useRepoTooltipData(
    repo.name
  );

  return (
    <li
      className="text-left bg-gray-500 p-4 rounded"
      onMouseOver={loadHovercardQuery}
      style={props.style}
      data-index={props["data-index"]}
      ref={ref as React.Ref<HTMLLIElement>}
    >
      <HoverCard content={<RepoTooltip repoRef={hovercardQueryRef} />}>
        <Suspense fallback={<span>{repo.name}</span>}>{repo.name}</Suspense>
      </HoverCard>
    </li>
  );
});

function ListInternal({ repos }: { repos: List_Repository_item$key[] }) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: repos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,
    gap: 12,
  });

  return (
    <div ref={parentRef} className="overflow-auto h-96">
      <ul
        className="flex flex-col gap-2 my-2 relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <Item
            key={virtualRow.index}
            repo={repos[virtualRow.index]!}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              // height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </ul>
    </div>
  );
}

export function List(props: { user: List_Repository$key }) {
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("ASC");
  const [orderField, setOrderField] = useState<"NAME" | "CREATED_AT">("NAME");
  const [isPending, startTransition] = useTransition();

  const { data, loadNext, hasNext, refetch } = usePaginationFragment(
    graphql`
      fragment List_Repository on User
      @refetchable(queryName: "RepositoryListRefetchQuery")
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 10 }
        field: { type: "RepositoryOrderField", defaultValue: NAME }
        direction: { type: "OrderDirection", defaultValue: ASC }
      ) {
        repositories(
          first: $count
          after: $cursor
          orderBy: { field: $field, direction: $direction }
        ) @connection(key: "List_RepositoryFragment_repositories") {
          edges {
            node {
              id
              ...List_Repository_item
            }
          }
        }
      }
    `,
    props.user
  );

  const repos = (data.repositories.edges ?? [])
    .map((edge) => edge?.node)
    .filter((repo) => repo != null);

  const handleOrderDirectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const direction = e.target.value as "ASC" | "DESC";
    setOrderDirection(direction);
    startTransition(() => {
      refetch({ direction, field: orderField });
    });
  };

  const handleOrderFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field = e.target.value as "NAME";
    setOrderField(field);
    startTransition(() => {
      refetch({ direction: orderDirection, field });
    });
  };

  if (!data.repositories.edges) {
    return <div>No repositories found</div>;
  }

  return (
    <div>
      <div>
        <select onChange={handleOrderFieldChange}>
          <option value="NAME">Name</option>
          <option value="CREATED_AT">Created At</option>
        </select>

        <select onChange={handleOrderDirectionChange}>
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>
        </select>
      </div>

      <ListInternal repos={repos} />

      {hasNext && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => loadNext(10)}
          disabled={isPending}
        >
          Load More
        </button>
      )}
    </div>
  );
}
