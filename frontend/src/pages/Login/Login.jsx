import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import logoImg from "../../assets/logo.png";
import "./login.css";
import { useActionState } from "react";
import { useNavigate } from "react-router";
const apiUrl = import.meta.env.VITE_API_URL;


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
      errors.push("Korisničko ime mora imati izme u 1 i 20 znakova");
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
      const resData = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const resDataJson = await resData.json();

      if (!resData.ok) {
        return { errors: [resDataJson.message || "Login failed"] };
      }

      if (!resDataJson.user || !resDataJson.token) {
        return { errors: ["Invalid server response"] };
      }

      dispatch(
        authActions.setUser({
          user: resDataJson.user,
          token: resDataJson.token,
        })
      );

      navigate("/");
      return { errors: null };
    } catch (err) {
      return { errors: [err.message] };
    }
  }

  const [formState, formAction] = useActionState(loginAction, { errors: null });

  return (
    <div className="login-container">
      <img src={logoImg} />
      <form method="POST" action={formAction}>
        <div className="input-group">
          <label>Korisničko ime:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="input-group">
          <label>Šifra:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Potvrdi</button>
        {formState.errors && (
          <ul className="errors">
            {formState.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
