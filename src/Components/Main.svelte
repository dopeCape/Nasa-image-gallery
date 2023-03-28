<script>
import {isLoggedIn} from "../Store/authState.js";
    import Gallery from "./Gallery.svelte";

import { getAuth, onAuthStateChanged } from "firebase/auth";
    import LoginScreen from "./LoginScreen.svelte";
const auth = getAuth();
 onAuthStateChanged(auth, (user) => {
  if (user) {
$isLoggedIn = true;

    const uid = user.uid;
    // ...
  } else {

$isLoggedIn = false;
    // User is signed out
    // ...
  }
});

</script>


<div>
{#if $isLoggedIn ==null}
<h1>Loading..</h1>
{:else if $isLoggedIn }
<Gallery/>
{:else}
<LoginScreen/>
{/if}
</div>


