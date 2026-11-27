import rollbar from "../../rollbar";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5007";

export async function Get_customers() {
  try {
    const res = await fetch(`${BASE}/customers`, {
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

// শুধু admin এর জন্য
export async function Get_customer(id) {
  try {
    const res = await fetch(`${BASE}/customer/${id}`, {
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

// customer id এখন session থেকে আসে; প্রথম argument শুধু পুরনো call এর সাথে মিল রাখতে
export async function Update_customer_phone(_customerId, phone) {
  try {
    const res = await fetch(`${BASE}/customer/phone`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phone }),
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

// শুধু admin এর জন্য: status = 'active' | 'blocked'
export async function Update_customer_status(id, status) {
  try {
    const res = await fetch(`${BASE}/customer/${id}/status`, {
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