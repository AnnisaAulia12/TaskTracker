
import Logo from '../../assets/Logo.png';

function HomeHeader({ userName = 'there' }) {
  const firstName = userName.trim().split(/\s+/)[0];

  return (
    <header className="home-header">
      <div className="home-brand">
        <img
          src={Logo}
          alt="Tododish Logo"
          className="home-logo"
        />
      </div>

      <div className="home-greeting">
        <h1>Hallo, {firstName}</h1>
        <p>Let's make today productive</p>
      </div>
    </header>
  );
}

export default HomeHeader;
