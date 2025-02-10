import React from 'react';
import './auth.css'
import { useForm } from 'react-hook-form';
import { useSignInMutation } from '../../context/services/auth.service';
const Auth = () => {
    const { register, handleSubmit, reset } = useForm()
    const [signIn] = useSignInMutation();

    function loginUser(data) {
        console.log(data);
        signIn(data).then((res) => {
            console.log(res);
            localStorage.setItem('access_token', res.data.token);
            localStorage.setItem('role', res.data.role);
            reset()
            window.location.href = '/';
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <div className='auth_page'>
            <form autoComplete='off' onSubmit={handleSubmit(loginUser)}>
                <input type="text" {...register("login")} placeholder="Логин" />
                <input type="password" {...register("password")} placeholder="Пароль" />
                <button type="submit">Вход</button>
            </form>
        </div>
    );
};


export default Auth;