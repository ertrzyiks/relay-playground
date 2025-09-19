import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RelayEnvironmentProvider } from "react-relay";
import { Environment, Network, type FetchFunction } from "relay-runtime";
import { Tooltip } from "@base-ui-components/react/tooltip";
import "./index.css";
import App from "./App.tsx";

const HTTP_ENDPOINT = "https://api.github.com/graphql";

const fetchGraphQL: FetchFunction = async (request, variables) => {
  const resp = await fetch(HTTP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query: request.text, variables }),
  });
  if (!resp.ok) {
    throw new Error("Response failed.");
  }
  return await resp.json();
};

const environment = new Environment({
  network: Network.create(fetchGraphQL),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Tooltip.Provider>
      <RelayEnvironmentProvider environment={environment}>
        <App />
      </RelayEnvironmentProvider>
    </Tooltip.Provider>
  </StrictMode>
);
