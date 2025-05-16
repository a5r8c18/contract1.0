const colors: Record<string, string> = {
  A: "bg-red-100",
  B: "bg-blue-100",
  C: "bg-green-100",
  D: "bg-yellow-100",
  E: "bg-purple-100",
  F: "bg-pink-100",
  G: "bg-indigo-100",
  H: "bg-teal-100",
  I: "bg-orange-100",
  J: "bg-lime-100",
  K: "bg-emerald-100",
  L: "bg-cyan-100",
  M: "bg-rose-100",
  N: "bg-fuchsia-100",
  O: "bg-sky-100",
  P: "bg-violet-100",
  Q: "bg-amber-100",
  R: "bg-muted",
  S: "bg-red-100",
  T: "bg-blue-100",
  U: "bg-green-100",
  V: "bg-yellow-100",
  W: "bg-purple-100",
  X: "bg-pink-100",
  Y: "bg-indigo-100",
  Z: "bg-teal-100",
};

const getColorFromName = (name: string) => {
  const firstLetter = name.charAt(0).toUpperCase();
  return colors[firstLetter] || "bg-muted";
};

export default getColorFromName;
