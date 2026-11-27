import rollbar from "../../rollbar";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5007";

async function request(path, method, body) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    return await res.json();
  } catch (err) {
    rollbar.error(err);
    console.log("error occured in server:", err);
  }
}

// customer_id server এখন session থেকে নেয়, তাই পাঠানোর দরকার নেই
export const Add_address = (data) => request("/add_address", "POST", data);
export const Get_address = (id) => request(`/address/${id}`, "GET");
export const Get_addresses = (customerId) => request(`/addresses/${customerId}`, "GET");
export const Get_default_address = (customerId) => request(`/address/default/${customerId}`, "GET");
export const Update_address = (id, data) => request(`/update_address/${id}`, "PUT", data);
export const Set_default_address = (customerId, addressId) =>
  request(`/set_default_address/${customerId}/${addressId}`, "PUT");
export const Delete_address = (id) => request(`/delete_address/${id}`, "DELETE");