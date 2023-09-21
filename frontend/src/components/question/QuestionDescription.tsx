import { CircularProgress, Textarea } from "@nextui-org/react";
import dynamic from "next/dynamic";
import React from "react";
import { ChangeEventHandler } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
]


export default function QuestionDescription({
  name,
  value,
  onValueChange,
  disabled = false,
}: {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}) {
  React.useEffect(() => {
    console.log(value);
    
  }, [value])
  return (
    <>
      {/* <Textarea
        isRequired
        name={name}
        label="Description"
        labelPlacement="outside"
        placeholder="Enter question description, sample and constrains etc"
        minRows={10}
        maxRows={20}
        value={value}
        onChange={onChange}
        onValueChange={onValueChange}
        disabled={disabled}
      /> */}
      <div className="w-full">
      <p className="text-small">Descriptions<span className="text-danger">*</span></p>
      <ReactQuill
        className="py-2 my-2 rounded-lg"
        value={value}
        onChange={onValueChange}
        placeholder="Enter question description, sample and constrains etc"
        modules={modules}
        formats={formats}
        readOnly={disabled}
        theme="snow" />
      </div>
    </>
  );
}
