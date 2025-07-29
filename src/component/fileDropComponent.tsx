import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

const FileDropComponent: React.FC<{
    onFileSelect: (file: File) => void;
}> = ({ onFileSelect}) => {
    // drop zone
    const [isDragOver, setIsDragOver] = useState<Boolean>(false);
    const [fileError, setFileError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const validateFile = (file: File): boolean => {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';
        const isGLTF = file.type === 'model/gltf+json' ||
                       file.type === 'model/gltf-binary' ||
                       file.name.toLowerCase().endsWith('.gltf') ||
                       file.name.toLowerCase().endsWith('.glb');

        return isJPG || isGLTF;
    }
    const handleFile = (file: File) => {
        setFileError(null);

        if (!validateFile(file)) {
            setFileError('Only GLTF/GLB 3D models are accepted.');
            return;
        }

        onFileSelect(file);
    };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
        }
    }
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            // todo
        }
    };
    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    }
    const dropZoneStyle: React.CSSProperties = {
        border: `2px solid ${isDragOver ? '#007bff' : '#ccc'}`,
        backgroundColor: isDragOver ? '#f8f9fa' : '#fff',
    };
    return (
        <>
            <div
                className="file-drop-container"
                style={dropZoneStyle}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div style={{ fontSize: '48px', marginBottom: '16px', color: '#6c757d' }}>
                📁
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                {isDragOver ? 'Drop files here' : 'Drop files here or click to browse'}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                Accepts JPG images and GLTF/GLB 3D models
                </div>
            </div>
            <input 
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.gltf,.glb"
                onChange={handleFileInputChange}
                style={{ display: 'none'}}
                 />
        </>
    )
}

export default FileDropComponent;