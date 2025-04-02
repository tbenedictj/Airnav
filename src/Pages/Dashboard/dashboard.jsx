import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";

const Dashboard = () => {
    const [openCNSCount, setOpenCNSCount] = useState(0);
    const [supportCount, setSupportCount] = useState(0);
    const [suhuPeralatan, setSuhuPeralatan] = useState({ amsc: 0, localizer: 0 });

    // State untuk Chatbot
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

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

        const fetchSuhuPeralatan = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'SuhuPeralatan'));
                const suhuData = querySnapshot.docs.map(doc => doc.data());
                setSuhuPeralatan({
                    // We'll replace AMSC with realtime data
                    localizer: suhuData.find(item => item.nama === "Localizer 18")?.suhu || 0,
                });
            } catch (error) {
                console.error('Error fetching suhu peralatan:', error);
            }
        };

        fetchOpenCNSCount();
        fetchSupportCount();
        fetchSuhuPeralatan();
    }, []);

    // Add realtime temperature monitoring for AMSC
    useEffect(() => {
        const database = getDatabase();
        const suhuRef = ref(database, 'sensor/suhu'); 
        const unsubscribe = onValue(suhuRef, (snapshot) => {
            const suhuValue = snapshot.val() || 0;
            setSuhuPeralatan(prev => ({
                ...prev,
                amsc: suhuValue
            }));
        }, (error) => {
            console.error("Error reading realtime suhu:", error);
            setSuhuPeralatan(prev => ({
                ...prev,
                amsc: 0
            }));
        });

        return () => unsubscribe();
    }, []);

    const handleNavigateCNS = () => navigate('/alat-mt-cns');
    const handleNavigateSupport = () => navigate('/alat-mt-sup');

    // Fungsi untuk men-submit pertanyaan (placeholder)
    const handleChatbotSubmit = () => {
        // Di sini bisa memanggil API Chatbot sebenarnya
        // Saat ini hanya placeholder
        setAnswer(`Jawaban chatbot (placeholder) untuk pertanyaan: "${question}"`);
        setQuestion('');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Status Suhu Peralatan */}
            <div className="mt-6 p-4 bg-white shadow rounded">
                <h2 className="text-lg font-semibold mb-2 text-black">Suhu Peralatan :</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-100 rounded text-center">
                        <p className="text-sm text-gray-500">AMSC</p>
                        <p className={`text-3xl font-bold italic ${
                            suhuPeralatan.amsc > 40 ? 'text-red-500' : 'text-green-400'
                        }`}>
                            {suhuPeralatan.amsc}°C
                        </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded text-center">
                        <p className="text-sm text-gray-500">Localizer 18</p>
                        <p className={`text-3xl font-bold italic ${
                            suhuPeralatan.localizer > 40 ? 'text-red-500' : 'text-green-400'
                        }`}>
                            {suhuPeralatan.localizer}°C
                        </p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Status Suhu Peralatan</p>
                <p className={`font-bold italic ${
                    suhuPeralatan.amsc > 40 || suhuPeralatan.localizer > 40 ? 'text-red-500' : 'text-green-400'
                }`}>
                    {suhuPeralatan.amsc > 40 || suhuPeralatan.localizer > 40 ? 'Overheat' : 'Normal'}
                </p>
            </div>

            {/* Bagian Chatbot */}
            <div className="mt-6 p-4 bg-white shadow rounded">
                <h2 className="text-lg font-semibold mb-2 text-black">Tanya Chatbot</h2>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    onClick={() => navigate('/chatbot')}
                    placeholder="Tulis pertanyaan di sini..."
                />
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate('/chatbot')}
                >
                    Kirim
                </button>

                {/* Jawaban chatbot */}
                {answer && (
                    <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded">
                        <p className="text-gray-700">Jawaban Chatbot:</p>
                        <p className="text-gray-800 font-semibold">{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;