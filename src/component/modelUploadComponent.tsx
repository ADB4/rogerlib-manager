import React, { useState, useRef } from 'react';

import type { ModelFormProps, Model } from '../component/managerComponent';
import FileDropComponent from '../component/fileDropComponent';

import type { ModelSetType, ModelsType } from '../component/managerComponent';
interface ModelType {
    id: string;
}


const ModelUploadComponent: React.FC<{
    data: ModelFormProps;
    onSubmit: (data: ModelsType[]) => void;
    model?: Model;
}> = ({data, onSubmit, model}) => {

    const [uploadedFiles, setUploadedFiles] = useState<ModelSetType>({});
    const [currentFiles, setCurrentFiles] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [activeLOD, setActiveLOD] = useState<Number>(0);

    const handleSetActiveLOD = (index: number) => {
        console.log("current files:");
        console.log(currentFiles);
        setUploadedFiles(prev => ({...prev, ['LOD'+activeLOD.toString()]: currentFiles}))

        if(uploadedFiles.hasOwnProperty('LOD'+index.toString()) && uploadedFiles['LOD'+index.toString()].length > 0) {
            setCurrentFiles(uploadedFiles['LOD'+index.toString()])
        } else {
            setCurrentFiles([])
        }
        setActiveLOD(index);
    }
    const handleFileSelect = (file: File) => {
        setCurrentFiles(prev => [...prev, file]);
    }
    const handleRemoveFile = (index: number) => {
        setCurrentFiles(prev => prev.filter((_, i) => i !== index));
    }
    const handleSubmitModels = () => {
        let modelsArr = [];
        for (const key in Object.keys(uploadedFiles)) {
            modelsArr.push(uploadedFiles[key]);
        }
        onSubmit(modelsArr)
    }
    return (
        <>
        <div className="model-form-two">
            <div className="form-lod-tabs">
                {Array.from({length: data.lodcount.length}, (_, index) => (
                    <>
                    {activeLOD === index && (
                    <button 
                        className="form-lod-tab active"
                        onClick={() => {handleSetActiveLOD(index)}}
                    >
                        <p>LOD{index}</p>
                    </button>
                    )}
                    {activeLOD !== index && (
                    <button 
                        className="form-lod-tab inactive"
                        onClick={() => {handleSetActiveLOD(index)}}
                    >
                        <p>LOD{index}</p>
                    </button>
                    )}
                    </>
                ))}
            </div>
            <div className="model-upload-container">
                <FileDropComponent 
                    onFileSelect={handleFileSelect}
                />
                <div className="model-upload-list">
                    {currentFiles.map((file, index) => (
                        <div 
                            key={file.name} 
                            className="model-file-card"
                        >
                            <p>{file.name}</p>
                            <button onClick={() => {handleRemoveFile(index)}}>REMOVE</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="model-form-actions">
            <button onClick={() => {handleSubmitModels()}}>NEXT</button>
        </div>
        </>
    )
}

export default ModelUploadComponent;