import React from "react";

const Login = () => {
  return (
    <div
      id="gameDiv"
      className="bg-green d-flex justify-content-center align-items-center vh-100"
    >
      <div>
        {/* <!-- login form div --> */}
        <div id="loginPage">
          <p className="text-white"> Welcome to Card Game! </p>
          <form id="login-form">
            {/* <!-- name field div --> */}
            <div>
              <input
                type="text"
                name="userName"
                placeholder="name"
                required
              />
            </div>
            {/* <!-- game type div --> */}
            <div>
              <select className="w-100" name="gameMode" required>
                <option value="blackjack">Blackjack </option>
                <option value="poker" disabled>
                  Poker{" "}
                </option>
              </select>
            </div>
            {/* <!-- submit div --> */}
            <div>
              <button type="submit" className="btn btn-success">
                Start Game
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
