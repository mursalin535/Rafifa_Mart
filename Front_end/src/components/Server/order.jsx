import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Add_order(data) {
  try {
    const res = await fetch(`${BASE}/add_order`, {
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

export async function Add_bottle_order(data) {
  try {
    const res = await fetch(`${BASE}/add_bottle_order`, {
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

export async function Get_orders() {
  try {
    const res = await fetch(`${BASE}/orders`, {
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

export async function Get_orders_by_customer(customerId) {
  try {
    const res = await fetch(`${BASE}/orders/customer/${customerId}`, {
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

export async function Get_order_by_id(id) {
  try {
    const res = await fetch(`${BASE}/order/${id}`, {
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

export async function Update_order_status(id, status) {
  try {
    const res = await fetch(`${BASE}/update_order_status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Delete_order(id) {
  try {
    const res = await fetch(`${BASE}/delete_order/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}
