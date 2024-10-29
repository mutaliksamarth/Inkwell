import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@mutaliksamarth/zod-inference-medium-blog";
import { EyeIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    });

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            console.log(response.data.token)
            const jwt = await response.data.token;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch {
            alert(`Error while ${type === "signup" ? "signing up" : "signing in"}`);
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-3xl font-extrabold text-center mb-4">
                    {type === "signup" ? "Create an account" : "Sign in to your account"}
                </div>
                <div className="text-slate-500 text-center mb-6">
                    {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                    <Link className="pl-2 text-gray-950" to={type === "signin" ? "/signup" : "/signin"}>
                        {type === "signin" ? "Sign up" : "Sign in"}
                    </Link>
                </div>
                <div className="space-y-4">
                    {type === "signup" && (
                        <LabelledInput
                            label="Name"
                            placeholder="Enter Your Name"
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value
                                });
                            }}
                        />
                    )}

                    <LabelledInput
                        label="Email"
                        placeholder="Enter your Email"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                email: e.target.value
                            });
                        }}
                    />

                    <LabelledInput
                        label="Password"
                        type="password"
                        placeholder="Enter your Password"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value
                            });
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={sendRequest}
                    className="mt-8 w-full text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    {type === "signup" ? "Sign up" : "Sign in"}
                </button>
                    <div>{postInputs.name}</div>
                    <div>{postInputs.email} </div>
                    <div>{postInputs.password}</div>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = `input-${label.toLowerCase().replace(" ", "-")}`;

    return (
        <div>
            <label htmlFor={inputId} className="block mb-2 text-sm text-gray-700 font-semibold">{label}</label>
            <div className="relative">
                <input
                    onChange={onChange}
                    type={type === "password" && showPassword ? "text" : type || "text"}
                    id={inputId}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder={placeholder}
                    required
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                    </button>
                )}
            </div>
        </div>
    );
}
