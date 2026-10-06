import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Get_offers() {
  try {
    const res = await fetch(`${BASE}/offers`, {
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

export async function Get_offers_with_products() {
  try {
    const res = await fetch(`${BASE}/offers_with_products`, {
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

export async function Add_offer(data) {
  try {
    const res = await fetch(`${BASE}/add_offer`, {
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

export async function Update_offer(id, data) {
  try {
    const res = await fetch(`${BASE}/update_offer/${id}`, {
      method: "PUT",
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

export async function Delete_offer(id) {
  try {
    const res = await fetch(`${BASE}/delete_offer/${id}`, {
      method: "DELETE",
      credentials: "include",
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

export async function Assign_offer(product_id, offer_id) {
  try {
    const res = await fetch(`${BASE}/assign_offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ product_id, offer_id }),
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Remove_offer_from_product(product_id, offer_id) {
  try {
    const res = await fetch(`${BASE}/remove_offer/${product_id}/${offer_id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Get_products_by_offer(offer_id) {
  try {
    const res = await fetch(`${BASE}/products_by_offer/${offer_id}`, {
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

export async function Upload_offer_thumbnail(file) {
  try {
    const formData = new FormData();
    formData.append("thumbnail", file);
    const res = await fetch(`${BASE}/upload_offer_thumbnail`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}
