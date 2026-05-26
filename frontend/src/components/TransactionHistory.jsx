import { useEffect, useState } from "react";
import axios from "axios";

export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/account/history`,
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        )
            .then((res) => {
                setTransactions(res.data.transactions);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">

            <h2 className="text-xl font-bold mb-4">
                Transaction History
            </h2>

            {transactions.length === 0 ? (
                <div className="text-gray-500">
                    No transactions yet
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((txn) => (
                        <div
                            key={txn._id}
                            className="border rounded-lg p-3 flex justify-between items-center"
                        >
                            <div>
                                <div className="font-medium">
                                    {txn.from?.firstName} → {txn.to?.firstName}
                                </div>

                                <div className="text-sm text-gray-500">
                                    {new Date(
                                        txn.createdAt
                                    ).toLocaleString()}
                                </div>
                            </div>

                            <div className="font-bold text-green-600">
                                ₹{txn.amount}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};