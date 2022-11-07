import React, { useState, useRef, MutableRefObject } from "react"
import { loginSchema } from "../validations/login.validation"
import { useAuth } from "../lib/auth";
import { useForm } from "react-hook-form"
import { joiResolver} from "@hookform/resolvers/joi"
import LoginType from "../interfaces/Login.type";
import { Link, useNavigate } from "react-router-dom"
import {BiHide, BiShow} from "react-icons/bi"

function Login(){
    
    const [isPassword, setIsPassword] = useState(false)
    const [visible, setVisible] = useState(false)
    const inputPassword= useRef() as MutableRefObject<HTMLInputElement>

    const CheckPassword = (e: any)=>{
        if(e.target.value === null || e.target.value === undefined || e.target.value === ''){
            setIsPassword(false)
        } else {
            setIsPassword(true)
        }
    }

    const showPassword = (e: any) => {
        e.preventDefault();
        if(inputPassword.current.type === "password"){
            setVisible(true); 
            inputPassword.current.type ="text"
        }else{
            setVisible(false);
            inputPassword.current.type ="password"
        } 
    }

    const {
        register, 
        formState:{ errors },
        handleSubmit
    } = useForm<LoginType.loginFields>({ resolver: joiResolver(loginSchema)})
    const navigate = useNavigate()
    const {login} = useAuth();

    const onLogin = async (data: any)=>{
       const res: any =  await login(data);
       console.log('res', res.data)
       if (res.data.code == 5000){
            localStorage.setItem('email', data.email)
            navigate('/verify-otp')
       }
    }

    return(
        <section className="w-full h-[115vh] bg-[#fafafa] flex justify-center text-[#262626]">
            <div className="w-[350px] h-[69%] mt-4 flex flex-col justify-between w-full">
                <form onSubmit={handleSubmit(onLogin)} className="bg-white border-[1px] h-[85%]" >
                    <div className="h-[35%] flex justify-center items-center">
                        <p className="logo">APP</p>
                    </div>
                    <div className="border-black flex justify-center ">
                        <div className="form-floating w-[78%] border-[1px] flex justify-center">
                            <input 
                                type='email'
                                placeholder="name@example.com" id="floatingEmail"
                                className="input rounded-sm form-control w-full bg-[#fafafa]"
                                {...register("email")} 
                            /> <label htmlFor="floatingEmail" className="label text-xs text-gray-700 border-2">Email</label>
                        </div>
                    </div>
                    <div className="border-black flex justify-center ">
                        <div className="form-floating w-[78%] border-[1px] flex mt-2 relative justify-center">
                            <input 
                                type='password'
                                placeholder="password" id="floatingPassword"
                                {...register("password")} 
                                onChange={CheckPassword}
                                ref={inputPassword}
                                className="input rounded-sm form-control w-full bg-[#fafafa]"
                            /> <label htmlFor="floatingPassword" className="label text-xs text-gray-700 border-2 focus:outline-none focus:shadow-none">password</label>
                            <span className={`absolute ${isPassword == false? "hidden":null} right-2 inset-y-1/2`}>{visible == false ? <button onClick={showPassword} className="cursor-pointer"><BiShow /></button> : 
                            <button onClick={showPassword}className="cursor-pointer "><BiHide/></button> }</span>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 h-8">
                        <button className="bg-[#0095f6] rounded-sm font-bold text-sm text-white px-2 w-[78%]">Se connecter</button>
                    </div>
                    <div className="text-red-500 translate-y-4 flex justify-center items-center">
                        {errors.email && <span>{errors.email.message}</span>}
                        {errors.password && <span>{errors.password.message}</span>}
                    </div>
                    
                    <div className="w-full flex justify-center mt-12">
                        <Link to="/" className="w-full flex justify-center"><a><p className="text-xs">Mot de passe oublié ?</p></a></Link>
                    </div>
                </form>
                <div className="bg-white border-[1px] h-[13%] flex justify-center items-center">
                    <p className="text-sm">Vous n'avez pas de compte? <Link to="/register"><a className="text-[#0095f6]">Inscrivez-vous</a></Link></p>
                </div>
            </div>
            
        </section>
        
    )
}

export default Login