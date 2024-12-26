import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [openCNSCount, setOpenCNSCount] = useState(0);
    const [supportCount, setSupportCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpenCNSCount = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'PeralatanCNS'));
                const peralatanData = querySnapshot.docs.map(doc => doc.data());
                const openCount = peralatanData.filter(alat => alat.status === "open").length;
                setOpenCNSCount(openCount);
            } catch (error) {
                console.error('Error fetching open CNS count:', error);
            }
        };

        const fetchSupportCount = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'PeralatanSupport'));
                const supportData = querySnapshot.docs.map(doc => doc.data());
                const openCount = supportData.filter(alat => alat.status === "open").length;
                setSupportCount(openCount);
            } catch (error) {
                console.error('Error fetching support count:', error);
            }
        };

        fetchOpenCNSCount();
        fetchSupportCount();
    }, []);

    const handleNavigateCNS = () => {
        // Navigasi ke halaman Maintenance CNS
        navigate('/mtcns');
    };

    const handleNavigateSupport = () => {
        // Navigasi ke halaman  Maintenance Support
        navigate('/mtsup');
    };
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card Peralatan Maintenance CNS */}
                <div
                    onClick={handleNavigateCNS}
                    className={`cursor-pointer p-4 bg-white shadow rounded border-l-4 ${
                        openCNSCount === 0 ? 'border-green-500' : 'border-red-500'
                    }`}
                >
                    <h2
                        className={`text-lg font-semibold ${
                            openCNSCount === 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        Peralatan Maintenance CNS
                    </h2>
                    <p className="text-3xl font-bold text-gray-800">{openCNSCount}</p>
                    <p className="text-sm text-gray-600">Status: Open</p>
                </div>

                {/* Card Peralatan Maintenance Support */}
                <div
                    onClick={handleNavigateSupport}
                    className={`cursor-pointer p-4 bg-white shadow rounded border-l-4 ${
                        supportCount === 0 ? 'border-green-500' : 'border-red-500'
                    }`}
                >
                    <h2
                        className={`text-lg font-semibold ${
                            supportCount === 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        Peralatan Maintenance Support
                    </h2>
                    <p className="text-3xl font-bold text-gray-800">{supportCount}</p>
                    <p className="text-sm text-gray-600">Status: Open</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
