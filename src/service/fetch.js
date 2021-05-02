const serverURL = process.env.SERVER_URL || "http://192.168.0.105:3000";

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

  return fetch(`${serverURL}/${endpoint}`, config).then(async (response) => {
    if (response.ok) {
      return await response.json();
    } else {
      const errorMessage = await response.text();
      return Promise.reject(new Error(errorMessage));
    }
  });
};
