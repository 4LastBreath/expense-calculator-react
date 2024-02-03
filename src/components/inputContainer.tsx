import React from 'react';
import { Item } from './main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface InputsContainerProps {
  data: Item[];
  onInputChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignToggle: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputsContainer: React.FC<InputsContainerProps> = ({ data, onInputChange, onCheckboxChange, handleSignToggle }) => {
  return (
    <div className='inputs-container flex align-center flex-column relative'>
      <div className='inputs_limit'>{data.length} / 25</div>
      {data.map((item, index) => (
        <div className="inputs-container__container relative flex flex-column gap-75" key={index}>
        <label className="label">{item.name}</label>
        <div className="label-input_container flex align-center gap-50">
            <label className="checkbox_container">
                <input type="checkbox" className="input-delete" tabIndex={-1} onChange={onCheckboxChange(index)} checked={item.checked} />
                <span className="checkmark">
                    <FontAwesomeIcon icon={faCheck} />
                </span>
            </label>
            <div className='flex'>
              <input type="text" className="input input-expenses" placeholder="0" onChange={onInputChange(index)} value={item.value}/>
              <div className="toggle-sign_container cursor-pointer">
                  <input type="checkbox" id={`input-sign-${index}`} className="input-sign" tabIndex={-1} onChange={handleSignToggle(index)}/>
                  <label htmlFor={`input-sign-${index}`}>
                    <FontAwesomeIcon icon={faPlus} className='sign-plus'/>
                    <FontAwesomeIcon icon={faMinus} className='sign-minus'/>
                  </label>
              </div>
            </div>
        </div>
    </div>
      ))}
    </div>
  );
};

export default InputsContainer;