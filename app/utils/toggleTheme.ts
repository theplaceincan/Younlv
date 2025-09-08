export function toggleTheme() {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark");
  }
  if (document.documentElement.classList.value == "dark") {
    return "dark";
  } else return "light";
}
