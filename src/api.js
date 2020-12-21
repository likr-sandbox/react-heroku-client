function request(path, params = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  const url = `${process.env.REACT_APP_API_ENDPOINT}${path}`;
  const init = Object.assign({ signal }, params);
  return [fetch(url, init).then((response) => response.json()), controller];
}

export function getReviews() {
  return request("/reviews");
}

export function getRestaurants(arg = {}) {
  const params = new URLSearchParams(arg);
  return request(`/restaurants?${params.toString()}`);
}

export function getRestaurant(restaurantId) {
  return request(`/restaurants/${restaurantId}`);
}

export function getRestaurantReviews(restaurantId, arg = {}) {
  const params = new URLSearchParams(arg);
  return request(`/restaurants/${restaurantId}/reviews?${params.toString()}`);
}

export function postRestaurantReview(restaurantId, record, getAccessToken) {
  const controller = new AbortController();
  const { signal } = controller;
  return [
    getAccessToken({
      audience: "https://review-app",
    }).then((token) => {
      const url = `${process.env.REACT_APP_API_ENDPOINT}/restaurants/${restaurantId}/reviews`;
      return fetch(url, {
        body: JSON.stringify(record),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        signal,
      });
    }),
    controller,
  ];
}
