import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">

          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />

          <InputBox
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            label={"First Name"}
          />

          <InputBox
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            label={"Last Name"}
          />

          <InputBox
            onChange={(e) => setUsername(e.target.value)}
            placeholder="user@gmail.com"
            label={"Email"}
          />

          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
          />

          <div className="pt-4">
            <Button
              label={loading ? "Creating Account..." : "Sign up"}
              onClick={async () => {
                if (loading) return;

                try {
                  setLoading(true);

                  const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
                    {
                      username,
                      firstName,
                      lastName,
                      password
                    }
                  );

                  localStorage.setItem(
                    "token",
                    response.data.token
                  );

                  toast.success("Account created successfully!");

                  navigate("/dashboard");

                } catch (e) {
                  console.log(e);

                  toast.error(
                    e?.response?.data?.message ||
                    "Error while creating account"
                  );
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>

          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />

        </div>
      </div>
    </div>
  );
};