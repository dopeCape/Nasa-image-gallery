<script>
  import { isLoggedIn } from "../Store/authState.js";
  import Gallery from "./Gallery.svelte";
import {onMount} from "svelte"
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import LoginScreen from "./LoginScreen.svelte";
  const auth = getAuth();
 </script>

<div class="main_div" >
 
  {#if $isLoggedIn}
    <Gallery />
  {:else}
    <LoginScreen />
  {/if}
</div>


<style>
.main_div{
	width:100vw;
	height:100vh;
	max-height: 100vh;
	max-width:100vw;
	overflow:hidden;
	position: relative;


}
</style>

