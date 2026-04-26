import { Link } from 'react-router-dom';
const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <p className="text-gray-600 mt-2">
          You are not authorized to view this page.
        </p>
        <Link to="/"
              className="mt-4 inline-block bg-blue-600 text-white
                         px-6 py-2 rounded-lg">
          Go Home
        </Link>
      </div>
    </div>
  );
};
export default UnauthorizedPage;