import rollbar from "../../rollbar";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5007";

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

// সর্বজনীন: শুধু { id, product_id, rating }, কোনো customer-এর তথ্য ছাড়া
// (Collection-এর card-এ গড় স্টার দেখানোর জন্য)
export async function Get_public_ratings() {
  try {
    const res = await fetch(`${BASE}/public_ratings`, {
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

// শুধু admin panel-এর জন্য (সব review, customer-এর নাম সহ)
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