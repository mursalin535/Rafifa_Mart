import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Get_bottles() {
  try {
    const res = await fetch(`${BASE}/bottles`, {
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

export async function Get_bottle_by_id(id) {
  try {
    const res = await fetch(`${BASE}/bottles`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    return data.data?.find((b) => b.id === Number(id));
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

export async function Add_bottle(data) {
  try {
    const res = await fetch(`${BASE}/add_bottle`, {
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

export async function Update_bottle(id, data) {
  try {
    const res = await fetch(`${BASE}/update_bottle/${id}`, {
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

export async function Delete_bottle(id) {
  try {
    const res = await fetch(`${BASE}/delete_bottle/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}
