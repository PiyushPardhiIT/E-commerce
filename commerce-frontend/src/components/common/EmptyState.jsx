import { useNavigate } from 'react-router-dom';

const EmptyState = ({ icon, title, message, buttonText, buttonLink }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      <p className="text-gray-400 mt-2 text-sm">{message}</p>
      {buttonText && (
        <button
          onClick={() => navigate(buttonLink)}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white
                     px-6 py-2 rounded-lg transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;