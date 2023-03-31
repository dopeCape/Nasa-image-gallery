<script>
  import { getAuth, signOut } from "firebase/auth";
  import { username, isLoggedIn } from "../Store/authState.js";
  import { onAuthStateChanged } from "firebase/auth";
  import { onMount } from "svelte";
  import axios from "axios";
  let image_url = "";
  const NASA_KEY = import.meta.env.VITE_NASA_KEY;

  const logMeOfDaddy = () => {
    $isLoggedIn = false;
    $username = "";

    signOut(getAuth());
  };
  onMount(() => {
    if ($username == "") {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          // ...
          axios.get(`http://localhost:8000/user/${uid}`).then((data) => {
            console.log(data);
            $username = data.data.username;
          });
        } else {
          // User is signed out
          // ...
        }
      });
    }
    axios
      .get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`)
      .then((data) => {
        image_url = data.data.hdurl;
      });
  });
</script>

<div class="main_gallery">
  <div class="cont">
  <button class="logout" on:click={logMeOfDaddy}> LogOut</button>

</div>
  {#if image_url != ""}
    <img src={image_url} class="image" alt="image is loading.." />
  {/if}
</div>
<style>
.cont{
background: radial-gradient(to right,red,green, blue);
}
.username{
font-size: 2rem;
font-weight: 500;


}
.main_gallery{
position:absolute;
width:100%;
max-height:100% ;
overflow: hidden;
height:100%;

}
.image{
position: absolute;
width: 100%;
height: 100%;
}
.logout:hover{

background:rgba(10,10,10,0.9);
border:2px solid white;
color:white;
}
.logout{
cursor: pointer;
transition: all 200ms linear;
position: absolute;
right: 20px;
background: gray;
outline: none;
z-index: 1;
top:10px;

border:2px solid rgba(10,10,10);
padding: 10px;

}

</style>
