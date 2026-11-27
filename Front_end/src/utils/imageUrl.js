// আপলোড করা ছবি database-এ থাকে শুধু path হিসেবে (/uploads/...), তাই সামনে backend-এর ঠিকানা বসাতে হয়।
// পুরো URL (https://...) হলে যেমন আছে তেমনই থাকে।
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5007";

export function imageSrc(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}