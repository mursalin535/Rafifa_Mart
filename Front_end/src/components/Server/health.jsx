import rollbar from "../../rollbar";

const BASE = "http://localhost:5007";

export async function Health_check() {
  try {
    const res = await fetch(`${BASE}/health`, {
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
