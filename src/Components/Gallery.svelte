<script>
import { getAuth, signOut } from "firebase/auth";
import {username} from "../Store/authState.js"
import { onAuthStateChanged } from "firebase/auth";
 import { onMount } from "svelte";
import axios from "axios";
let  image_url ="";
const NASA_KEY = import.meta.env.NASA_KEY;
const logMeOfDaddy =()=>{

$username ="";
signOut(getAuth())
}
onMount(()=>{
if($username ==""){
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {


    const uid = user.uid;
    // ...
axios.get(`http://localhost:8000/user/${uid}`).then(data=>{
console.log(data)
$username = data.data.username

})

  } else {


    // User is signed out
    // ...
  }
});

}
axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`).then((data)=>{
image_url = data.data.hdurl
})
})
</script>


<div class="main_gallery">
<button class="logout" on:click={logMeOfDaddy}> LogOut</button>
<p>{$username}</p>
{#if image_url!=""}
<img src={image_url}  class="image" alt="just a img ">
{/if}
</div>
