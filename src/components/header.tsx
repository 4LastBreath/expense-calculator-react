import React, { useEffect, useState, useRef } from 'react';
import ToggleTheme from './toggleTheme';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faGlobe, faCoins, faCopy } from '@fortawesome/free-solid-svg-icons';
import { allLanguagesArray } from '../utils/languages';

interface HeaderProps {
  initialAmount: string;
  setInitialAmount: React.Dispatch<React.SetStateAction<string>>;
  money: string;
  setMoney: React.Dispatch<React.SetStateAction<string>>;
  selectedProfil: string;
  handleSelectProfil: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Header:React.FC<HeaderProps> = ({initialAmount, setInitialAmount, money, setMoney, selectedProfil, handleSelectProfil}) => {

  const { language, setLanguage } = useLanguage();
  const translatedData = dataLanguages[language];

  const [showSettings, setShowSettings] = useState(false)
  const headerSettingsRef = useRef<HTMLDivElement>(null)

  const handleShowSettings = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowSettings(!showSettings);
  }

  const handleInitialAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const dotCount = value.split('.').length - 1;
    const commaCount = value.split(',').length - 1;
  
    if (dotCount + commaCount > 1) {
      return;
    }

    const sanitizedValue = value.replace(/[^0-9.,]+/g, '').replace(/,/g, '.');
    const formattedValue = sanitizedValue.replace(/([.,]\d{2})\d+$/, '$1');

    setInitialAmount(formattedValue)
  }

  const handleMoneyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem('money', e.target.value)
    setMoney(e.target.value)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    setLanguage(e.target.value);
  };

  useEffect(() => {
    const savedMoney = localStorage.getItem('money')
    const savedLanguage = localStorage.getItem('language')
    if (savedMoney) {
      setMoney(savedMoney)
    }

    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [setLanguage, setMoney])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerSettingsRef.current && !headerSettingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };

      document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  return (
    <header className='flex justify-center align-center relative'>

        <div className='relative flex align-center gap-50'>
          <input type="text" className="input" onChange={handleInitialAmountChange} value={initialAmount} placeholder={translatedData.initialAmount + '...'} maxLength={13} inputMode="numeric"/>
          <div className='money-header'>{money}</div>
        </div>

        <button onClick={handleShowSettings} className='button settings_button'>
          <FontAwesomeIcon icon={faGear}/>
        </button>


          <div className={`header_settings ${showSettings ? 'active' : ''} flex flex-column align-center justify-center`} style={{ visibility: showSettings ? 'visible' : 'hidden' }} ref={headerSettingsRef}>

            <div className='flex gap-100 align-center'>
              <FontAwesomeIcon icon={faGlobe} className='settings-icon'/>
              <select className="dropdown" onChange={handleLanguageChange} value={language}>
                {allLanguagesArray.map((language, index) => (
                  <option value={language.toLocaleLowerCase()} key={index + language}>{language}</option>
                ))}
              </select>
            </div>

            <div className='flex gap-100 align-center'>
              <FontAwesomeIcon icon={faCoins} className='settings-icon'/>
              <select className="dropdown" onChange={handleMoneyChange} value={money}>
                  <option value="$">$</option>
                  <option value="€">€</option>
                  <option value="£">£</option>
              </select>
            </div>

            <div className='flex gap-100 align-center'>
              <FontAwesomeIcon icon={faCopy} className='settings-icon'/>
                <select className='dropdown' onChange={handleSelectProfil} value={selectedProfil}>
                  <option value="default">{translatedData.default}</option>
                  <option value="1">{translatedData.profile1}</option>
                  <option value="2">{translatedData.profile2}</option>
                </select>
            </div>

            <ToggleTheme />

          </div>


    </header>
  );
};

export default Header;