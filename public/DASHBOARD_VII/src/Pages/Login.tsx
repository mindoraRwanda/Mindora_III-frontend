import  { useState } from 'react';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../Redux/store';
import { loginUser } from '../Redux/Adminslice/authSlice';
import Mindora from '../assets/Logo/logo.png';



const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);
  


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // navigate('/dashboard');
      try {
        const resultAction = await dispatch(loginUser({ email, password }));
        
        if (loginUser.fulfilled.match(resultAction)) {

          if (loginUser.fulfilled.match(resultAction)) {
            // Log the full user data
            console.log('Login successful! Full user data:', {
              fullPayload: resultAction.payload,
              user: resultAction.payload.user,
              role: resultAction.payload.user.role,
              therapistId: resultAction.payload.user.therapistId,
              token: resultAction.payload.token,
              additionalInfo: resultAction.payload.user.additionalInfo,
            });
          };
          const role = resultAction.payload.user.role;
          if (role === 'Admin') {
            navigate('/dashboard');
          } else
           if (role === 'Therapist') {
            navigate('/therapy');
          } else {
            alert('Unauthorized access');
            navigate('/');
          }
        } 

        else {
          console.log(resultAction);
          alert('Login failed');
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to Login: ${errorMessage}`);
      }
      
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white flex flex-col items-center rounded-md p-8 space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
        <div className="flex space-x-8">
          <div className="rounded-lg w-96 h-96 flex items-center justify-center">
            <img 
            src={Mindora}
            alt="logo"
            style={{ objectFit: 'cover', height: '384px', width: '384px' }}/>
          </div>
          <div className="rounded-lg w-96">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3  text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Logging in...' : 'Sign In'}
                </button>
              </div>
              {status === 'failed' && error && <p className="text-red-500">{error}</p>}

            </form>
            <div className="mt-6 text-center">
              <Link to='/forgot-password' className="text-sm text-blue-500 hover:underline">Forgot password?
              </Link>
            </div>
            <div className="mt-8 border-t pt-6">
              <p className="text-sm text-gray-500 text-center">
                Dont have an account?{' '}
                <a href="#" className="text-blue-500 hover:underline">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;