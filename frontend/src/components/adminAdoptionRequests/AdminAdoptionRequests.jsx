import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navbar from '../navbar/Navbar';

export default function AdminAdoptionRequests() {
    const [adoptionRequests, setAdoptionRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('https://pet-adoption-jr7a.onrender.com/adoptions', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const requests = await res.json();

                const detailedRequests = await Promise.all(requests.map(async (request) => {
                    const userRes = await fetch(`https://pet-adoption-jr7a.onrender.com/users/${request.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    const petRes = await fetch(`https://pet-adoption-jr7a.onrender.com/pets/${request.petId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    const user = await userRes.json();
                    const pet = await petRes.json();
                    return {
                        ...request,
                        user,
                        pet
                    };
                }));

                setAdoptionRequests(detailedRequests);
            } catch (error) {
                console.error("Error fetching adoption requests:", error);
            }
        };
        fetchRequests();
    }, []);

    // Function to handle rejection with reason
    const handleReject = async (id) => {
        const reason = prompt("Please provide a reason for rejection:");
        if (!reason) return; // Abort if no reason is provided

        await updateStatus(id, 'revoke', reason);
    };

    const updateStatus = async (id, status, reasonToReject = '') => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`https://pet-adoption-jr7a.onrender.com/adoptions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    resolvedDate: new Date(),
                    reasonToReject 
                })
            });
    
            // Update the local state
            setAdoptionRequests((prev) =>
                prev.map((req) => (req._id === id ? { ...req, status, reasonToReject } : req))
            );
        } catch (error) {
            console.error("Error updating adoption status:", error);
        }
    };
    

    // Generate PDF for a single adoption request
    const generateSingleReport = (request) => {
        try {
            const doc = new jsPDF();
            doc.text('Adoption Request Report', 10, 10);

            doc.text(`Adopter Name: ${request.user?.name || 'Not Available'}`, 10, 20);
            doc.text(`Email: ${request.user?.email || 'Not Available'}`, 10, 30);
            doc.text(`Phone: ${request.user?.phone || 'Not Available'}`, 10, 40);

            doc.text(`Pet ID: ${request.pet?.pet_id || 'Not Available'}`, 10, 60);
            doc.text(`Breed: ${request.pet?.breed || 'Not Available'}`, 10, 70);
            doc.text(`Requested Date: ${new Date(request.requestedDate).toLocaleDateString()}`, 10, 80);
            doc.text(`Status: ${request.status}`, 10, 90);
            doc.text(`Resolved Date: ${request.resolvedDate ? new Date(request.resolvedDate).toLocaleDateString() : 'Pending'}`, 10, 100);
            if (request.reasonToReject) {
                doc.text(`Rejection Reason: ${request.reasonToReject}`, 10, 110);
            }

            doc.save(`Adoption_Report_${request._id}.pdf`);
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    // Generate PDF for all adoption requests
    const generateAllReports = () => {
        try {
            const doc = new jsPDF();
            doc.text('All Adoption Requests Report', 10, 10);

            const headers = [['Adopter Name', 'Email', 'Pet ID', 'Breed', 'Status', 'Requested Date', 'Resolved Date']];
            const data = adoptionRequests.map((request) => [
                request.user?.name || 'N/A',
                request.user?.email || 'N/A',
                request.pet?.pet_id || 'N/A',
                request.pet?.breed || 'N/A',
                request.status,
                new Date(request.requestedDate).toLocaleDateString(),
                request.resolvedDate ? new Date(request.resolvedDate).toLocaleDateString() : 'Pending'
            ]);

            doc.autoTable({
                head: headers,
                body: data,
                startY: 20,
            });

            doc.save('All_Adoption_Requests_Report.pdf');
        } catch (error) {
            console.error("Error generating all reports:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Adoption Requests Dashboard</h1>

                <div className="w-full max-w-6xl space-y-6">
                    {adoptionRequests.map((request) => (
                        <div key={request._id} className="bg-white shadow-xl p-6 border-t-4 border-sky-500">
                            <div className="bg-sky-500 text-white text-center text-2xl font-semibold py-3">
                                Adoption Request Details
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800">Adopter Information</h2>
                                    <p className="text-gray-600"><strong>Name:</strong> {request.user?.name || 'Not Available'}</p>
                                    <p className="text-gray-600"><strong>Email:</strong> {request.user?.email || 'Not Available'}</p>
                                    <p className="text-gray-600"><strong>Phone:</strong> {request.user?.phone || 'Not Available'}</p>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800">Adoption Request Details</h2>
                                    <p className="text-gray-600"><strong>Requested Date:</strong> {new Date(request.requestedDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600"><strong>Reason:</strong> {request.reasonToAdopt}</p>
                                    <p className="text-gray-600"><strong>Status:</strong> <span className={`font-semibold ${request.status === 'adopted' ? 'text-green-600' : 'text-red-500'}`}>{request.status}</span></p>
                                    <p className="text-gray-600"><strong>Resolved Date:</strong> {request.resolvedDate ? new Date(request.resolvedDate).toLocaleDateString() : 'Pending'}</p>
                                    {request.reasonToReject && (
                                        <p className="text-gray-600"><strong>Rejection Reason:</strong> {request.reasonToReject}</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800">Pet Information</h2>
                                    <p className="text-gray-600"><strong>Pet ID:</strong> {request.pet?.pet_id || 'Not Available'}</p>
                                    <p className="text-gray-600"><strong>Breed:</strong> {request.pet?.breed || 'Not Available'}</p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6 border-t pt-4">
                                <button
                                    onClick={() => handleReject(request._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 transition duration-300"
                                >
                                    Rejected
                                </button>
                                <button
                                    onClick={() => updateStatus(request._id, 'adopted')}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 transition duration-300"
                                >
                                    Adopted
                                </button>
                                <button
                                    onClick={() => generateSingleReport(request)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 transition duration-300"
                                >
                                    Download Report
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={generateAllReports}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 transition duration-300 mt-8"
                    >
                        Download All Reports
                    </button>
                </div>
            </div>
        </>
    );
}
