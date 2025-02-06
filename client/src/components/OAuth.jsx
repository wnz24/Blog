import React from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const auth = getAuth(app);  // Get Firebase Auth instance
        const provider = new GoogleAuthProvider();
        provider.getCustomParameters({ prompt: 'Select an account' })

        try {
            const result = await signInWithPopup(auth, provider);  // Sign in with Google
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    googlePhotoURL: result.user.photoURL
                }),
            })


            if (!res.ok) {
                throw new Error("Failed to authenticate with backend");
            }
            
            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')


        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    };

    return (
        <Button
            type="button"
            gradientDuoTone="pinkToOrange"
            outline
            onClick={handleGoogleClick}
        >
            <AiFillGoogleCircle className="w-6 h-6" />
            Continue with Google
        </Button>
    );
};

export default OAuth;
