import React, { useState, useRef } from 'react';

import type { ModelFormProps, Model } from '../component/managerComponent';
import { useFormDataContext } from '../component/managerComponent';
import FileDropComponent from '../component/fileDropComponent';

import type { 
    ModelSetType, 
    ModelsType, 
    TextureSetType, 
    TextureType, 
    StringDictionary, 
    LODData,
    ValueOf
 } from '../component/managerComponent';

const TextureUploadComponent: React.FC<{
    model?: Model;
}> = ({ model }) => {
    const { formData, dispatch } = useFormDataContext();
    const [activeLOD, setActiveLOD] = useState<Number>(0);

    const [textureSets, setTextureSets] = useState<TextureSetType>({});
    const [activeTextureSet, setActiveTextureSet] = useState<TextureType[]>([])
    const [editingTextures, setEditingTextures] = useState<Boolean>(false);

    const [textureFormData, setTextureFormData] = useState<TextureType>({
        id: '',
        alpha: false,
        animation: false,
        displacement: false,
        uniquevariants: false
    });
    const [textureErrors, setTextureErrors] = useState<StringDictionary>({});

    const [LODData, setLODData] = useState<LODData[]>([]);

    const validateTextures = (): boolean => {
        const newErrors: StringDictionary = {};

        return Object.keys(newErrors).length === 0;
    }
    const handleSetActiveLOD = (lod: number) => {
        setTextureSets(prev => ({...prev, ['LOD'+activeLOD.toString()]: activeTextureSet}));

        if (Object.hasOwn(textureSets, 'LOD'+lod.toString())) {
            setActiveTextureSet(textureSets['LOD'+lod.toString()])
        } else {
            setActiveTextureSet([]);
        }
        setActiveLOD(lod);
    }

    const handleSetEditingTextures = () => {
        setEditingTextures(true);
    }

    const handleTextureChange = (field: string, value: ValueOf<TextureType>) => {
        setTextureFormData(prev => ({...prev, [field]: value}));
    }
    const handleAddTextureSet = () => {
        if (validateTextures()) {
            const newArr = [...activeTextureSet, textureFormData];
            setActiveTextureSet(newArr);
            setEditingTextures(false);
            setTextureFormData({
                id: '',
                alpha: false,
                animation: false,
                displacement: false,
                uniquevariants: false
            });
        }
    }
    return (
        <div className="model-form-two">
            <div className="form-lod-tabs">
                {Array.from({length: formData.lodcount.length}, (_, index) => (
                    <div key={index}>
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
            <div className="form-lod-container">
                <div className="lod-textures-container">
                    <div className="lod-header">
                        <label>TEXTURE SETS</label>
                    </div>
                    <div className="lod-textures">
                        {editingTextures && (
                            <div className="texture-form">
                                <div className="texture-fields">
                                    <label>ID</label>
                                    <input 
                                        type="text"
                                        onChange={(e) => {handleTextureChange('id', e.target.value)}}
                                        value={textureFormData.id}
                                    />
                                </div>
                                <div className="texture-fields">
                                    <label>ALPHA</label>
                                    <input 
                                        type="checkbox"
                                        onChange={(e) => {handleTextureChange('alpha', e.target.value)}}
                                        checked={textureFormData.alpha}
                                    />
                                </div>
                                <div className="texture-fields">
                                    <label>ANIMATED</label>
                                    <input 
                                        type="checkbox"
                                        onChange={(e) => {handleTextureChange('animation', e.target.value)}}
                                        checked={textureFormData.animation}
                                    />
                                </div>
                                <div className="texture-fields">
                                    <label>DISPLACEMENT</label>
                                    <input 
                                        type="checkbox"
                                        onChange={(e) => {handleTextureChange('displacement', e.target.value)}}
                                        checked={textureFormData.displacement}
                                    />
                                </div>
                                <div className="texture-fields">
                                    <label>UNIQUE</label>
                                    <input 
                                        type="checkbox"
                                        onChange={(e) => {handleTextureChange('uniquevariants', e.target.value)}}
                                        checked={textureFormData.uniquevariants}
                                    />
                                </div>
                                <div className="texture-action">
                                    <button onClick={() => {handleAddTextureSet()}}>SAVE</button>
                                </div>
                            </div>
                        )}
                        {activeTextureSet.map((textureSet, i) => (
                            <div key={'textureset'+i}
                                className="textureset-card">
                                <div className="texture-fields">
                                    <p>ID: {textureSet.id}</p>
                                </div>
                                <div className="texture-fields">
                                    <p>ALPHA: {textureSet.alpha ? "TRUE" : "FALSE"}</p>
                                </div>
                                <div className="texture-fields">
                                    <p>ANIMATED: {textureSet.animation ? "TRUE" : "FALSE"}</p>
                                </div>
                                <div className="texture-fields">
                                    <p>DISPLACEMENT: {textureSet.displacement ? "TRUE" : "FALSE"}</p>
                                </div>
                                <div className="texture-fields">
                                    <p>UNIQUE: {textureSet.uniquevariants ? "TRUE" : "FALSE"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lod-actions">
                    <button onClick={() => handleSetEditingTextures()}>ADD TEXTURE</button>
                </div>
            </div>
        </div>
    )
}

export default TextureUploadComponent;