import { graphql, useLazyLoadQuery } from "react-relay";
import type { AppQuery } from "./__generated__/AppQuery.graphql";
import "./App.css";
import { List } from "./List/List";
import { Suspense } from "react";

function App() {
  const data = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        user(login: "ertrzyiks") {
          ...List_Repository
        }
      }
    `,
    {}
  );

  if (!data.user) {
    return <div>User not found</div>;
  }

  return (
    <div className="App">
      <h1>My GitHub Repositories</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <List user={data.user} />
      </Suspense>
    </div>
  );
}

export default App;
