import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice.js";
import { useActionState, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoImg from "../../assets/logo.png";
const apiUrl = import.meta.env.VITE_API_URL;
import "./login.css";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function loginAction(prevFormState, formData) {
    const username = formData.get("username");
    const password = formData.get("password");
  
    const usernameRegex = /^[a-zA-Z0-9]{1,20}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
  
    let errors = [];
  
    if (username === "" || username.length > 20) {
      errors.push("Korisničko ime mora imati između 1 i 20 znakova");
    } else if (!usernameRegex.test(username)) {
      errors.push("Korisničko ime smije sadržavati samo slova i brojeve");
    }
  
    if (password.length < 6) {
      errors.push("Šifra mora imati minimalno 6 znakova");
    } else if (!passwordRegex.test(password)) {
      errors.push(
        "Šifra mora sadržavati barem jedno veliko slovo, barem jedno malo slovo i barem jednu cifru"
      );
    }
  
    if (errors.length > 0) {
      return { errors };
    }
  
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { errors: [data.message || "Prijava nije uspela"] };
      }
  
      if (!data.user || !data.token) {
        return { errors: ["Neispravan odgovor servera"] };
      }
  
      dispatch(
        authActions.setUser({
          user: data.user,
          token: data.token,
        })
      );
      toast.success("Uspešna prijava!");
      navigate("/");
  
      return { errors: null }; 
    } catch (err) {
      return { errors: [err.message || "Došlo je do greške"] }; 
    }
  }
  
  const [formState, formAction] = useActionState(loginAction, { errors: null });
  return (
    <div className="login-container">
      <h1>Prijavite se</h1>
      <img src={logoImg} />
      <form action={formAction}>
        <div className="input-group">
          <label>Korisničko ime:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="input-group">
          <label>Šifra:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Potvrdi</button>
        {formState?.errors && (
          <ul className="errors">
            {formState.errors.map((err) => {
              return <li key={err}>{err}</li>;
            })}
          </ul>
        )}
      </form>
    </div>
  );
}
