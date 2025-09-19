import { graphql, useFragment, useRefetchableFragment } from "react-relay";
import { Suspense, useState, useTransition } from "react";
import type { List_Repository$key } from "./__generated__/List_Repository.graphql";
import type { List_Repository_item$key } from "./__generated__/List_Repository_item.graphql";
import { RepoTooltip } from "../RepoTooltip/RepoTooltip";
import { HoverCard } from "../HoverCard/HoverCard";
import { useRepoTooltipData } from "../RepoTooltip/useRepoTooltipData";

function Item(props: { repo: List_Repository_item$key }) {
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
    <HoverCard content={<RepoTooltip repoRef={hovercardQueryRef} />}>
      <li
        className="text-left bg-gray-500 p-4 rounded"
        onMouseOver={loadHovercardQuery}
      >
        <Suspense fallback={<span>{repo.name}</span>}>{repo.name}</Suspense>
      </li>
    </HoverCard>
  );
}

export function List(props: { user: List_Repository$key }) {
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("ASC");
  const [orderField, setOrderField] = useState<"NAME" | "CREATED_AT">("NAME");
  const [isPending, startTransition] = useTransition();

  const [data, refetch] = useRefetchableFragment(
    graphql`
      fragment List_Repository on User
      @refetchable(queryName: "RepositoryListRefetchQuery")
      @argumentDefinitions(
        field: { type: "RepositoryOrderField", defaultValue: NAME }
        direction: { type: "OrderDirection", defaultValue: ASC }
      ) {
        repositories(
          first: 10
          orderBy: { field: $field, direction: $direction }
        ) {
          nodes {
            id
            ...List_Repository_item
          }
        }
      }
    `,
    props.user
  );

  if (!data.repositories.nodes) {
    return <div>No repositories found</div>;
  }

  const repos = data.repositories.nodes.filter((repos) => repos != null);

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

      <ul className="flex flex-col gap-2 my-2">
        {repos.map((repo) => (
          <Item key={repo.id} repo={repo} />
        ))}
      </ul>
    </div>
  );
}
