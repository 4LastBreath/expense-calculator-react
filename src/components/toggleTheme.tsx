import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ToggleTheme = () => {

  const [isChecked, setIsChecked] = useState(false)

  const handleChange = () => {
    const theme = isChecked ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', theme);

    localStorage.setItem('theme', theme);
    setIsChecked(!isChecked)
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    const theme = isChecked ? 'dark' : 'light';

    if (e.key === 'Enter') {
      document.documentElement.setAttribute('data-theme', theme);

      localStorage.setItem('theme', theme);
      setIsChecked(!isChecked)
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsChecked(savedTheme === 'light');
    }
  }, []);

  return (
  <div className='toggle-theme_position flex justify-center align-center relative'>
    <div className="toggle-theme_container relative">
      <input type="checkbox" id="toggle-theme" onChange={handleChange} checked={isChecked} onKeyDown={handleKeydown}/>
      <label htmlFor="toggle-theme" className='flex align-center justify-center cursor-pointer'>
          <FontAwesomeIcon icon={faMoon} className='moon' />
          <FontAwesomeIcon icon={faSun} className='sun' />
      </label>
    </div>
  </div>
  );
};

export default ToggleTheme;