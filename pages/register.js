import { useState } from 'react';
import { useRouter } from 'next/router'; 
import { getAuth } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUserAction, setErrorAction, setLoadingAction, setSuccessAction } from '../store/actions';
import { app } from '../firebaseConfig';




function Register() {
    const auth = getAuth(app);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const error = useSelector(state => state.error);
    const loading = useSelector(state => state.loading);
    const success = useSelector(state => state.success);
    const router = useRouter();

    const isValidPassword = (pass) => {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass);
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            dispatch(setErrorAction("Passwords do not match"));
            return;
        }

        if (!isValidPassword(password)) {
            dispatch(setErrorAction("Password should be minimum 8 characters, with at least one letter and one number"));
            return;
        }

        dispatch(setLoadingAction(true));
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            dispatch(setUserAction(userCredential.user));
            dispatch(setSuccessAction(true));
            router.push('/dashboard');  // Redirect the user to the dashboard
        } catch (err) {
            // ... rest of your code
        } finally {
            dispatch(setLoadingAction(false));
        }
    };



    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <label>
                    Email:
                    <input 
                        type="email" 
                        placeholder="Email" 
                        onChange={e => setEmail(e.target.value)} 
                        required
                    />
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        placeholder="Password" 
                        onChange={e => setPassword(e.target.value)} 
                        required
                    />
                </label>
                <label>
                    Confirm Password:
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && (
                <>
                    <p style={{ color: 'green' }}>Registration successful!</p>
                    <a href="/dashboard"><button>Proceed to Dashboard</button></a>
                </>
            )}
            <a href="/login"><button>Already have an account? Login here</button></a>
                  <a href="/"><button>Back to Home</button></a>
        </div>
    );
}

export default Register;

    
