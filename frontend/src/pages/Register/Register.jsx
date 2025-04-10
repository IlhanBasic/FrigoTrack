import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice.js";
import { useActionState, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./register.css";
import logoImg from "../../assets/logo.png";
const apiUrl = import.meta.env.VITE_API_URL;
const ROLES = ["admin", "user"];
const DEPARTMENTS = ["administracija", "prodaja", "skladiste",undefined];

export default function Register() {
  const [isAdminRole, setIsAdminRole] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function registerAction(prevFormState, formData) {
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    const role = formData.get("role");
    const department = formData.get("department");

    const usernameRegex = /^[a-zA-Z0-9]{1,20}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let errors = [];

    if (username === "" || username.length > 20) {
      errors.push("Korisničko ime mora imati između 1 i 20 znakova");
    } else if (!usernameRegex.test(username)) {
      errors.push("Korisničko ime smije sadržavati samo slova i brojeve");
    }

    if (email === "" || email.length > 40) {
      errors.push("Email mora imati između 1 i 40 znakova");
    } else if (!emailRegex.test(email)) {
      errors.push("Email mora biti u validnom formatu");
    }

    if (!ROLES.includes(role)) {
      errors.push("Uloga mora biti admin ili user");
    }

    if (!DEPARTMENTS.includes(department)) {
      errors.push(
        "Departman mora biti administracija ili prodaja ili skladište"
      );
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
      const response = await fetch(`${apiUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, email, password, role, department }),
      });

      const data = await response.json();

      if (!response.ok) {
        errors.push(data.message || "Registracija nije uspela");
        return { errors };
      }
      dispatch(
        authActions.setUser({
          user: data.user,
          token: data.token,
        })
      );

      toast.success("Uspešna registracija!");
      navigate("/");

      return { errors: null };
    } catch (err) {
      errors.push(err.message || "Došlo je do greške");
      return { errors };
    }
  }

  const [formState, formAction] = useActionState(registerAction, {
    errors: null,
  });
  return (
    <div className="register-container">
      <img src={logoImg} />
      <h1>Registruj korisnika</h1>
      <form action={formAction}>
        <div className="input-group">
          <label>Korisničko ime:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="input-group">
          <label>Šifra:</label>
          <input type="password" id="password" name="password" />
        </div>
        <div className="input-group">
          <label>Vrsta korisnika:</label>
          <select
            name="role"
            onChange={(e) => setIsAdminRole(e.target.value === "admin")}
          >
            <option value="admin">Administrator</option>
            <option value="user" selected={!isAdminRole}>
              Korisnik
            </option>
          </select>
        </div>
        {!isAdminRole && (
          <div className="input-group">
            <label>Vrsta departmana:</label>
            <select name="department">
              <option value="administracija">Administracija</option>
              <option value="skladiste">Skladiste</option>
              <option value="prodaja">Prodaja</option>
            </select>
          </div>
        )}
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
