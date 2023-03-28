<script>
import {auth} from "../firebase.js";
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import axios from "axios";
import {username} from "../Store/authState.js";
let email ="" ;

let onSignUp = false;
let emailPlace = "Email"
let password ="";
let passwordPlace = "Password"
let conPass ="";
let conPassPlace = "Confirm Password"
const handleSignUp=async()=>{
console.log(conPass,password);
if (conPass == password){


	createUserWithEmailAndPassword(auth,email,password).then(async user=>{
	const uid = user.user.uid;
	const email = user.user.email;
await axios.post("http://localhost:8000/users/create",{
email:email,
uid:uid,
}).catch(console.log).then(data =>{
$username  = data.data.username


})
			}).catch(error=>{
console.log(error.code)
if(error.code == "auth/email-already-in-use"){
email = "User already exists"
password = ""
conPass = ""

}else if(error.code == "auth/invalid-email"){
email = "Invalid Email Address"
password = ""
conPass = ""

}else if(error.code =="auth/weak-password"){}

password = "Password should contain at least 6 characters"
conPass = ""		
})
}else{
conPass = "Passwords Dont Match"

}


}
const handleGoToSignUp =()=>{
onSignUp = true;
password = "";
email = "";
emailPlace ="Email"
passwordPlace ="Password"
}
const handleLogin=()=>{
 if(email!="" && password!=""){
signInWithEmailAndPassword(auth,email,password).then(user=>{
axios.get(`http://localhost:8000/user/${user.user.uid}`).then(data=>{
console.log(data)
$username = data.data.username

})

}).catch(error=>{

if(error.code =="auth/user-not-found"){
password = ""
email = "User does not exists"


}else if(error.code == "auth/invalid-email"){
password = ""
email = "Invalid Email"

}else if(error.code  == "auth/wrong-password"){
password= "Invalid Password"
}else if(error.code == ""){

}

})

}else{
if(password == ""){
passwordPlace  = "Password cannot be empty"
}
if(email == ""){

emailPlace  = "Email cannot be empty"
}

}
}
const handleBackToLogin = ()=>{
email = "";
password = "";
conPass = "";
emailPlace =""
passwordPlace ="Password"
conPassPlace ="Confirm Password"
onSignUp=false;
}
const handleGAuth=()=>{
const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then(async(result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;

await axios.post("http://localhost:8000/users/create",{
email:user.email,
uid:user.uid,
}).catch(console.log).then(data =>{
$username  = data.data.username


})

    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

}

</script>


<div class="main_login">
{#if onSignUp}
<div class="signup">

<input type="email" bind:value={email} placeholder={emailPlace} >
<input type="text" bind:value={password} placeholder={passwordPlace}>

<input type="text" bind:value={conPass} placeholder={conPassPlace}>
<button class="signup_button" on:click={handleSignUp}>Signup</button>
<button class ="back_to_login" on:click={handleBackToLogin}>Back To Login</button>

<button class="g_auth" on:click={handleGAuth}><i class="fa-brands fa-google"></i></button>
</div>
{:else}
<div class="login">
<input type="email" bind:value={email}  placeholder={emailPlace}>
<input type="text" bind:value={password} placeholder={passwordPlace}>
<button class="login_button" on:click={handleLogin}>Login</button>
<button class="g_auth" on:click={handleGAuth}><i class="fa-brands fa-google"></i></button>
<p class="go_to_signup">New here?<span class="signup_link" on:click={handleGoToSignUp} >Create account</span> </p>
</div>
{/if}
</div>
<style>
.go_to_signup{
cursor: pointer;
}
</style>
