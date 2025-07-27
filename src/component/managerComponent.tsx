import React from 'react';

import { useEffect, useState } from 'react';

type ModelsType = string[];
type ValueOf<T> = T[keyof T];

interface TextureMapType {
    string: number;
}

interface StringDictionary {
    [key: string]: string;
}
interface NumberDictionary {
    [key: string]: number;
}


interface ModelFormProps {
    itemcode: string;
    itemname: string;
    category: string;
    subcategory: string;
    material: string;
    models: ModelsType[];
    zoom: number;
    texturemap: NumberDictionary;
    texturesets: TextureSetType[];
    colors: string[];
    colormap: StringDictionary;
    lodcount: number[];
    description: string;
    creatornote: string;
    version: string;
}

export interface Model extends ModelFormProps {
    lods: string[];
    lodmap: StringDictionary;
    polycount: NumberDictionary;
    colorcodes: string[];
    colormap: StringDictionary;
    obfuscatedpath: string;
    download: string;
    preview: string;
}

interface ModelFormData {
    [key: string]: ValueOf<ModelFormProps>;
}
function getData(key: string) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : undefined;
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
                    <div className="input-card">
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
                    <div className="input-card">
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

const FormStepOneComponent: React.FC<{
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
interface TextureType {
    id: string;
    alpha: boolean;
    animation: boolean;
    displacement: boolean;
    uniquevariants: boolean;
}
interface TextureSetType {
    [key: string]: TextureType[];
}

interface LODData {
    texturesets: TextureType[];
    models: string[];
}
const FormStepTwoComponent: React.FC<{
    data: ModelFormProps;
    model?: Model;
}> = ({ data, model }) => {
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
                        {activeTextureSet.map((textureSet) => (
                            <div className="textureset-card">
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
const ModelFormComponent: React.FC<{
    model?: Model,
    onSave: (data: ModelFormProps) => void;
}> = ({ model, onSave }) => {
    const [formData, setFormData] = useState<ModelFormProps>({
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
    })
    const [tab, setTab] = useState<Number>(0);

    const handleSave = (data: ModelFormProps) => {
        setFormData(prev => ({...prev, data}));
    }
    const handleChange = (data: Partial<ModelFormProps>) => {
        setFormData(prev => ({...prev, data}));
    }
    const handleNextStep = (data: ModelFormProps) => {
        if (tab === 0) {
            setFormData(data);
            setTab(1);
        }
    }
    const handleSetTab = (tab: number) => {
        setTab(tab);
    }
    return (
        <div className="model-form-container">
            <div className="model-form-tabs">
                {Array.from({length: 3 }, (_, index) => (
                    <>
                    {tab === index && (
                    <button 
                        className="form-tab active"
                        onClick={() => {handleSetTab(index)}}
                    >
                        <p>{index}</p>
                    </button>
                    )}
                    {tab !== index && (
                    <button 
                        className="form-tab inactive"
                        onClick={() => {handleSetTab(index)}}
                    >
                        <p>{index}</p>
                    </button>
                    )}
                    </>
                ))}
            </div>
            {tab === 0 && (
                <FormStepOneComponent model={model} onSubmit={handleNextStep}/>
            )}
            {tab === 1 && (
                <FormStepTwoComponent data={formData} />
            )}
        </div>
    )
}

const ModelCardComponent: React.FC<{
    data: Model;
}> = ({ data }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    return (
        <div className="model-card">
            <div className="model-info">
                <h3>{data.itemname.toUpperCase()}</h3>
                <p>{data.itemcode.toUpperCase()}</p>
            </div>
            <div className="model-actions">
                <button>EDIT</button>
            </div>

        </div>
    )
}
const ModelManagerComponent: React.FC = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [activeForm, setActiveForm] = useState<boolean>(false);

    const handleSubmit = (data: ModelFormProps) => {
        console.log("todo");
    }
    useEffect(() => {
        let ignoreStaleRequest = false;
        const url = "http://192.168.4.80:5000/api/v1/items/all/";
        fetch(url, { credentials: "same-origin"})
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                if (!ignoreStaleRequest) {
                    const itemList = data.models.slice();
                    const itemArray: Model[] = [];
                    for (const model of itemList) {
                        const itemDict: Model = {
                            'itemcode': model.itemcode,
                            'itemname': model.itemname,
                            'material': model.material,
                            'colormap': model.colormap,
                            'colorcodes': model.colorcodes,
                            'colors': model.colorcodes,
                            'lodcount': model.lodcount,
                            'lods': model.lods,
                            'lodmap': model.lodmap,
                            'polycount': model.polycount,
                            'category': model.category,
                            'subcategory': model.subcategory,
                            'description': model.description,
                            'creatornote': model.creatornote,
                            'preview': model.preview,
                            'models': model.models,
                            'zoom': model.zoom,
                            'texturesets': model.texturesets,
                            'texturemap': model.texturemap,
                            'version': model.version,
                            'obfuscatedpath': model.obfuscatedpath,
                            'download': model.download
                        };
                        itemArray.push(itemDict);
                    }
                    setModels(itemArray);
                }
            })
            .catch((error) => console.log(error));
        return () => {
            ignoreStaleRequest = true;
        };
    }, []);
    return (
        <div className="model-manager-container">
            <div className="model-manager-header">
                <h1>RML Manager</h1>
            </div>
            <ModelFormComponent onSave={handleSubmit} />
            <div className="model-library">
            {models.map((model) => (
                <ModelCardComponent data={model} />
            ))}
            </div>

        </div>
    )
}

export default ModelManagerComponent;