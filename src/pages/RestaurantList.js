import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Loading, Restaurant } from "../components";
import { getRestaurants } from "../api.js";

export default function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const perPage = 5;
  const page = +query.get("page") || 1;

  useEffect(() => {
    const [restaurants, controller] = getRestaurants({
      limit: perPage,
      offset: (page - 1) * perPage,
    });
    restaurants.then((data) => {
      setRestaurants(data);
    });
    return () => {
      controller.abort();
    };
  }, [page]);

  if (restaurants == null) {
    return <Loading />;
  }
  return (
    <>
      <div className="box">
        <nav className="breadcrumb">
          <ul>
            <li>
              <Link to="/">Top</Link>
            </li>
            <li className="is-active">
              <Link to="/restaurants">ラーメン店一覧</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="block">
        {restaurants.rows.map((restaurant) => {
          return <Restaurant key={restaurant.id} restaurant={restaurant} />;
        })}
      </div>
      <div className="block">
        <nav className="pagination is-centered is-small">
          <Link
            className="pagination-previous"
            to={`/restaurants?page=${page - 1}`}
            disabled={page === 1}
          >
            前の{perPage}件
          </Link>
          <Link
            className="pagination-next"
            to={`/restaurants?page=${page + 1}`}
            disabled={perPage * page >= restaurants.count}
          >
            次の{perPage}件
          </Link>
        </nav>
      </div>
    </>
  );
}
