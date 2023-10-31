import { Link } from "react-router-dom";
import imgSrc from "../components/6011.jpg";
import { useSelector } from "react-redux";
import { selectAllConfirmed } from "../features/shoppingCart/shoppingCartSlice";
import { getAllSelected } from "../features/products/productsSlice";
import useLogout from "../features/userRegister/useLogout";

const Navbar = () => {
  const logged = useSelector((state) => state.user.loggedIn);
  const user = useSelector((state) => state.user.userEmail);
  const selected = useSelector(getAllSelected);
  const confirmed = useSelector(selectAllConfirmed)?.length > 0;
  const handleLogout = useLogout();

  return (
    <div>
      <nav>
        <h1 className="page-title">
          <Link to={"/"} className="page-title">
            Simple Online Store
          </Link>
        </h1>
        <section>
          <div className="navContent">
            <div className="navLinks">
              <Link to="/products">products</Link>
              <Link to="/sellers">sellers</Link>
              <Link to="/shoppingCart">
                <img src={imgSrc} alt="" className="img" />
              </Link>
              {selected.length > 0 && (
                <Link to={"/products/selected"} className="Selected-Nav">
                  Selected
                </Link>
              )}
              <Link to={"/products/ordered"}>Ordered</Link>
              {!logged ? (
                <>
                  <Link to={"/signup"}>
                    <button className="signup">Sign Up</button>
                  </Link>
                  <Link to={"/login"}>
                    <button className="login">Log in</button>
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="welcome">Welcome {user}</h2>
                  <button className="add-button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
              {confirmed && logged && (
                <Link to={"/products/ordered/:id"}>Confirmed</Link>
              )}
            </div>
          </div>
        </section>
      </nav>
    </div>
  );
};

export default Navbar;
