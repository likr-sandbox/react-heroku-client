import { Route, Router, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import RootPage from "./pages/Root.js";
import RestaurantDetailPage from "./pages/RestaurantDetail.js";
import RestaurantListPage from "./pages/RestaurantList.js";

function AuthButton() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  function handleClickLoginButton() {
    loginWithRedirect({
      appState: {
        path: window.location.pathname,
      },
    });
  }

  function handleClickLogoutButton() {
    logout({
      localOnly: true,
    });
  }

  if (isLoading) {
    return (
      <button className="button is-small is-warning is-inverted is-outlined is-loading">
        Loading
      </button>
    );
  }
  if (isAuthenticated) {
    return (
      <button
        className="button is-small is-warning is-inverted is-outlined"
        onClick={handleClickLogoutButton}
      >
        ログアウト
      </button>
    );
  }
  return (
    <button
      className="button is-small is-warning is-inverted is-outlined"
      onClick={handleClickLoginButton}
    >
      ログイン
    </button>
  );
}

export default function App({ history }) {
  return (
    <Router history={history}>
      <section className="hero is-warning">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              下高井戸
              <br className="is-hidden-tablet" />
              ラーメンレビュー
            </h1>
          </div>
        </div>
      </section>
      <section className="section has-background-warning-light">
        <div className="container">
          <div className="block has-text-right">
            <AuthButton />
          </div>
          <Switch>
            <Route path="/" exact>
              <RootPage />
            </Route>
            <Route path="/restaurants" exact>
              <RestaurantListPage />
            </Route>
            <Route path="/restaurants/:restaurantId">
              <RestaurantDetailPage />
            </Route>
          </Switch>
        </div>
      </section>
      <footer className="footer ">
        <div className="content">
          <p className="has-text-centered">
            これはサンプルアプリケーションです。
          </p>
        </div>
      </footer>
    </Router>
  );
}
