import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Add_address(data) {
  try {
    const res = await fetch(`${BASE}/add_address`, {
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

export async function Get_address(id) {
  try {
    const res = await fetch(`${BASE}/address/${id}`, {
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

export async function Get_addresses(customerId) {
  try {
    const res = await fetch(`${BASE}/addresses/${customerId}`, {
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

export async function Get_default_address(customerId) {
  try {
    const res = await fetch(`${BASE}/address/default/${customerId}`, {
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

export async function Update_address(id, data) {
  try {
    const res = await fetch(`${BASE}/update_address/${id}`, {
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

export async function Set_default_address(customerId, addressId) {
  try {
    const res = await fetch(`${BASE}/set_default_address/${customerId}/${addressId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Delete_address(id) {
  try {
    const res = await fetch(`${BASE}/delete_address/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Delete_all_addresses(customerId) {
  try {
    const res = await fetch(`${BASE}/delete_addresses/${customerId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}
