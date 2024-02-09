import React, { useState, useEffect } from 'react';
import InputsContainer from './inputContainer';
import ButtonsContainer from './buttonsContainer';
import ModalExportPDF from './modalExportPDF';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';
import ModalSaveProfil from './modalSaveProfil';


export interface Item {
  initialName: string;
  name: string;
  value: string;
  sign: '+' | '-';
  checked: boolean;
}

interface MainProps {
  initialAmount: string;
  setInitialAmount: React.Dispatch<React.SetStateAction<string>>;
  money: string;
  selectedProfil: string;
  setSelectedProfil: React.Dispatch<React.SetStateAction<string>>;
}

const Main:React.FC<MainProps> = ({initialAmount, setInitialAmount, money, selectedProfil, setSelectedProfil}) => {

  const {language} = useLanguage();
  const translatedData = dataLanguages[language];
  const [showModalPDF, setShowModalPDF] = useState(false);
  const [showModalSave, setShowModalSave] = useState(false);

  const initialData: Item[] = [
    { initialName: 'rent', name: 'Rent', value: '', sign: '-',  checked: false },
    { initialName: 'water', name: 'Water', value: '', sign: '-',  checked: false },
    { initialName: 'gas', name: 'Gas', value: '', sign: '-', checked: false },
    { initialName: 'electricity', name: 'Electricity', value: '', sign: '-',  checked: false },
  ];

  const [data, setData] = useState<Item[]>([]);

  const [result, setResult] = useState(0);
  const [saveChosenProfil, setSaveChosenProfil] = useState('1')

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

  const handleSignToggle = (index: number) => () => {
    const newData = [...data];
    newData[index].sign = newData[index].sign === '+' ? '-' : '+';
    setData(newData);
  };

  const handleResetValue = () => {
    const confirm = window.confirm(translatedData.confirmReset)
    if (confirm) {
      const resettedData = data.map(item => ({ ...item, value: '' }));
      setData(resettedData)
      setInitialAmount('')
      setResult(0)
    }
  }

  const handleSaveNames = (e: React.MouseEvent<HTMLButtonElement>) => {
    const savedNames = data.map(item => item.name);
    localStorage.setItem(`savedNames-${saveChosenProfil}`, JSON.stringify(savedNames));
    setShowModalSave(false)
  };

  // Calcul the final amount
  const calculateRemainingAmount = (): number => {
    const initialAmountNumber = parseFloat(initialAmount);
  
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

  // Translate the initial data
  useEffect(() => {
    const updateData = data.map((item, index) => {
      if (index < 4 && ['rent', 'water', 'gas', 'electricity'].includes(item.initialName)) {
        const translatedName = translatedData[item.initialName];
        return {
          ...item,
          name: translatedName,
        };
      }
      return item;
    });
  
    setData([...updateData]);
  }, [language, translatedData]);

  // Load saved profil
  useEffect(() => {
    const savedNamesKey = `savedNames-${selectedProfil}`;
    const savedNames = localStorage.getItem(savedNamesKey);
    const savedProfil = localStorage.getItem('savedProfil');
  
    if (savedProfil) {
      setSelectedProfil(savedProfil);
    }
  
    if (savedNames) {
      const parsedNames: string[] = JSON.parse(savedNames);
  
      const updatedData = parsedNames.map((name) => ({
        initialName: name.toLocaleLowerCase(),
        name: name,
        value: '',
        sign: '-',
        checked: false,
      })) as Item[];
  
      setData(updatedData);
    } else {
      const translatedInitialData = initialData.map((item) => {
          const translatedName = translatedData[item.initialName];
          return {
            ...item,
            name: translatedName,
          };
      });
      setData(translatedInitialData);
    }
  }, [selectedProfil]);

  return (
    <main>
        <InputsContainer  data={data} onInputChange={handleInputChange} onCheckboxChange={handleCheckboxChange} handleSignToggle={handleSignToggle}/>
        <ButtonsContainer
          calculateRemainingAmount={calculateRemainingAmount} 
          setShowModalPDF={setShowModalPDF}
          setShowModalSave={setShowModalSave}
          handleResetValue={handleResetValue}
          data={data}
          setData={setData}
          money={money}
          result={result}
        />
        {showModalPDF && 
            <ModalExportPDF data={data} initialAmount={initialAmount} money={money} calculateRemainingAmount={calculateRemainingAmount} setShowModal={setShowModalPDF}/>
        }
        {
          showModalSave && 
          <ModalSaveProfil setShowModalSave={setShowModalSave} setSaveChosenProfil={setSaveChosenProfil} saveChosenProfil={saveChosenProfil} handleSaveNames={handleSaveNames}/>
        }

    </main>
  );
};

export default Main;