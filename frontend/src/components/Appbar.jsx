import { useNavigate } from "react-router-dom";

export const Appbar = () => {
    const navigate = useNavigate();

    return (
        <div className="shadow h-14 flex justify-between items-center px-4">

            <div className="text-lg font-bold">
                WalletX
            </div>

            <div className="flex items-center space-x-4">

                <div>
                    Welcome Back
                </div>

                <div className="rounded-full h-10 w-10 bg-slate-200 flex items-center justify-center text-xl font-semibold">
                    U
                </div>

                {/* ✅ Logout Button */}
                <button
                    onClick={() => {
                        localStorage.removeItem("token"); // logout
                        navigate("/signin");              // redirect
                    }}
                    className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded-lg"
                >
                    Logout
                </button>

            </div>
        </div>
    );
};