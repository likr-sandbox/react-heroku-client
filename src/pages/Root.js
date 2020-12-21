import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../api.js";
import { Loading, Restaurant } from "../components";

export default function RootPage() {
  const [restaurants, setRestaurants] = useState(null);

  useEffect(() => {
    const [restaurants, controller] = getRestaurants({ limit: 3 });
    restaurants.then((data) => {
      setRestaurants(data);
    });
    return () => {
      controller.abort();
    };
  }, []);

  if (restaurants == null) {
    return <Loading />;
  }
  return (
    <>
      <h2 className="title is-3">人気のラーメン店</h2>
      <div className="block">
        {restaurants.rows.map((restaurant) => {
          return <Restaurant key={restaurant.id} restaurant={restaurant} />;
        })}
      </div>
      <p>
        <Link to="/restaurants">show more</Link>
      </p>
    </>
  );
}
