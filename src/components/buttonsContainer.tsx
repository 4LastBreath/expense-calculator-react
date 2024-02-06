import React, { useState, useEffect } from 'react';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';
import { Item } from './main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

interface ButtonsContainerProps {
  calculateRemainingAmount: () => number;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleResetValue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  data: Item[];
  setData: React.Dispatch<React.SetStateAction<Item[]>>;
  money: string;
  result: number;
}

const ButtonsContainer: React.FC<ButtonsContainerProps> = ({handleResetValue, calculateRemainingAmount, setShowModal, data, result, money, setData}) => {

  const {language} = useLanguage();
  const translatedData = dataLanguages[language];
  const [showError, setShowError] = useState(false);
  const [addInputValue, setAddInputValue] = useState('');

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddInputValue(e.target.value)
    setShowError(false)
  }

  const handleShowModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowModal(true)
  }

  const handleResetCheckbox = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newData = data.map(item => ({ ...item, checked: false }));
    setData(newData);
  };

  const handleDeleteSelected = () => {
    const newData = data.filter((item) => !item.checked);
    setData(newData);
  };

  const handleAddInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputValue = addInputValue;

    if (data.length > 24) {
      return
    }

    if (inputValue.trim() !== '') {
      setData([...data, {initialName: inputValue.toLocaleLowerCase(), name: inputValue, value: '', sign: '-', checked: false }]);
      setAddInputValue('');
      setShowError(false);
    } else {
      setShowError(true)
    }
  };

  useEffect(() => {
    let resetErrorTimeout: NodeJS.Timeout;

    if(showError === true) {
        resetErrorTimeout = setInterval(() => {
            setShowError(false)
        }, 5000);
    }
    return () => clearInterval(resetErrorTimeout)
  }, [showError])

  const isInputChecked = data.some((item) => item.checked);

  return (
    <div className='bottom relative'>

      {isInputChecked && 
            <div className='button-delete-cancel_container flex gap-50'>
              <button className="button red-button"onClick={handleDeleteSelected}>{translatedData.delete}</button>
              <button className='button grey-button' onClick={handleResetCheckbox}>{translatedData.cancel}</button>
            </div>
      }

      <form action="" className="form-add flex gap-50 mx-auto" onSubmit={handleAddInput}>
          <div className="add-input_container relative">
              <input type="text" className="input" placeholder={translatedData.addFieldPlaceholder} maxLength={20} value={addInputValue} onChange={handleAddInputChange} />
              {showError && <div className='error-message'>{translatedData.error}</div>}
          </div>
          <button className="button add-button" type="submit">
              <FontAwesomeIcon icon={faPlus}/>
          </button>
      </form>

      <div className='mx-auto flex gap-50'>
      <button className="button" onClick={calculateRemainingAmount}>{translatedData.calculate}</button>
      <button className="button" onClick={handleShowModal}>{translatedData.exportPDF}</button>
      <button className="button red-button" onClick={handleResetValue}>
        <FontAwesomeIcon icon={faWandMagicSparkles} />
      </button>
      </div>

      <div className="result">{result.toFixed(2)}{money}</div>
  </div>
  );
};

export default ButtonsContainer;