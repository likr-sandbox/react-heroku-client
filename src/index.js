import "bulma/css/bulma.css";

import { render } from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserHistory } from "history";

import App from "./App.js";

const history = createBrowserHistory();

function handleRedirectCallback({ path }) {
  console.log(path);
  history.replace({ pathname: path || window.location.pathname });
}

render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
    onRedirectCallback={handleRedirectCallback}
  >
    <App history={history} />
  </Auth0Provider>,
  document.querySelector("#content"),
);
