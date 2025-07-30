import React from 'react';

import { useEffect, useState, createContext, useContext, useReducer } from 'react';

import ModelUploadComponent from './modelUploadComponent';
import TextureUploadComponent from './textureUploadComponent';
import ModelIntakeComponent from './modelIntakeComponent';

const initialFormData: ModelFormProps = {
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
}
export type ModelsType = File[];

export interface ModelSetType {
    [key: string]: File[];
}

export type ValueOf<T> = T[keyof T];

export interface StringDictionary {
    [key: string]: string;
}
export interface NumberDictionary {
    [key: string]: number;
}
export interface TextureType {
    id: string;
    alpha: boolean;
    animation: boolean;
    displacement: boolean;
    uniquevariants: boolean;
}
export interface TextureSetType {
    [key: string]: TextureType[];
}

export interface LODData {
    texturesets: TextureType[];
    models: string[];
}

export interface ModelFormProps {
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
export type FormDataAction =
  | { type: 'SET_FIELD'; field: keyof ModelFormProps; value: any }
  | { type: 'SET_FORM_DATA'; payload: ModelFormProps }
  | { type: 'RESET_FORM' }
  | { type: 'UPDATE_MODELS'; models: ModelsType[] }
  | { type: 'ADD_TEXTURE_SET'; key: string; textures: TextureType[] }
  | { type: 'REMOVE_TEXTURE_SET'; key: string }
  | { type: 'UPDATE_TEXTURE_MAP'; key: string; value: number }
  | { type: 'UPDATE_COLOR_MAP'; key: string; value: string }
  | { type: 'ADD_COLOR'; color: string }
  | { type: 'REMOVE_COLOR'; color: string };

interface FormDataContextType {
  formData: ModelFormProps;
  dispatch: React.Dispatch<FormDataAction>;
}
export const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export function useFormDataContext() {
    const context = useContext(FormDataContext);
    if (context === undefined) {
        throw new Error('useFormDataContext not found.');
    }
    return context;
}
export function getData(key: string) {
    const items = localStorage.getItem(key);
    let data = items ? JSON.parse(items) : undefined;
    if (data) {
        const modelsArr: ModelsType[] = Array.from({ length: data.lodcount.length }, (_, index) => []);
        data.models = modelsArr;
        return data;
    } else {
        return undefined;
    }
}
function getInitialFormData() {
    const data = getData('formData');
    if (data) {
        return data;
    }  
    return initialFormData;
}

function formDataReducer(state: ModelFormProps, action: FormDataAction): ModelFormProps {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value
            };
        case 'UPDATE_MODELS':
            return {
                ...state,
                'models': action.models
            };
        default:
            return state;
    }
}
const ModelFormComponent: React.FC<{
    model?: Model,
    onSave: (data: ModelFormProps) => void;
}> = ({ model, onSave }) => {
    const [formData, dispatch] = useReducer(formDataReducer, getInitialFormData())
    const [tab, setTab] = useState<Number>(0);


    useEffect(() => {
        localStorage.clear();
    },[]);
    useEffect(() => {
        //localStorage.setItem('formData', JSON.stringify(formData));
    },[formData]);

    const handleSave = (data: ModelFormProps) => {

    }
    const handleChange = (field: keyof ModelFormProps, value: any) => {
        dispatch({ type: 'SET_FIELD', field, value})
    }
    const setFormData = (data: ModelFormProps) => {
        dispatch({ type: 'SET_FORM_DATA', payload: data })
    }
    const clearForm = () => {
        dispatch({ type: 'RESET_FORM' })
    }
    const handleSubmitModels = (data: ModelsType[]) => {

    }
    const handleSetTab = (tab: number) => {
        setTab(tab);
    }
    return (
    <FormDataContext.Provider value={{ formData, dispatch }}>
        <div className="model-form-container">
            <div className="model-form-tabs">
                {Array.from({length: 3 }, (_, index) => (
                    <div key={'tab'+index}>
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
                    </div>
                ))}
            </div>
            {tab === 0 && (
                <ModelIntakeComponent 
                    model={model} 
                    onSubmit={handleSetTab}/>
            )}
            {tab === 1 && (
                <ModelUploadComponent
                    onSubmit={handleSetTab}
                />
            )}
            {tab === 2 && (
                <TextureUploadComponent
                    data={formData}
                />
            )}
        </div>
    </FormDataContext.Provider>
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
                <ModelCardComponent key={model.itemcode} data={model} />
            ))}
            </div>

        </div>
    )
}

export default ModelManagerComponent;