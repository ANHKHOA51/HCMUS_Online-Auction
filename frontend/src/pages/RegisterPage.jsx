import { Outlet } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
    return (
        <>
            <RegisterForm />
            <Outlet />
        </>
    );
}
