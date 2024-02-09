import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Item } from './main';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';
import FocusTrap from 'focus-trap-react';

interface ModalExportPDFProps {
  data: Item[];
  initialAmount: string;
  money: string;
  calculateRemainingAmount: () => number;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalExportPDF: React.FC<ModalExportPDFProps> = ({data, initialAmount, money, calculateRemainingAmount, setShowModal}) => {

  const {language} = useLanguage();
  const translatedData = dataLanguages[language];

  const [pdfTitle, setPdfTitle] = useState('');
  const [useDate, setUseDate] = useState(false);
  const [dateFormat, setDateFormat] = useState('day/month/year');

  const date = new Date();
  const defaultDateValue = date.toLocaleDateString('en-CA');

  const [dataDates, setDataDates] = useState({
    date1: defaultDateValue,
    date2: defaultDateValue,
  });

  const formatDate = (inputDate:string) => {
    const dateParts = inputDate.split('-');
    
    if (dateParts.length === 3 && dateFormat === 'day/month/year') {
      const [year, month, day] = dateParts;
      return `${day}/${month}/${year}`;
    } else {
      return inputDate;
    }
  };

  const handleChangeDateFormat = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem('date-format', e.target.value)
    setDateFormat(e.target.value)
  }

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setDataDates({
      ...dataDates, [name] : value
    })
  }

  const handleChangePdfTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfTitle(e.target.value)
  }

  const toggleUseDate = (e: React.MouseEvent<HTMLButtonElement>) => {
    setUseDate(!useDate)
  }

  const handleCloseModalBG = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('modal')) {
      setShowModal(false);
    }
  };

  const exportToPDF = (e: React.MouseEvent<HTMLButtonElement>) => {

    const pdf = new jsPDF("p", "pt", "a4");

    const tableData = data.map(item => [
      item.name,
      {
        content: (item.value !== '0' && item.value !== '' ? item.sign : '') + ' ' + (item.value !== '' ? item.value : '0') + money,
        styles: {
          fillColor:
            (item.value === '0' || item.value === '') ? [255, 255, 255] : 
            item.sign === '-' ? [250, 225, 225] : [225, 255, 225] 
        }
      }
    ]);

    const totalDisplay = calculateRemainingAmount() % 1 !== 0 ? calculateRemainingAmount().toFixed(2) : calculateRemainingAmount()

    const headers = [translatedData.pdfNames, translatedData.pdfExpenses];

    (pdf as any).autoTableSetDefaults({
      margin: { top: 20 },
      startY: 50 + (useDate ? 30 : 0),
    });

    pdf.setFont('Courier', "normal", 400)

    pdf.text(pdfTitle, pdf.internal.pageSize.width / 2, 30, { align: 'center' });

    if (useDate === true) {
      pdf.text(formatDate(dataDates.date1) + ' ' + translatedData.to + ' ' + formatDate(dataDates.date2), pdf.internal.pageSize.width / 2, 60, { align: 'center' });
    }

    (pdf as any).autoTable({
      head: [[translatedData.initialAmount]],
      body: [[(initialAmount === '' ? 0 : initialAmount) + money]],
      styles: { cellPadding: 5, halign: 'center' },
      columnStyles: { 0: { halign: 'center' } },
    });

    (pdf as any).autoTable({
      startY: (pdf as any).previousAutoTable.finalY + 10,
      head: [headers],
      body: tableData,
    });

    (pdf as any).autoTable({
      startY: (pdf as any).previousAutoTable.finalY + 10,
      head: [[translatedData.remainingAmount]],
      body: [[totalDisplay + money]],
      styles: { cellPadding: 5, halign: 'center' },
      columnStyles: { 0: { halign: 'center' } },
    });
    
    pdf.save(pdfTitle !== '' ? pdfTitle : 'table-expenses.pdf');
  };

  useEffect(() => {
    const savedDateFormat = localStorage.getItem('date-format');
    if (savedDateFormat) {
      setDateFormat(savedDateFormat);
    }
  }, []);

  return (
    <FocusTrap>
      <div className='modal flex align-center justify-center' onClick={handleCloseModalBG}>
          <div className='modal_center flex flex-column align-center justify-center'>

            <button className='button' onClick={toggleUseDate}>{useDate ? translatedData.removePeriod : translatedData.addPeriod}</button>

            {useDate && 
              <div className="input-date_container flex flex-column gap-50 align-center">
                <select onChange={handleChangeDateFormat} className='dropdown date-option' value={dateFormat}>
                  <option value='day/month/year'>{translatedData.dayMonthYear}</option>
                  <option value='year/month/day'>{translatedData.yearMonthDay}</option>
                </select>
                <input type="date" id="date-picker-1" className="input-date" value={dataDates.date1} name='date1' onChange={handleChangeDate}/>
                  <span>to</span>
                <input type="date" id="date-picker-2" className="input-date" value={dataDates.date2} name='date2' onChange={handleChangeDate}/>
              </div> 
            }
            
            <label htmlFor="pdf-name">{translatedData.pdfTitle}</label>
            <input type="text" className='input' id='pdf-name' maxLength={40} value={pdfTitle} onChange={handleChangePdfTitle} placeholder={translatedData.addNamePlaceholder}/>

            <button className='button' onClick={exportToPDF}>{translatedData.exportPDF}</button>

          </div>
      </div>
    </FocusTrap>
  );
};

export default ModalExportPDF;