import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Assign_offer(productId, offerId) {
  try {
    const res = await fetch(`${BASE}/assign_offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ product_id: productId, offer_id: offerId }),
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Get_all_product_offers() {
  try {
    const res = await fetch(`${BASE}/all_product_offers`, {
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

export async function Get_product_offers(productId) {
  try {
    const res = await fetch(`${BASE}/product_offers/${productId}`, {
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

export async function Remove_offer(productId, offerId) {
  try {
    const res = await fetch(`${BASE}/remove_offer/${productId}/${offerId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}
