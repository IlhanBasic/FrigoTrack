import { useNavigate } from 'react-router-dom';
import "./error.css";

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">❄️</div>
        <h1>Oops! Došlo je do greške</h1>
        <p>Izgleda da je ova stranica zamrznuta kao naše voće!</p>
        <div className="error-details">
          <p>Ne brinite, naši tehničari već rade na odmrzavanju problema.</p>
          <p>U međuvremenu, možete se vratiti na početnu stranicu.</p>
        </div>
        <button className="error-button" onClick={() => navigate('/')}>
          Nazad na početnu
        </button>
      </div>
      <div className="frozen-fruits">
        <span>🍇</span>
        <span>🍓</span>
        <span>🍒</span>
        <span>🍎</span>
        <span>🍓</span>
      </div>
    </div>
  );
}