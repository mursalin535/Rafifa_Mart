const BASE = 'http://localhost:5007';

export async function getAllBottles() {
  const res = await fetch(`${BASE}/bottles`);
  return res.json();
}

export async function getBottleById(id) {
  const res = await fetch(`${BASE}/bottles`);
  const data = await res.json();
  return data.data?.find(b => b.id === Number(id));
}

export async function addBottle(bottle) {
  const res = await fetch(`${BASE}/add_bottle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bottle),
  });
  return res.json();
}

export async function updateBottle(id, fields) {
  const res = await fetch(`${BASE}/update_bottle/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  return res.json();
}

export async function deleteBottle(id) {
  const res = await fetch(`${BASE}/delete_bottle/${id}`, { method: 'DELETE' });
  return res.json();
}
