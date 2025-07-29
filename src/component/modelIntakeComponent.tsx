import React from 'react';

import { useEffect, useState } from 'react';
import { getData } from '../component/managerComponent';
import type { 
    Model,
    ModelSetType, 
    ModelsType, 
    TextureSetType, 
    TextureType, 
    StringDictionary,
    NumberDictionary,
    LODData,
    ValueOf,
    ModelFormProps
 } from '../component/managerComponent';

const ModelIntakeComponent: React.FC<{
    model?: Model;
    onSubmit: (data: ModelFormProps) => void;
}> = ({model, onSubmit}) => {
    const [formData, setFormData] = useState<ModelFormProps>(() => {
        return getData('formData') || {
        itemcode: '',
        itemname: '',
        category: '',
        subcategory: '',
        material: '',
        models: [],
        zoom: 75,
        texturemap: {},
        texturesets: [],
        colors: [],
        colormap: {},
        lodcount: [],
        description: '',
        creatornote: '',
        version: ''
    }});
    const [errors, setErrors] = useState<StringDictionary>({});

    const validateForm = (): boolean => {
        const newErrors: StringDictionary = {};
        if (formData.itemcode === '') {
            newErrors.itemcode = 'ITEMCODE REQUIRED.'
        } else if (formData.itemcode.length > 16) {
            newErrors.itemcode = 'ITEMCODE MUST BE LESS THAN 16 CHARACTERS.'
        }
        if (formData.itemname === '') {
            newErrors.itemname = 'ITEMNAME REQUIRED.'
        } else if (formData.itemname.length > 32) {
            newErrors.itemname = 'ITEMNAME MUST BE LESS THAN 32 CHARACTERS.'
        }
        if (formData.category === '') {
            newErrors.category = 'CATEGORY REQUIRED.'
        }
        if (formData.subcategory === '') {
            newErrors.subcategory = 'SUBCATEGORY REQUIRED.'
        }
        if (formData.material === '') {
            newErrors.material = 'MATERIAL REQUIRED.'
        }
        if (formData.colors.length === 0) {
            newErrors.colors = 'COLOR(s) REQUIRED'
        }
        if (formData.lodcount.length === 0) {
            newErrors.lodcount = 'LODs REQUIRED'
        }
        if (formData.description === '') {
            newErrors.description = 'DESCRIPTION REQUIRED'
        }
        return Object.keys(newErrors).length === 0;
    }
    const handleChange = (data: Partial<ModelFormProps>) => {
        setFormData(prev => ({...prev, ...data}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    }
    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    },[formData]);
    return (
        <>
            <div className="model-form-input">
                <div className="form-primary">
                    <div className="subform-container primary">
                        <div className="subform-header">
                            <label>ITEMCODE & NAME</label>
                        </div>
                        <div className="subform-input flex">
                            <input 
                                id="input-itemcode" 
                                onChange={(e) => {handleChange({'itemcode': e.target.value})}}
                                value={formData.itemcode}
                                type="text" 
                                placeholder="ITEMCODE"
                            />
                            <input 
                                id="input-itemname" 
                                onChange={(e) => {handleChange({'itemname': e.target.value})}}
                                value={formData.itemname}
                                type="text" 
                                placeholder="ITEMNAME"
                            />
                        </div>
                    </div>
                    <div className="subform-container category">
                        <div className="subform-header">
                            <label>CATEGORY/SUBCATEGORY</label>
                        </div>
                        <div className="subform-input flex">
                            <input 
                                id="input-itemcode" 
                                onChange={(e) => {handleChange({'category': e.target.value})}}
                                value={formData.category}
                                type="text" 
                                placeholder="CATEGORY"
                            />
                            <input 
                                id="input-itemname" 
                                onChange={(e) => {handleChange({'subcategory': e.target.value})}}
                                value={formData.subcategory}
                                type="text" 
                                placeholder="SUBCATEGORY"
                            />
                        </div>
                    </div>

                </div>
                <div className="form-secondary">
                    <div className="subform-container material">
                        <div className="subform-header">
                            <label>MATERIALS</label>
                            {errors.material && <p>{errors.material}</p>}
                        </div>
                        <div className="subform-input">
                            <input 
                                onChange={(e) => {handleChange({'material': e.target.value})}}
                                value={formData.material}
                                type="text" 
                                placeholder="MATERIAL"
                            />
                        </div>
                    </div>
                    <FormColorComponent data={formData.colors} map={formData.colormap} onSave={handleChange}/>
                    <FormLODSComponent data={formData.lodcount} onSave={handleChange}/>
                    <div className="subform-container description">
                        <div className="subform-header">
                            <label>DESCRIPTION</label>
                            {errors.description && <p>{errors.description}</p>}
                        </div>
                        <div className="subform-input">
                            <textarea 
                                className="subform-textarea"
                                onChange={(e) => {handleChange({'description': e.target.value})}}
                                value={formData.description}
                                rows={4}
                                maxLength={420}
                            />
                        </div>
                    </div>
                    <div className="subform-container notes">
                        <div className="subform-header">
                            <label>NOTES</label>
                            {errors.notes && <p>{errors.notes}</p>}
                        </div>
                        <div className="subform-input">
                            <textarea 
                                className="subform-textarea"
                                onChange={(e) => {handleChange({'creatornote': e.target.value})}}
                                value={formData.creatornote}
                                rows={4}
                                maxLength={420}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="model-form-actions">
                <button onClick={handleSubmit}>NEXT</button>
            </div>
        </>
    )
}
const FormLODSComponent: React.FC<{
    data: number[];
    onSave: (data: Partial<ModelFormProps>) => void;
}> = ({data, onSave}) => {
    const [lods, setLods] = useState<number[]>(data);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [formData, setFormData] = useState<NumberDictionary>({
        'polycount': 0
    });
    const [errors, setErrors] = useState<StringDictionary>({
    });
    const validateForm = (): boolean => {
        const newErrors: StringDictionary = {};
        if (formData.polycount <= 0) {
            newErrors.polycount = 'VALUE CANNOT BE ZERO OR NEGATIVE.';
        }
        if (formData.polycount === undefined) {
            newErrors.polycount = 'VALUE REQUIRED.';
        }
        if (Number.isNaN(formData.polycount)) {
            newErrors.polycount = 'VALUE NOT VALID.'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }
    const toggleEdit = () => {
        setIsEditing(true);
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const newArr = [...lods, formData.polycount];
            newArr.sort((a, b) => b - a);
            setLods(newArr)
            setFormData({
                'polycount': 0,
            })
            onSave({'lodcount': newArr});
            setIsEditing(false);
        }

    }
    const removeElement = (value: number) => {
        const newArr = lods.filter(lod => lod !== value);
        setLods(newArr);
        onSave({'lodcount': newArr});
    }
    const handleChange = (key: string) => {
        setFormData(prev => ({...prev, polycount: Number(key)}))
    }
    return (
        <div className="subform-container lods">
            <div className="subform-header">
                <label>LEVEL OF DETAIL:</label>
                {errors.polycount && <p className="error">{errors.polycount}</p>}
            </div>

            <div className="subform-list">
                {lods.length == 0 && (
                    <>
                    <p>NO LODS ADDED</p>
                    </>
                )}
                {lods.length > 0 && (
                    <>
                    {lods.map((lod, i) => (
                    <div
                        key={lod}
                        className="input-card">
                        <p>LOD{i}: {lod} POLYGONS</p>
                        <button onClick={() => {removeElement(lod)}}>X</button>
                    </div>
                    ))}
                    </>
                )}
                {isEditing && (
                <div className="lod-form">
                    <input type="text" 
                            onChange={(e) => {handleChange(e.target.value)}} 
                            placeholder="POLYCOUNT" 
                            value={formData.polycount}/>
                    <button onClick={handleSubmit}>ADD</button>
                </div>
                )}
            </div>

            <div className="subform-actions">
                <button onClick={() => {toggleEdit()}}>ADD LOD</button>
            </div>
        </div>
    )
}
const FormColorComponent: React.FC<{
    data?: string[];
    map?: StringDictionary;
    onSave: (data: Partial<ModelFormProps>) => void;
}> = ({data, map, onSave}) => {
    const [colors, setColors] = useState<string[]>(data || []);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [colorsMap, setColorsMap] = useState<StringDictionary>(map || {});
    const [formData, setFormData] = useState<StringDictionary>({
        'colorcode': '',
        'colorname': ''
    });
    const [errors, setErrors] = useState<StringDictionary>({});


    const validateForm = (): boolean => {
        const newErrors: StringDictionary = {};
        if (formData.colorcode === '' && formData.colorname === '') {
            newErrors.colorcode = 'COLORCODE AND NAME REQUIRED.'
        }
        else if (formData.colorcode === '' && formData.colorname !== '') {
            newErrors.colorcode = 'COLORCODE REQUIRED.'
        }
        else if (formData.colorcode !== '' && formData.colorname === '') {
            newErrors.colorcode = 'COLOR NAME REQUIRED.'
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const toggleEdit = () => {
        setIsEditing(true);
    }
    const handleAddColor = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const newArr = [...colors, formData.colorcode];
            const newMap = {
                ...colorsMap, [formData.colorcode]: formData.colorname
            }
            setColors(newArr);
            setColorsMap(newMap);
            onSave({
                'colormap': newMap,
                'colors': newArr
            });
            setFormData(prev => ({...prev, 'colorcode': '', 'colorname': ''}));
            setIsEditing(false)
        }

    }
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }
    const removeElement = (key: string) => {
        setColors(prev => prev.filter(color => color !== key));
    }
    return (
        <div className="subform-container color">
            <div className="subform-header">
                <label>COLORS:</label>
                {errors.colorcode && <p className="error">{errors.colorcode}</p>}
                {errors.colorname && <p className="error">{errors.colorname}</p>}
            </div>

            <div className="subform-list">
                {colors.length == 0 && (
                    <p>NO COLORS ADDED</p>
                )}
                {colors.map((color) => (
                    <div
                        key={color} 
                        className="input-card">
                        <p>{color}: "{colorsMap[color]}"</p>
                        <button onClick={() => {removeElement(color)}}>
                            X
                        </button>
                    </div>
                ))}
                {isEditing && (
                    <div className="color-form">
                        <input type="text" 
                            onChange={(e) => {handleChange('colorcode', e.target.value)}}
                            placeholder="COLORCODE"
                            value={formData.colorcode} />
                        <input type="text" 
                                onChange={(e) => {handleChange('colorname', e.target.value)}} 
                                placeholder="COLORNAME" 
                                value={formData.colorname}/>
                        <button onClick={handleAddColor}>SAVE</button>
                    </div>
                )}
            </div>
            <div className="subform-actions">
                <button onClick={() => {toggleEdit()}}>ADD COLOR</button>
            </div>
        </div>
    )
}

export default ModelIntakeComponent;
