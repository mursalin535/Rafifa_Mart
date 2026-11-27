// Order status শুধু এই ক্রমে এগোতে পারে: pending -> confirmed -> shipped -> delivered
const FLOW = ['pending', 'confirmed', 'shipped', 'delivered'];

function canTransition(from, to) {
  const fromIndex = FLOW.indexOf(from);
  const toIndex = FLOW.indexOf(to);

  // অচেনা status হলে false
  if (fromIndex === -1 || toIndex === -1) return false;

  // শুধু ঠিক পরের ধাপে যাওয়া যাবে
  return toIndex === fromIndex + 1;
}

module.exports = { canTransition };