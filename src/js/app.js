import { Notepad } from "./Notepad";

const parentElement = document.querySelector("body")

document.addEventListener("DOMContentLoaded", () => {
  new Notepad(parentElement);
})