import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';

import type { ModelFormProps, Model } from '../component/managerComponent';
import { useFormDataContext } from '../component/managerComponent';
import FileDropComponent from '../component/fileDropComponent';
import type { ModelSetType, ModelsType } from '../component/managerComponent';


const ModelUploadComponent: React.FC<{
    onSubmit: (tab: number) => void;
    model?: Model;
}> = ({ onSubmit, model }) => {
    const { formData, dispatch } = useFormDataContext();

    const [uploadedFiles, setUploadedFiles] = useState<ModelsType[]>(formData.models || {});
    const [currentFiles, setCurrentFiles] = useState<File[]>(formData.models[0] || []);
    const [activeLOD, setActiveLOD] = useState<number>(0);

    useEffect(() => {
        console.log(formData);
    },[activeLOD]);
    useEffect(() => {
        dispatch({ type: 'UPDATE_MODELS', models: uploadedFiles })
    },[uploadedFiles]);

    const handleSetActiveLOD = (index: number) => {
        setCurrentFiles(uploadedFiles[index])
        setActiveLOD(index);
    }
    const handleAddFile = (file: File) => {
        const newRow = [...currentFiles, file];
        const newGrid = uploadedFiles.map((row, index) =>
            index === activeLOD ? newRow : row
        );
        console.log(newGrid);
        setUploadedFiles(newGrid);
        setCurrentFiles(newRow);
    }
    const handleRemoveFile = (index: number) => {
        const newRow = currentFiles.filter((_, i) => i !== index);
        const newGrid = uploadedFiles.map((row, index) =>
            index === activeLOD ? newRow : row
        );
        console.log(newGrid);
        setUploadedFiles(newGrid);
        setCurrentFiles(newRow);
    }
    return (
        <>
        <div className="model-form-two">
            <div className="form-lod-tabs">
                {Array.from({length: formData.lodcount.length}, (_, index) => (
                    <div key={'lod-tab-'+index}>
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
                    </div>
                ))}
            </div>
            <div className="model-upload-container">
                <FileDropComponent 
                    onFileSelect={handleAddFile}
                />
                <div className="model-upload-list">
                    {currentFiles && currentFiles.map((model, index) => (
                        <div 
                            key={model.name + index} 
                            className="model-file-card"
                        >
                            <p>{model.name}</p>
                            <button onClick={() => {handleRemoveFile(index)}}>REMOVE</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}

/*
                    {formData.models[activeLOD] && formData.models[activeLOD].map((model, index) => (
                        <div 
                            key={model.name} 
                            className="model-file-card"
                        >
                            <p>{model.name}</p>
                            <button onClick={() => {handleRemoveFile(index)}}>REMOVE</button>
                        </div>
                    ))}
        <div className="model-form-actions">
            <button onClick={() => {handleSubmitModels()}}>NEXT</button>
        </div>
                    {currentFiles.map((file, index) => (
                        <div 
                            key={file.name} 
                            className="model-file-card"
                        >
                            <p>{file.name}</p>
                            <button onClick={() => {handleRemoveFile(index)}}>REMOVE</button>
                        </div>
                    ))}
                    {uploadedFiles['LOD'+activeLOD.toString()] && uploadedFiles['LOD'+activeLOD.toString()].map((file, index) => (
                        <div 
                            key={file.name} 
                            className="model-file-card"
                        >
                            <p>{file.name}</p>
                            <button 
                                onClick={() => {handleRemoveFile(index)}}
                            >
                                REMOVE
                            </button>
                        </div>
                    ))}
*/
export default ModelUploadComponent;