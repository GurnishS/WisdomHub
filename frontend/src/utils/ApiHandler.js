import config from "../config";
import store from "../store";
import { getAuth } from "firebase/auth";
const SimpleApiHandler = async (url, method, body, message = true) => {
  try {
    const response = await fetch(config.apiUrl + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "POST" ? JSON.stringify(body) : null,
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error("Invalid JSON response");
    }

    if (!response.ok) {
      throw new Error(data.message || "Network response was not ok");
    }

    if (message) {
      store.addMessage({
        type: "Success",
        content: data.message,
      });
    }

    return data;
  } catch (err) {
    store.addMessage({
      type: "Danger",
      content: err.message,
    });
    throw err;
  }
};

const ApiHandler = async (url, method, body, message = true) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log("User: ", user);

    if (!user) return console.error("User not logged in");

    const accessToken = await user.getIdToken();
    console.log("Access Token: ", accessToken);

    if (!accessToken) {
      store.addMessage({
        type: "Danger",
        content: "Refresh token not found, please login",
      });
      window.location.href = "/login";
      return;

    }

    const response = await fetch(config.apiUrl + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: method === "POST" ? JSON.stringify(body) : null,
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error("Invalid JSON response");
    }

    if (!response.ok) {
      throw new Error(data.message || "Network response was not ok");
    }

    if (message) {
      store.addMessage({
        type: "Success",
        content: data.message,
      });
    }

    return data;
  } catch (err) {
    store.addMessage({
      type: "Danger",
      content: err.message,
    });
    throw err;
  }
};

export { SimpleApiHandler, ApiHandler };
