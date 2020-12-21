import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getRestaurant,
  getRestaurantReviews,
  postRestaurantReview,
} from "../api.js";
import { Review } from "../components/Review.js";

export default function RestaurantDetailPage() {
  const params = useParams();
  const { getAccessTokenWithPopup, isAuthenticated } = useAuth0();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const perPage = 5;
  const page = +query.get("page") || 1;

  useEffect(() => {
    const [restaurant, controller] = getRestaurant(params.restaurantId);
    restaurant.then((data) => {
      setRestaurant(data);
    });
    return () => {
      controller.abort();
    };
  }, [params.restaurantId]);

  useEffect(() => {
    const [reviews, controller] = getRestaurantReviews(params.restaurantId, {
      limit: perPage,
      offset: (page - 1) * perPage,
    });
    reviews.then((data) => {
      setReviews(data);
    });
    return () => {
      controller.abort();
    };
  }, [params.restaurantId, page]);

  async function handleFormSubmit(event) {
    event.preventDefault();
    const [post] = postRestaurantReview(
      +params.restaurantId,
      {
        restaurantId: +params.restaurantId,
        title: event.target.elements.title.value,
        comment: event.target.elements.comment.value,
      },
      getAccessTokenWithPopup,
    );
    await post;
    const [reviews] = getRestaurantReviews(params.restaurantId, {
      limit: perPage,
      offset: (page - 1) * perPage,
    });
    const data = await reviews;
    setReviews(data);
  }

  if (restaurant == null || reviews == null) {
    return <p>loading</p>;
  }
  return (
    <>
      <div className="box">
        <nav className="breadcrumb">
          <ul>
            <li>
              <Link to="/">Top</Link>
            </li>
            <li>
              <Link to="/restaurants">ラーメン店一覧</Link>
            </li>
            <li className="is-active">
              <Link to={`/restaurants/${restaurant.id}`}>
                {restaurant.name} の情報
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <article className="box">
        <h3 className="title is-5">{restaurant.name}</h3>
        <div className="columns">
          <div className="column is-6">
            <figure className="image is-square">
              <img src="/noimage.png" alt={restaurant.name} />
            </figure>
          </div>
          <div className="column is-6">
            <figure className="image is-square">
              <div
                className="has-ratio"
                dangerouslySetInnerHTML={{ __html: restaurant.map }}
              ></div>
            </figure>
          </div>
        </div>
      </article>
      <div className="box">
        {reviews.rows.length === 0 ? (
          <p>レビューがまだありません。</p>
        ) : (
          <>
            <div className="block">
              <p>{reviews.count}件のレビュー</p>
            </div>
            <div className="block">
              {reviews.rows.map((review) => {
                return <Review key={review.id} review={review} />;
              })}
            </div>
            <div className="block">
              <nav className="pagination is-centered is-small">
                <Link
                  className="pagination-previous"
                  to={`/restaurants/${restaurant.id}?page=${page - 1}`}
                  disabled={page === 1}
                >
                  前の{perPage}件
                </Link>
                <Link
                  className="pagination-next"
                  to={`/restaurants/${restaurant.id}?page=${page + 1}`}
                  disabled={perPage * page >= reviews.count}
                >
                  次の{perPage}件
                </Link>
              </nav>
            </div>
          </>
        )}
      </div>
      <div className="box">
        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="control">
              <label className="label">タイトル</label>
              <div className="control">
                <input
                  name="title"
                  className="input"
                  required
                  disabled={!isAuthenticated}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="label">コメント</label>
              <div className="control">
                <textarea
                  name="comment"
                  className="textarea"
                  required
                  disabled={!isAuthenticated}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                type="submit"
                className="button is-warning"
                disabled={!isAuthenticated}
              >
                レビューを投稿
              </button>
            </div>
            <p className="help">ログインが必要です。</p>
          </div>
        </form>
      </div>
    </>
  );
}
