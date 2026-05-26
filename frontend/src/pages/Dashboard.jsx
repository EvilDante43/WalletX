import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useEffect, useState } from "react"
import { TransactionHistory } from "../components/TransactionHistory"
import axios from "axios"

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/account/balance`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(response => {
            setBalance(response.data.balance);
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        })
    }, []);

    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={loading ? "..." : balance} />
            <TransactionHistory />
            <Users />
        </div>
    </div>
}