import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Add_order_item(data) {
  try {
    const res = await fetch(`${BASE}/add_order_item`, {
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

export async function Get_order_items(orderId) {
  try {
    const res = await fetch(`${BASE}/order_items/${orderId}`, {
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

export async function Update_order_item(id, data) {
  try {
    const res = await fetch(`${BASE}/update_order_item/${id}`, {
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

export async function Delete_order_item(id) {
  try {
    const res = await fetch(`${BASE}/delete_order_item/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}
