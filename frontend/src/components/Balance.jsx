export const Balance = ({ value }) => {

    if (value === "...") {
        return (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                <div className="text-gray-500 text-sm">
                    Available Balance
                </div>

                <div className="text-3xl font-bold mt-2 text-green-600">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
            <div className="text-gray-500 text-sm">
                Available Balance
            </div>

            <div className="text-3xl font-bold mt-2 text-green-600">
                ₹{Number(value).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </div>
        </div>
    );
};