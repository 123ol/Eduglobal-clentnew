import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/context/useAuthContext";
import { useNotificationContext } from "@/context/useNotificationContext";

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveSession } = useAuthContext();
  const { showNotification } = useNotificationContext();

  const schema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectUser = () => {
    const redirectTo = searchParams.get("redirectTo") || "/";
    navigate(redirectTo);
  };

  const login = handleSubmit(async (values) => {
    setLoading(true);
    try {
      // Log the data being sent
      console.log("Sending to backend:", values);

      const res = await axios.post(
        "https://eduglobal-servernew-1.onrender.com/api/auth/login",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Log the full response from backend
      console.log("Response from backend:", res);
      console.log("Backend data:", res.data);

      if (res.data.token) {
        saveSession(res.data); // save all user info + token in context & cookie

        showNotification({ message: "Login successful", variant: "success" });
        redirectUser();
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      showNotification({
        message: error.response?.data?.message || "Login failed",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  });

  return { control, login, loading };
};

export default useSignIn;
