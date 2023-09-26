import React from 'react'
import { LoginComponent } from '@/components/login/Login';
import { redirect } from "next/navigation";
import api from "@/helpers/endpoint";
import type { Metadata } from "next";

export default function LoginPage() {

    return (
        <>
            <LoginComponent/>
        </>
    )
}