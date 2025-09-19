import { createContext, useReducer, useContext, ReactNode } from 'react';
import type { ColorType, ModelFormProps, Model,  ModelSetType, ModelsType, ValueOf, TextureType } from '../component/managerComponent';
import FileDropComponent from '../component/fileDropComponent';
import { getData } from '../component/managerComponent';
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

export type FormDataAction =
  | { type: 'SET_FIELD'; field: keyof ModelFormProps; value: any }
  | { type: 'SET_FORM_DATA'; payload: ModelFormProps }
  | { type: 'RESET_FORM' }
  | { type: 'UPDATE_MODELS'; models: ModelsType[] }
  | { type: 'ADD_TEXTURE_SET'; key: string; textures: TextureType[] }
  | { type: 'REMOVE_TEXTURE_SET'; key: string }
  | { type: 'UPDATE_TEXTURE_MAP'; key: string; value: number }
  | { type: 'UPDATE_COLOR_MAP'; key: string; value: string }
  | { type: 'ADD_COLOR'; color: ColorType }
  | { type: 'REMOVE_COLOR'; color: string };

  // Reducer function
function formDataReducer(state: ModelFormProps, action: FormDataAction): ModelFormProps {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };

    case 'SET_FORM_DATA':
      return action.payload;

    case 'RESET_FORM':
      return initialFormData;

    case 'UPDATE_MODELS':
      return {
        ...state,
        models: action.models
      };

    case 'ADD_TEXTURE_SET':
      return {
        ...state,
        texturesets: [
          ...state.texturesets,
          { [action.key]: action.textures }
        ]
      };

    case 'REMOVE_TEXTURE_SET':
      return {
        ...state,
        texturesets: state.texturesets.filter(set => !(action.key in set))
      };

    case 'UPDATE_TEXTURE_MAP':
      return {
        ...state,
        texturemap: {
          ...state.texturemap,
          [action.key]: action.value
        }
      };

    case 'UPDATE_COLOR_MAP':
      return {
        ...state,
        colormap: {
          ...state.colormap,
          [action.key]: action.value
        }
      };

    case 'ADD_COLOR':
      return {
        ...state,
        colors: [...state.colors, action.color]
      };

    case 'REMOVE_COLOR':
      return {
        ...state,
        colors: state.colors.filter(color => color.colorcode !== action.color)
      };

    default:
      return state;
  }
}

// Context type
interface FormDataContextType {
  formData: ModelFormProps;
  dispatch: React.Dispatch<FormDataAction>;
}

// Create context
const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

// Provider component
interface FormDataProviderProps {
  children: ReactNode;
  initialData?: ModelFormProps;
}

export function FormDataProvider({ children }: FormDataProviderProps) {
  const [formData, dispatch] = useReducer(
            formDataReducer,
            initialFormData,
  );

  return (
    <FormDataContext.Provider value={{ formData, dispatch }}>
      {children}
    </FormDataContext.Provider>
  );
}

// Custom hook to use the context
export function useFormData() {
  const context = useContext(FormDataContext);
  if (context) {
    return context;
  }
  if (context === undefined) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return getData('formData') || initialFormData;
}

// Helper functions for common operations
export const useFormDataHelpers = () => {
  const { dispatch } = useFormData();
  return {
    setField: (field: keyof ModelFormProps, value: any) => 
      dispatch({ type: 'SET_FIELD', field, value }),
    
    setFormData: (data: ModelFormProps) => 
      dispatch({ type: 'SET_FORM_DATA', payload: data }),
    
    resetForm: () => 
      dispatch({ type: 'RESET_FORM' }),
    
    updateModels: (models: ModelsType[]) => 
      dispatch({ type: 'UPDATE_MODELS', models }),
    
    addTextureSet: (key: string, textures: TextureType[]) => 
      dispatch({ type: 'ADD_TEXTURE_SET', key, textures }),
    
    removeTextureSet: (key: string) => 
      dispatch({ type: 'REMOVE_TEXTURE_SET', key }),
    
    updateTextureMap: (key: string, value: number) => 
      dispatch({ type: 'UPDATE_TEXTURE_MAP', key, value }),
    
    updateColorMap: (key: string, value: string) => 
      dispatch({ type: 'UPDATE_COLOR_MAP', key, value }),
    
    addColor: (color: ColorType) => 
      dispatch({ type: 'ADD_COLOR', color }),
    
    removeColor: (color: string) => 
      dispatch({ type: 'REMOVE_COLOR', color })
  };
};