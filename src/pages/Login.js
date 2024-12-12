import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { loginAdmin } from '../apis/adminApi'; 
import { Label, Input, Button } from '@windmill/react-ui';
import ImageLight from '../assets/img/login-offic.jpg';
import ImageDark from '../assets/img/login-offic.jpg';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
          history.push('/app');
        }
    }, [history]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
          const data = await loginAdmin({ email, password });
          console.log("Login Response: ", data); 
  
          if (data.token) {
              localStorage.setItem('adminToken', data.token);
              localStorage.setItem('adminID', data.admin.id);
              console.log("Token saved:", data.token);
              console.log("Id here:", data.admin.id);
              history.push('/app'); 
          } else {
              throw new Error('Login failed, please check your credentials.');
          }
      } catch (err) {
          console.log('Error: ', err);
          setError('Invalid credentials, please try again.');
      }
  };
  

    return (
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src={ImageLight}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src={ImageDark}
                alt="Office"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                    <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Admin Login
                    </h1>
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <Label>
                            <span>Email</span>
                            <Input
                                className="mt-1"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@doe.com"
                                required
                            />
                        </Label>
                        <Label className="mt-4">
                            <span>Password</span>
                            <Input
                                className="mt-1"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="***************"
                                required
                            />
                        </Label>
                        <Button type="submit" className="mt-4" block>
                            Log in
                        </Button>
                    </form>
                </div>
            </main>
          </div>
        </div>
      </div>
    );
}

export default Login;
