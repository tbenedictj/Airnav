import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [openCNSCount, setOpenCNSCount] = useState(0);
    const [supportCount, setSupportCount] = useState(0);

    useEffect(() => {
        // Simulasi Fetch Data untuk "Open" CNS
        const fetchOpenCNSCount = async () => {
            try {
                const response = await fetch('/api/cns/open-count'); // Ganti dengan endpoint API Anda
                const data = await response.json();
                setOpenCNSCount(data.count); // Asumsikan respons API mengembalikan { count: number }
            } catch (error) {
                console.error('Error fetching open CNS count:', error);
            }
        };

        // Simulasi Fetch Data untuk "Support" CNS
        const fetchSupportCount = async () => {
            try {
                const response = await fetch('/api/support/count'); // Ganti dengan endpoint API Anda
                const data = await response.json();
                setSupportCount(data.count); // Asumsikan respons API mengembalikan { count: number }
            } catch (error) {
                console.error('Error fetching support count:', error);
            }
        };

        fetchOpenCNSCount();
        fetchSupportCount();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card Peralatan Maintenance */}
                <div className="p-4 bg-white shadow rounded border-l-4 border-green-500">
                    <h2 className="text-lg font-semibold text-green-600">Peralatan Maintenance CNS</h2>
                    <p className="text-3xl font-bold text-gray-800">{openCNSCount}</p>
                    <p className="text-sm text-gray-600">Status: Open</p>
                </div>

                {/* Card Support */}
                <div className="p-4 bg-white shadow rounded border-l-4 border-green-500">
                    <h2 className="text-lg font-semibold text-green-600">Peralatan Maintenance Support </h2>
                    <p className="text-3xl font-bold text-gray-800">{supportCount}</p>
                    <p className="text-sm text-gray-600">Status : Open</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
