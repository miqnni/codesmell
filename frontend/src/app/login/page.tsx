"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function RegisterForm() {

  const router = useRouter(); 

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.text()
        localStorage.setItem("token", data)
        router.push("/protected/user/profile");
      } else {
        const text = await res.text();
        setResponseMessage(text);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setResponseMessage("Unexpected error occurred");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-sm text-gray-700">{responseMessage}</p>
      )}
    </div>
  );
}
