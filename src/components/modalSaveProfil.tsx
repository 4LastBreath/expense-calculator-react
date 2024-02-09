import React from 'react';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';

interface ModalSaveProfilProps {
  setShowModalSave: React.Dispatch<React.SetStateAction<boolean>>
  saveChosenProfil: string
  setSaveChosenProfil: React.Dispatch<React.SetStateAction<string>>
  handleSaveNames: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ModalSaveProfil: React.FC<ModalSaveProfilProps> = ({setShowModalSave, saveChosenProfil, setSaveChosenProfil, handleSaveNames}) => {

  const {language} = useLanguage();
  const translatedData = dataLanguages[language];

  const savedNames1= localStorage.getItem('savedNames-1');
  const parsedNames1: string[] = JSON.parse(savedNames1 ?? '[]');

  const savedNames2= localStorage.getItem('savedNames-2');
  const parsedNames2: string[] = JSON.parse(savedNames2 ?? '[]');

  const handleCloseModalBG = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('modal')) {
      setShowModalSave(false);
    }
  };

  const handleSelectSaveProfil = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveChosenProfil(e.target.value)
  }

  return (
    <div className='modal flex align-center justify-center' onClick={handleCloseModalBG}>
      <div className='modal_center flex flex-column align-center justify-center'>

            <h3>{translatedData.saveAs}</h3>

          <div className='flex-flex-column gap-50'>
            <div className='modal-save_radio | flex flex-column align-center gap-100' >

                <input type="radio" 
                    name='profil-choice' 
                    id='profil-1' 
                    value={'1'} 
                    checked={saveChosenProfil === '1'}
                    onChange={handleSelectSaveProfil}
                />
                
                <label htmlFor="profil-1" className='cursor-pointer flex flex-column gap-100 align-center' title={savedNames1 ? parsedNames1.join(', ') : ''}>
                  <div className='profil_name'>{translatedData.profile1}</div>

                  <div className='profil_infos | text-center pointer-events-none'>
                    {savedNames1 && savedNames1 !== '[]' ? parsedNames1.join(', ') : translatedData.empty}
                  </div>
                </label>

            </div>
            
            <div className='flex flex-column align-center gap-100 modal-save_radio' >

                <input type="radio" 
                    name='profil-choice' 
                    id='profil-2' 
                    value={'2'} 
                    checked={saveChosenProfil === '2'}
                    onChange={handleSelectSaveProfil}
                />
                
                <label htmlFor="profil-2" className='cursor-pointer flex flex-column gap-100 align-center' title={savedNames2 ? parsedNames2.join(', ') : ''}>
                  <div className='profil_name'>{translatedData.profile2}</div>

                  <div className='profil_infos | text-center pointer-events-none'>
                      {savedNames2 && savedNames2 !== '[]' ? parsedNames2.join(', ') : translatedData.empty}
                  </div>
                </label>

            </div>
          </div>
            

            <button className='button' onClick={handleSaveNames}>{translatedData.save}</button>

      </div>
    </div>
  );
};

export default ModalSaveProfil;