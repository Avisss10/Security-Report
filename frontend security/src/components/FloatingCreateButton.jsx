import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingCreateButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="fixed bottom-24 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
      onClick={() => navigate('/create')}
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default FloatingCreateButton;
