import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Upload_image(productId, formData) {
  try {
    const res = await fetch(`${BASE}/upload_image/${productId}`, {
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

export async function Get_all_product_images() {
  try {
    const res = await fetch(`${BASE}/all_product_images`, {
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

export async function Get_product_images(productId) {
  try {
    const res = await fetch(`${BASE}/product_images/${productId}`, {
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

export async function Set_primary_image(imageId, productId) {
  try {
    const res = await fetch(`${BASE}/set_primary_image/${imageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ product_id: productId }),
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Delete_image(imageId) {
  try {
    const res = await fetch(`${BASE}/delete_image/${imageId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}
