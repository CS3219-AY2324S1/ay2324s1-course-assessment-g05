import React from 'react'
import { LoginComponent } from '@/components/login/Login';
import { redirect } from "next/navigation";
import api from "@/helpers/endpoint";
import type { Metadata } from "next";
import { createUser } from '@/helpers/user/user_api_wrappers';

export default function LoginPage() {

    // const [name, setName] = React.useState("");
    // const [email, setEmail] = React.useState("");
    // const [password, setPassword] = React.useState("");

    // API

    return (
        <>
            <LoginComponent/>
        </>
    )
}