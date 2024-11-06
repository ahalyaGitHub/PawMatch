
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  // Handler for Users box click
  const handleUserBoxClick = () => {
    navigate('/admin/adoptionRequest'); // Redirect to AdminAdoptionRequest page
  };

  const handleScroll = () => {
    if (contactRef.current) {
        contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
};

  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* Pet Box */}
        <div className="flex flex-col items-center justify-center bg-blue-200 hover:bg-blue-300 transition-all p-8 rounded-lg shadow-lg cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Pets</h2>
          <p className="text-gray-700">Manage pet details and updates</p>
        </div>

        {/* Users Box */}
        <div
          onClick={handleUserBoxClick}
          className="flex flex-col items-center justify-center bg-green-200 hover:bg-green-300 transition-all p-8 rounded-lg shadow-lg cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-gray-700">Review adoption requests</p>
        </div>
      </div>
    </div>
   
      
 
    
    </>
  );
}

export default AdminDashboard;
