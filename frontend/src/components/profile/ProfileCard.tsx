"use client"
import React, { useState, useRef, useEffect } from "react";
import {
    Card,
    CardHeader,
    Spacer,
    Button,
    CardBody,
    Image
} from "@nextui-org/react";
import User from "@/types/user";
import displayToast from "../common/Toast";
import { HTTP_METHODS, SERVICE, ToastType } from "@/types/enums";
import ProfilePictureAvatar from "../common/ProfilePictureAvatar";
import api from "@/helpers/endpoint";
import { s3Client, s3GetUrl, s3BucketName } from "@/helpers/aws";

interface ProfileCardProps {
    user: User;
    setImageUrl: (url: string) => void;
}

export default function ProfileCard({ user, setImageUrl }: ProfileCardProps) {

    const [file, setFile] = useState<File>();
    // const [imageUrl, setImageUrl] = useState<string>("");
    const [currImage, setCurrImage] = useState<string | undefined>(user.image);

    const inputFile = useRef<HTMLInputElement>(null);

    const onImageClick = () => {
        if (inputFile.current !== null)
            inputFile.current.click();
    }

    const awsUpload = async (file: File) => {

        const fileKey = `users/${user.id}/image/${file.name}`;
        const fileType = file.type;

        console.log(`S3 Get URL: ${s3GetUrl}`);
        console.log(`S3 bucket: ${s3BucketName}`);

        const fileParams = {
            Bucket: s3BucketName,
            Key: fileKey,
            Expires: 600,
            ContentType: fileType,
          };

        const uploadUrl = await s3Client.getSignedUrlPromise(
            "putObject",
            fileParams,
          );

        console.log("Signature success!", uploadUrl);

        const headers = new Headers();
        headers.append("Content-Type", fileType);
        headers.append("Access-Control-Allow-Origin", "*");

        // Upload image
        await fetch(uploadUrl, {
            method: HTTP_METHODS.PUT,
            headers: headers,
            body: file
        })

        // Get image
        const awsImageUrl = s3GetUrl + fileKey;

        setCurrImage(awsImageUrl);
        setImageUrl(awsImageUrl);

    }

    const handleFileUpload = async (file: File) => {

        // setFile(file)

        try {

            if (!user.id && file) {
                throw Error("User ID is undefined");
            }
    
            const fileKey = `users/${user.id}/image/${file.name}`;
            const fileType = file.type;

            const host = "http://localhost:5005";
            const path = `users/${user.id}/image`;
            const endpoint = `${host}/api/${path}`;

            const formData = new FormData();
            // formData.append('file', file);
    
            const response = await fetch(endpoint, {
                method: HTTP_METHODS.POST,
                body: JSON.stringify({
                    fileKey: fileKey,
                    fileType: fileType
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            })
    
            if (!response.ok) {
                console.log(response)
                throw Error("File failed to upload");
            }
    
            const data = await response.json();

            const uploadS3Url = data.url;
            console.log(data.url);
    
            const headers = new Headers();
            headers.append("Content-Type", fileType);
            headers.append("Access-Control-Allow-Origin", "*");
    
            // Upload the image
            await fetch(uploadS3Url, {
                method: HTTP_METHODS.PUT,
                headers: headers,
                body: file
            })

            localStorage.setItem("filename", file.name);

            
            console.log("Fetching image...")

            const get_image_endpoint = endpoint + `/${file.name}`;

            const response1 = await fetch(get_image_endpoint, {
                method: HTTP_METHODS.GET,
                headers: {
                    "Content-Type": "application/json"
                },
            })

            let data1 = await response1.json();

            setCurrImage(data1.url);
            setImageUrl(data1.url);

        } catch (error) {
            throw Error("File failed to upload, please try again.")
        } 
    }

    const maxSizeInBytes = 3 * 1024 * 1024 // 3 MB

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) {

                if (!isImgValid(selectedFile)) {
                    throw Error("File type not supported.")
                }
                if (selectedFile.size > maxSizeInBytes) {
                    throw Error("File size exceeds the limit.")
                }

                await handleFileUpload(selectedFile);
                // await awsUpload(selectedFile);
              }
        } catch (error: any) {
            console.log(error);
            displayToast(error.message, ToastType.ERROR);
        } finally {

        }

    }

    function isImgValid(file: File): boolean {
        return file.type === 'image/jpeg' || file.type === 'image/png';
    }

    return (
        <>
            <Card className="align-middle items-center justify-center w-full max-h-24 h-24">
                <CardHeader className="flex">
                    <div className="flex flex-row items-center">
                        <div className="w-1/3 items-center">
                            <div className="hover:cursor-pointer hover:scale-110" onClick={() => {onImageClick()}}>
                                <ProfilePictureAvatar size={"12"} profileUrl={currImage ? currImage : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                            </div>
                            <input 
                                type='file' 
                                id='file' 
                                ref={inputFile} 
                                style={{display: 'none'}}
                                onChange={handleFileChange}
                            />
                        </div>
                        <Spacer x={5} />
                        <div className="flex flex-col align-left w-2/3">
                            <text className="text-xl font-bold">{user.name}</text>
                            <text className="text-m">{user.email}</text>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </>
    )
}