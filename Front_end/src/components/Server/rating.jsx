import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Add_rating(data) {
  try {
    const res = await fetch(`${BASE}/add_rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Get_ratings(productId) {
  try {
    const res = await fetch(`${BASE}/ratings/${productId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Get_all_ratings() {
  try {
    const res = await fetch(`${BASE}/all_ratings`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Delete_rating(id) {
  try {
    const res = await fetch(`${BASE}/delete_rating/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}
