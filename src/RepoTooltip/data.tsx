import { graphql } from "react-relay";

export const RepoTooltipHovercardQuery = graphql`
  query data_hovercardQuery($name: String!) {
    repository(owner: "ertrzyiks", name: $name) {
      ...RepoTooltipContent_details
    }
  }
`;
