<script>
import {fade} from "svelte/transition"
  import { auth } from "../firebase.js";
  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
  import axios from "axios";
  import { username } from "../Store/authState.js";
    import { onMount } from "svelte";
  let email = "";
  let muted = false;

  let onSignUp = false;
  let emailPlace = "Email";
  let password = "";
  let passwordPlace = "Password";
  let conPass = "";
  let conPassPlace = "Confirm Password";
class TextScramble {
		constructor(el) {
			this.el = el;
			this.chars = '!<>-_\\/[]{}—=+*^?#________';
			this.update = this.update.bind(this);
		}
		setText(newText) {
			const oldText = this.el.innerText;
			const length = Math.max(oldText.length, newText.length);
			const promise = new Promise((resolve) => (this.resolve = resolve));
			this.queue = [];
			for (let i = 0; i < length; i++) {
				const from = oldText[i] || '';
				const to = newText[i] || '';
				const start = Math.floor(Math.random() * 40);
				const end = start + Math.floor(Math.random() * 40);
				this.queue.push({ from, to, start, end });
			}
			cancelAnimationFrame(this.frameRequest);
			this.frame = 0;
			this.update();
			return promise;
		}
		update() {
			let output = '';
			let complete = 0;
			for (let i = 0, n = this.queue.length; i < n; i++) {
				let { from, to, start, end, char } = this.queue[i];
				if (this.frame >= end) {
					complete++;
					output += to;
				} else if (this.frame >= start) {
					if (!char || Math.random() < 0.28) {
						char = this.randomChar();
						this.queue[i].char = char;
					}
					output += `<span style= >${char}</span>`;
				} else {
					output += from;
				}
			}
			this.el.innerHTML = output;
			if (complete === this.queue.length) {
				this.resolve();
			} else {
				this.frameRequest = requestAnimationFrame(this.update);
				this.frame++;
			}
		}
		randomChar() {
			return this.chars[Math.floor(Math.random() * this.chars.length)];
		}
	}
let TextLoaded = false;
let phrases = [
			'Login to Continue',
			"Or SignUp to continue"




		];
onMount(()=>{

		const el = document.getElementById('text');
		const fx = new TextScramble(el);

		let counter = 0;
		const next = () => {
			if (counter == phrases.length) {

			}
			fx.setText(phrases[counter]).then(() => {
				setTimeout(next, 1800);
			});
			counter = (counter + 1)%phrases.length;
		};

		next();

})
  const handleSignUp = async () => {
    console.log(conPass, password);
    if (conPass == password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (user) => {
          const uid = user.user.uid;
          const email = user.user.email;
          await axios
            .post("http://localhost:8000/users/create", {
              email: email,
              uid: uid,
            })
            .catch(console.log)
            .then((data) => {
              $username = data.data.username;

	    phrases = [`Welcome ${data.data.username}`,"Image is loading..."]
            });
        })
        .catch((error) => {
          console.log(error.code);
          if (error.code == "auth/email-already-in-use") {
            emailPlace = "User already exists";
            password = "";
            conPass = "";
          } else if (error.code == "auth/invalid-email") {
            emailPlace = "Invalid Email Address";
            password = "";
            conPass = "";
          } else if (error.code == "auth/weak-password") {
          }

          passwordPlace = "Password should contain at least 6 characters";
          conPass = "";
        });
    } else {
      conPass = "Passwords Dont Match";
    }
  };
  const handleGoToSignUp = () => {
    onSignUp = true;
    password = "";
    email = "";
    emailPlace = "Email";
    passwordPlace = "Password";
  };
  const handleLogin = () => {
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          axios
            .get(`http://localhost:8000/user/${user.user.uid}`)
            .then((data) => {
              console.log(data);
              $username = data.data.username;

	    phrases = [`Welcome ${data.data.username}`,"Image is loading..."]
            });
        })
        .catch((error) => {
          if (error.code == "auth/user-not-found") {
            password = "";
            emailPlace = "User does not exists";
          } else if (error.code == "auth/invalid-email") {
            password = "";
            emailPlace = "Invalid Email";
          } else if (error.code == "auth/wrong-password") {
            passwordPlace = "Invalid Password";
          } else if (error.code == "") {
          }
        });
    } else {
      if (password == "") {
        passwordPlace = "Password cannot be empty";
      }
      if (email == "") {
        emailPlace = "Email cannot be empty";
      }
    }
  };
  const handleBackToLogin = () => {
    email = "";
    password = "";
    conPass = "";
    emailPlace = "Email";
    passwordPlace = "Password";
    conPassPlace = "Confirm Password";
    onSignUp = false;
  };
  const handleGAuth = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;

        await axios
          .post("http://localhost:8000/users/create", {
            email: user.email,
            uid: user.uid,
          })
          .catch(console.log)
          .then((data) => {
            $username = data.data.username;
	    phrases = [`Welcome ${data.data.username}`,"Image is loading..."]
          });

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const mute = () => {
    if (muted) {
      muted = false;
    } else {
      muted = true;
    }

    document.getElementById("video").muted = muted;
  };
</script>

<div class="main_login">
  <video class="back" autoplay loop id="video">
    <source
      class="back"
      src="https://storage.googleapis.com/qwert-41c55.appspot.com/backgournd.mp4"
    />
  </video>
  {#if onSignUp}
    <div class="signup" in:fade={{duration:700,delay:400}} out:fade={{duration:400}}>
      <input
        type="email inp"
        class="inp"
        bind:value={email}
        placeholder={emailPlace}
      />
      <input
        type="text inp"
        class="inp"
        bind:value={password}
        placeholder={passwordPlace}
      />

      <input
        type="text inp"
        class="inp"
        bind:value={conPass}
        placeholder={conPassPlace}
      />
      <div class="sign_btn">
        <button class="signup_button btn" on:click={handleSignUp}>Signup</button
        >
 <button class="g_auth" on:click={handleGAuth}
          ><i class="fa-brands fa-google" /></button
        >

             </div>
        <p class="go_to_signup" on:click={handleBackToLogin}
          >Have a account?<span class="signup_link">Login</span></p
        >


    </div>
  {:else}
    <div class="login" in:fade={{duration:700,delay:400}} out:fade={{duration:400}}>
      <input
        type="email "
        class="inp"
        bind:value={email}
        placeholder={emailPlace}
      />
      <input
        type="text "
        class="inp"
        bind:value={password}
        placeholder={passwordPlace}
      />
      <div class="login_btn">
        <button class="login_button btn" on:click={handleLogin}>Login</button>
        <button class="g_auth" on:click={handleGAuth}
          ><i class="fa-brands fa-google" /></button
        >
      </div>
      <p class="go_to_signup">
        New here?<span class="signup_link" on:click={handleGoToSignUp}
          >Create account</span
        >
      </p>
    </div>
  {/if}
  <button class="mute" on:click={mute}>
    {#if muted}<i class="fa-solid fa-volume-xmark" />{:else}<i
        class="fa-solid fa-volume-high"
      />{/if}
  </button>
  <div class="center_text" id="text">
  JUST A TEXT BOX
  </div>
</div>

<style>
.center_text{
position:absolute ;
font-weight: 900;

top:40%;
color:rgba(210,230,240,1);
font-size:4.5rem;

left:40%;
}
  .go_to_signup {
    color: white;
    margin-left: 50px;

    cursor: default;
  }
  .signup_link:hover {
    font-weight: 900;

    transition: color 400ms linear, font-weight 400ms linear;
    color: white;
  }
  .signup_link {
    transition: color 400ms linear, font-weight 400ms linear;
    cursor: pointer;
    margin-left: 9px;
    color: darkgray;

  }
 .g_auth:hove{

background: rgba(10,10,10,0.9);
 }
 .btn:hover{
 

background: rgba(10,10,10,0.9);
 }
 .sign_btn {
    display: flex;

    font-weight: 900;
    width: 40%;
  }
  .login_btn {
    display: flex;

    font-weight: 900;
    width: 40%;
  }
  .g_auth {
    margin-top: 10px;
    background: space;
    cursor: pointer;
    outline: none;

    font-weight: 900;
    border: 1px solid white;
    color: white;
  }
  @keyframes shake {
    0% {
      transform: rotate(30deg);
    }

    20% {
      transform: rotate(-30deg);
    }
    40% {
      transform: rotate(30deg);
    }
    60% {
      transform: rotate(-30deg);
    }
    80% {
      transform: rotate(30deg);
    }

    100% {
      transform: rotate(-30deg);
      transform: scale(1.05);
    }
  }
  .mute:hover {
    transform: scale(1.05);
    animation: shake 700ms 200ms linear;
  }
  .mute {
    position: absolute;
    left: 50px;
    bottom: 50px;
    height: 30px;
    outline: none;
    border: 1px solid orange;
    background: space;
    color: orange;

    font-weight: 900;
    border-radius: 999%;
  }
  .main_login {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .back {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .inp {
    margin-top: 10px;

    font-weight: 900;
    padding: 10px;
    color: white;

    border: 1px solid white;
    outline: none;
    background: space;
    width: 40%;
  }

  .btn {
    padding: 10px;
width: 100%;
    margin-right: 5px;

    color: white;

cursor: pointer;
    background: space;
    margin-top: 10px;
    outline: none;
    border: 1px solid white;
  }

  .signup {
    position: absolute;
    display: flex;
    width: 40%;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    margin-left: 20px;
    height: 100%;
  }
  .login {
    position: absolute;
    display: flex;
    width: 40%;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    margin-left: 20px;
    height: 100%;
  }
</style>
