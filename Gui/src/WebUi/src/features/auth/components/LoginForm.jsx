import {useState} from 'react'
import { useAuth } from '../hooks/useAuth'

function LoginForm() {
    const { loginUser, loading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await loginUser(username, password);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
        >
            <div className="space-y-2">
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                >
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 text-white font-medium rounded-md ${
                    loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    )
}

export default LoginForm