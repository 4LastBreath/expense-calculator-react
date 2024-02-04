import React, { useState, useEffect } from 'react';
import InputsContainer from './inputContainer';
import ButtonsContainer from './buttonsContainer';
import ModalExportPDF from './modalExportPDF';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';


export interface Item {
  initialName: string;
  name: string;
  value: string;
  sign: '+' | '-';
  checked: boolean;
}

interface MainProps {
  initialAmount: string;
  money: string;
}

const Main:React.FC<MainProps> = ({initialAmount, money}) => {

  const {language} = useLanguage();
  const translatedData = dataLanguages[language];
  const [showError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addInputValue, setAddInputValue] = useState('');

  const initialData: Item[] = [
    { initialName: 'rent', name: 'Rent', value: '', sign: '-',  checked: false },
    { initialName: 'gas', name: 'Gas', value: '', sign: '-', checked: false },
    { initialName: 'electricity', name: 'Electricity', value: '', sign: '-',  checked: false },
  ];

  const [data, setData] = useState<Item[]>(initialData);

  const [result, setResult] = useState(0);

  const handleInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    const inputValue = e.target.value;

    const dotCount = inputValue.split('.').length - 1;
    const commaCount = inputValue.split(',').length - 1;
  
    if (dotCount + commaCount > 1) {
      return;
    }

    const sanitizedValue = inputValue.replace(/[^0-9.,]+/g, '').replace(/,/g, '.');
    const formattedValue = sanitizedValue.replace(/([.,]\d{2})\d+$/, '$1');

    newData[index].value = formattedValue;
    setData(newData);
  };

  const handleCheckboxChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    newData[index].checked = e.target.checked;
    setData(newData);
  };

  const handleResetCheckbox = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newData = data.map(item => ({ ...item, checked: false }));
    setData(newData);
  };

  const handleSignToggle = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    newData[index].sign = newData[index].sign === '+' ? '-' : '+';
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

  const handleDeleteSelected = () => {
    const newData = data.filter((item) => !item.checked);
    setData(newData);
  };

  const calculateRemainingAmount = (): number => {
    const initialAmountNumber = parseFloat(initialAmount);

    console.log(initialAmountNumber, data)
  
    if (isNaN(initialAmountNumber)) {
      return 0;
    }
  
    return data.reduce((accumulator, item) => {
      const itemValue = item.value !== '' ? parseFloat(item.value) : 0;
  
      if (isNaN(itemValue)) {
        console.error(`Item ${item.name} has an invalid value`);
        return accumulator;
      }
  
      const operation = item.sign === '-' ? -itemValue : itemValue;
      setResult(accumulator + operation)
      return accumulator + operation;

    }, initialAmountNumber);
  };

  useEffect(() => {
    const updateData = data.map((item, index) => {
      const name = item.initialName;

      if (index < 3) {
        const translatedName = translatedData[name];
        return {
          ...item,
          name: translatedName,
        };
      }
      return item;
    });
  
    setData(updateData);
  }, [language, translatedData]);

  return (
    <main>
        <InputsContainer  data={data} onInputChange={handleInputChange} onCheckboxChange={handleCheckboxChange} handleSignToggle={handleSignToggle}/>
        <ButtonsContainer 
          handleAddInput={handleAddInput} 
          handleDeleteSelected={handleDeleteSelected} 
          calculateRemainingAmount={calculateRemainingAmount} 
          addInputValue={addInputValue} 
          setAddInputValue={setAddInputValue}
          showError={showError}
          setShowError={setShowError}
          setShowModal={setShowModal}
          handleResetCheckbox={handleResetCheckbox}
          data={data}
          money={money}
          result={result}
        />
        {showModal && 
            <ModalExportPDF data={data} initialAmount={initialAmount} money={money} calculateRemainingAmount={calculateRemainingAmount} setShowModal={setShowModal}/>
        }
        
    </main>
  );
};

export default Main;