import React from "react";
import { usePocket } from "../contexts/PocketContext";

export default function Signup() {
  const { register } = usePocket();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");

  return (
    <section>
      <form
        onSubmit={() => register(email, password)}
        className="flex flex-col space-y-4"
      >
        <div className="flex flex-col space-y-2">
          <label htmlFor="">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          ></input>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          ></input>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="">Confirm Password</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(event) => {
              setPasswordConfirm(event.target.value);
            }}
          ></input>
        </div>
      </form>
    </section>
  );
}
