import { writable } from "svelte/store";

const isLoggedIn = writable(null);
const username = writable("")

export {isLoggedIn,username}
