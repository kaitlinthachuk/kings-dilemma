const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

export const api = (endpoint, { body, ...customConfig } = {}) => {
  const headers = { "content-type": "application/json" };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(`${SERVER_URL}/${endpoint}`, config).then(async (response) => {
    if (response.ok) {
      return await response.json();
    } else {
      const errorMessage = await response.text();
      return Promise.reject(new Error(errorMessage));
    }
  });
};
