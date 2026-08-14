import React, { useState, useEffect, useRef } from 'react';
import CuttingVisualizer from '../../components/CuttingVisualizer';
import { supabase } from '../../utils/supabase'; // Adjust path based on project structure
import * as htmlToImage from 'html-to-image';
import { Link } from 'react-router-dom';

const EbatlamaForm = () => {
  const [clientInfo, setClientInfo] = useState({
    firmaAdi: localStorage.getItem('impa_firmaAdi') || '',
    yetkiliKisi: localStorage.getItem('impa_yetkiliKisi') || '',
    telefon: localStorage.getItem('impa_telefon') || ''
  });

  useEffect(() => {
    localStorage.setItem('impa_firmaAdi', clientInfo.firmaAdi);
    localStorage.setItem('impa_yetkiliKisi', clientInfo.yetkiliKisi);
    localStorage.setItem('impa_telefon', clientInfo.telefon);
  }, [clientInfo]);

  const [siparisNotu, setSiparisNotu] = useState('');
  
  const [bicakPayi, setBicakPayi] = useState(5);
  const [otoYon, setOtoYon] = useState(false);

  const [globalKalinlik, setGlobalKalinlik] = useState('Seçiniz');
  const [globalPlaka, setGlobalPlaka] = useState('Seçiniz');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resultsRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    
    // Small delay to allow UI to show loading state
    await new Promise(resolve => setTimeout(resolve, 150));

    const element = resultsRef.current;
    if (!element) {
        console.error("Export area not found! Make sure the ref is attached.");
        setIsGenerating(false);
        return;
    }

    htmlToImage.toJpeg(element, { quality: 0.9, backgroundColor: '#ffffff' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'kesim-sonuclari.jpg';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error('Error generating image:', err);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  // Initialize with 15 empty rows to match the requirement
  const [rows, setRows] = useState(Array(15).fill({
    boy: '',
    en: '',
    adet: '',
    uzun1: false,
    uzun2: false,
    kisa1: false,
    kisa2: false,
  }));

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
  };

  // Parse panel dimensions for dynamic visualization based on the global selection, or fallback to default
  const selectedPlaka = globalPlaka !== 'Seçiniz' ? globalPlaka : '2800x2100';

  const validateRow = (row) => {
    const warnings = [];
    // Skip if essential data is missing
    if (!row.boy || !row.en || globalPlaka === 'Seçiniz') return warnings;

    const boy = parseFloat(row.boy);
    const en = parseFloat(row.en);
    
    // Extract max and min panel dimensions safely
    const [plakaWidth, plakaHeight] = globalPlaka.split('x').map(Number);
    const maxPlaka = Math.max(plakaWidth, plakaHeight);
    const minPlaka = Math.min(plakaWidth, plakaHeight);
    
    // Extract piece dimensions
    const maxDim = Math.max(boy, en);
    const minDim = Math.min(boy, en);

    // Error: Piece is larger than the board (Keep only this critical error)
    if (maxDim > maxPlaka || minDim > minPlaka) {
      warnings.push({ type: 'error', msg: `Dikkat: Bu parça seçtiğiniz plakadan (${globalPlaka}) daha büyük!` });
    }

    // The PVC warning logic has been completely removed.

    return warnings;
  };

  // Optimization Summary Calculations
  const validRows = rows.filter(p => p.boy && p.en && p.adet && parseFloat(p.boy) > 0 && parseFloat(p.en) > 0 && parseInt(p.adet) > 0);
  
  const totalUsedArea = validRows.reduce((acc, row) => {
    return acc + (parseFloat(row.boy) * parseFloat(row.en) * parseInt(row.adet));
  }, 0);

  let panelWidth = 2800;
  let panelHeight = 2100;
  if (selectedPlaka && selectedPlaka !== 'Seçiniz') {
    const parts = selectedPlaka.split('x');
    if (parts.length === 2) {
      panelWidth = parseInt(parts[0], 10);
      panelHeight = parseInt(parts[1], 10);
    }
  }
  const totalPanelArea = panelWidth * panelHeight;
  
  const requiredPlates = totalPanelArea > 0 ? Math.ceil(totalUsedArea / totalPanelArea) : 0;
  
  // Calculate average pieces per plate (rough estimate)
  const totalPieces = validRows.reduce((acc, row) => acc + parseInt(row.adet), 0);
  const piecesFromOnePlate = requiredPlates > 0 ? Math.floor(totalPieces / requiredPlates) : totalPieces;
  
  // Efficiency
  const totalProvidedArea = totalPanelArea * (requiredPlates || 1);
  const efficiency = totalProvidedArea > 0 && totalUsedArea > 0 ? ((totalUsedArea / totalProvidedArea) * 100).toFixed(1) : 100;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header, Logo & Welcome Section */}
        <div className="text-center mb-12">
          <div className="relative flex justify-center items-center py-6 mb-2">
            {/* Back Button - Positioned absolutely to the left */}
            <Link 
              to="/" 
              className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-500 hover:text-[#7A1D2D] transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            </Link>

            {/* Clickable Logo */}
            <Link to="/">
              <img src="/impalogo2.jpg" alt="IMPA Logo" className="h-16 w-auto object-contain" />
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif italic font-medium text-[#2D3748] mb-4 tracking-wide">
            İMPA Kesim ve Ebatlama Sistemine Hoş Geldiniz
          </h1>
          
          <p className="text-[#2D3748]/70 max-w-2xl mx-auto font-light italic text-lg leading-relaxed">
            Projenize özel ebatlama ve bantlama siparişlerinizi profesyonel araçlarımızla hızlı ve hatasız bir şekilde oluşturun.
          </p>
        </div>

        {/* Client Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold mb-6 text-[#1F2937] flex items-center gap-2">
            <span className="bg-[#8B5A2B] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">1</span>
            Müşteri Bilgileri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Firma Adı</label>
              <input 
                type="text" 
                name="firmaAdi" 
                value={clientInfo.firmaAdi}
                onChange={handleClientChange}
                placeholder="Firma Adı"
                required
                autoComplete="organization"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yetkili Kişi (Ad Soyad)</label>
              <input 
                type="text" 
                name="yetkiliKisi" 
                value={clientInfo.yetkiliKisi}
                onChange={handleClientChange}
                placeholder="Ad Soyad"
                required
                autoComplete="name"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numarası</label>
              <input 
                type="tel" 
                name="telefon" 
                value={clientInfo.telefon}
                onChange={handleClientChange}
                placeholder="05XX XXX XX XX"
                required
                autoComplete="tel"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Global Malzeme Seçimi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold mb-6 text-[#1F2937] flex items-center gap-2">
            <span className="bg-[#8B5A2B] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">2</span>
            Malzeme Seçimi (Tüm Sipariş İçin)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genel Kalınlık</label>
              <select 
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent transition-all"
                value={globalKalinlik}
                onChange={(e) => setGlobalKalinlik(e.target.value)}
              >
                <option>Seçiniz</option>
                <option>18mm</option>
                <option>10mm</option>
                <option>8mm</option>
                <option>6mm</option>
                <option>4mm</option>
                <option>3mm</option>
                <option>2mm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genel Plaka Ebatları (mm)</label>
              <select 
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent transition-all"
                value={globalPlaka}
                onChange={(e) => setGlobalPlaka(e.target.value)}
              >
                <option>Seçiniz</option>
                <option>2800x2100</option>
                <option>3660x1830</option>
                <option>1700x2100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Ebatlama Grid Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8 overflow-hidden">
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
            <div className="text-amber-500 mt-0.5">
              {/* Info/Warning Icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-sm text-amber-800 font-medium">
              Lütfen ölçüleri <span className="font-bold">milimetre (mm)</span> cinsinden giriniz. Örneğin; 74 cm'lik bir ölçü için <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-amber-200">740.0</span> yazmalısınız.
            </p>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-4">Ebatlama Listesi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead className="bg-[#F8F9FA] border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="bg-gray-50/80 text-gray-700 py-4 px-4 text-center text-sm font-bold uppercase tracking-wide border-b border-r border-gray-200" rowSpan="2">Sıra</th>
                  <th colSpan="5" className="bg-[#7A1D2D] text-white py-4 text-center text-sm font-bold uppercase tracking-widest rounded-tl-xl border-r border-white/20 shadow-sm">
                    EBATLAMA ÖLÇÜLERİ (MM)
                  </th>
                  <th colSpan="4" className="bg-[#1A365D] text-white py-4 text-center text-sm font-bold uppercase tracking-widest rounded-tr-xl shadow-sm">
                    PVC BANTLAMA
                  </th>
                </tr>
                <tr>
                  <th className="bg-[#FFF8F9] text-[#7A1D2D] py-4 px-4 text-center text-sm font-bold uppercase tracking-wide border-b border-[#F0D5DA]">Boy</th>
                  <th className="bg-[#FFF8F9] text-[#7A1D2D] py-4 px-4 text-center text-sm font-bold uppercase tracking-wide border-b border-[#F0D5DA]">En</th>
                  <th className="bg-[#FFF8F9] text-[#7A1D2D] py-4 px-4 text-center text-sm font-bold uppercase tracking-wide border-b border-[#F0D5DA]">Adet</th>
                  <th className="bg-[#FFF8F9] text-[#7A1D2D] py-4 px-4 text-center text-sm font-bold uppercase tracking-wide border-b border-[#F0D5DA]">Birim (m²)</th>
                  <th className="bg-[#FFF8F9] text-[#7A1D2D] py-4 px-4 text-center text-sm font-bold uppercase tracking-wide border-b border-r border-[#F0D5DA]">Toplam (m²)</th>
                  <th className="bg-[#F4F7FA] text-[#1A365D] py-4 px-3 text-center text-sm font-bold uppercase tracking-wide border-b border-[#D6E0EC]">Uzun 1</th>
                  <th className="bg-[#F4F7FA] text-[#1A365D] py-4 px-3 text-center text-sm font-bold uppercase tracking-wide border-b border-[#D6E0EC]">Uzun 2</th>
                  <th className="bg-[#F4F7FA] text-[#1A365D] py-4 px-3 text-center text-sm font-bold uppercase tracking-wide border-b border-[#D6E0EC]">Kısa 1</th>
                  <th className="bg-[#F4F7FA] text-[#1A365D] py-4 px-3 text-center text-sm font-bold uppercase tracking-wide border-b border-[#D6E0EC]">Kısa 2</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const boyNum = parseFloat(row.boy) || 0;
                  const enNum = parseFloat(row.en) || 0;
                  const adetNum = parseInt(row.adet) || 0;
                  const birimArea = (boyNum * enNum) / 1000000;
                  const toplamArea = birimArea * adetNum;
                  const warnings = validateRow(row);

                  return (
                  <React.Fragment key={index}>
                  <tr className="even:bg-gray-50/50 odd:bg-white hover:bg-[#F1F5F9] transition-colors duration-150 border-b border-gray-100 last:border-none">
                    <td className="p-3 text-sm font-medium text-gray-500">{index + 1}</td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#2D3748] shadow-sm focus:bg-white focus:ring-2 focus:ring-[#8B5A2B]/20 focus:border-[#8B5A2B] outline-none text-center transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="-"
                        value={row.boy}
                        onChange={(e) => handleInputChange(index, 'boy', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#2D3748] shadow-sm focus:bg-white focus:ring-2 focus:ring-[#8B5A2B]/20 focus:border-[#8B5A2B] outline-none text-center transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="-"
                        value={row.en}
                        onChange={(e) => handleInputChange(index, 'en', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#2D3748] shadow-sm focus:bg-white focus:ring-2 focus:ring-[#8B5A2B]/20 focus:border-[#8B5A2B] outline-none text-center transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        placeholder="Adet"
                        value={row.adet}
                        onChange={(e) => handleInputChange(index, 'adet', e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-100 p-2 align-middle bg-gray-50/50">
                      <div className="w-full text-center text-xs text-gray-400 font-medium">
                        {birimArea > 0 ? birimArea.toFixed(3) : '-'}
                      </div>
                    </td>
                    <td className="border border-gray-100 p-2 align-middle bg-gray-50/50">
                      <div className="w-full text-center text-xs text-gray-500 font-semibold">
                        {toplamArea > 0 ? toplamArea.toFixed(3) : '-'}
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <input 
                        type="checkbox" 
                        className="accent-[#2D3748] w-4 h-4 cursor-pointer hover:ring-2 hover:ring-[#2D3748]/30 hover:scale-110 transition-all"
                        checked={row.uzun1}
                        onChange={(e) => handleInputChange(index, 'uzun1', e.target.checked)}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input 
                        type="checkbox" 
                        className="accent-[#2D3748] w-4 h-4 cursor-pointer hover:ring-2 hover:ring-[#2D3748]/30 hover:scale-110 transition-all"
                        checked={row.uzun2}
                        onChange={(e) => handleInputChange(index, 'uzun2', e.target.checked)}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input 
                        type="checkbox" 
                        className="accent-[#2D3748] w-4 h-4 cursor-pointer hover:ring-2 hover:ring-[#2D3748]/30 hover:scale-110 transition-all"
                        checked={row.kisa1}
                        onChange={(e) => handleInputChange(index, 'kisa1', e.target.checked)}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input 
                        type="checkbox" 
                        className="accent-[#2D3748] w-4 h-4 cursor-pointer hover:ring-2 hover:ring-[#2D3748]/30 hover:scale-110 transition-all"
                        checked={row.kisa2}
                        onChange={(e) => handleInputChange(index, 'kisa2', e.target.checked)}
                      />
                    </td>
                  </tr>
                  {warnings.length > 0 && (
                    <tr className="bg-red-50/30">
                      <td colSpan="10" className="px-6 py-2 border-b border-red-100/50">
                        <div className="flex flex-col gap-1.5 justify-center items-center">
                          {warnings.map((w, i) => (
                            <div key={i} className={`text-xs font-medium flex items-center gap-1.5 ${w.type === 'error' ? 'text-red-500' : 'text-amber-500'}`}>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                              </svg>
                              {w.msg}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Advanced Settings */}
          <div className="mt-6 flex flex-wrap items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            {/* Oto-Yön Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">Parçayı Döndür (Oto-Yön)</span>
                <span className="text-xs text-gray-400">Optimizasyon için parçaların yönünü otomatik ayarla</span>
              </div>
              <button 
                type="button"
                onClick={() => setOtoYon(!otoYon)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${otoYon ? 'bg-[#1A4731]' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${otoYon ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Bıçak Payı */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Bıçak Payı / Kerf (mm)</span>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  value={bicakPayi}
                  disabled
                  className="w-20 pl-3 py-2 rounded-lg border text-center font-medium transition-all outline-none bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200"
                />
              </div>
            </div>
          </div>
          
          {/* Order Note */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">Sipariş Notu (İsteğe Bağlı)</label>
            <textarea
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#2D3748] shadow-sm focus:bg-white focus:ring-2 focus:ring-[#8B5A2B]/20 focus:border-[#8B5A2B] outline-none resize-y min-h-[100px] transition-all"
              placeholder="Özel kesim detayları veya projeniz hakkında eklemek istediklerinizi buraya yazabilirsiniz..."
              value={siparisNotu}
              onChange={(e) => setSiparisNotu(e.target.value)}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#7A1D2D] hover:bg-[#5e1622] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors"
            >
              Listeyi Onayla
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-4 mb-2">
          <button 
            type="button" 
            onClick={handleDownloadImage} 
            disabled={isGenerating}
            className="flex items-center gap-2 text-sm font-semibold text-[#7A1D2D] bg-[#FFF8F9] hover:bg-[#F0D5DA] border border-[#F0D5DA] px-4 py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-wait"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            {isGenerating ? 'İndiriliyor...' : 'Sonuçları İndir (JPG)'}
          </button>
        </div>

        <div ref={resultsRef} id="pdf-export-area" className="p-4 bg-[#ffffff]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1: Gereken Plaka */}
            <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#f3f4f6] p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Gereken Plaka</span>
              <span className="text-4xl font-extrabold text-[#2D3748]">
                {requiredPlates}
              </span>
            </div>

            {/* Card 2: 1 Plakadan Çıkan */}
            <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#f3f4f6] p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2">1 Plakadan Çıkan</span>
              <span className="text-4xl font-extrabold text-[#2D3748]">
                {piecesFromOnePlate}
              </span>
            </div>

            {/* Card 3: Verimlilik */}
            <div className="bg-gradient-to-br from-[#7A1D2D] to-[#9B2A40] rounded-2xl shadow-[0_8px_20px_rgba(122,29,45,0.25)] border border-[#7A1D2D]/50 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Optional: Add a subtle shine overlay */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 rounded-t-2xl"></div>
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider mb-2 relative z-10">Verimlilik</span>
              <span className="text-4xl font-extrabold text-white relative z-10">
                %{efficiency}
              </span>
            </div>
          </div>

          {/* Visualizer Component */}
          <CuttingVisualizer activeRows={rows} selectedPlaka={selectedPlaka} otoYon={otoYon} />
        </div>

        {/* WhatsApp Contact Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8 text-center max-w-2xl mx-auto">
          <p className="text-[#1F2937] font-medium text-lg mb-6">Detaylı bilgi ve fiyat için watsap hattımızdan ulaşabilirsiniz.</p>
          <a 
            href="https://wa.me/905425421057" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white font-medium rounded-lg px-8 py-4 w-full shadow-sm transition-colors text-lg"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            WhatsApp ile İletişime Geç
          </a>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Ölçü Onayı ve Sorumluluk</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Girdiğiniz ebatlama ölçülerinin doğruluğu tamamen sizin sorumluluğunuzdadır. Yanlış ölçü girişlerinden kaynaklanan hatalardan ve malzeme firesinden <strong>İMPA sorumlu tutulamaz.</strong> Lütfen onaylamadan önce listenizi dikkatlice kontrol ediniz.
              </p>
              
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-6">
                <input 
                  type="checkbox" 
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#7A1D2D] bg-gray-100 border-gray-300 rounded focus:ring-[#7A1D2D]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Sorumluluğu kabul ediyorum ve siparişimi Excel olarak panele göndermek istiyorum.
                </span>
              </label>

              <div className="flex gap-3">
                <button 
                  onClick={() => { setIsModalOpen(false); setIsAgreed(false); }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button 
                  disabled={!isAgreed || isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      // Filter out empty rows
                      const validRows = rows.filter(row => row.boy && row.en && row.adet);
                      
                      // Calculate grand total area
                      const totalArea = validRows.reduce((sum, row) => sum + ((parseFloat(row.boy) * parseFloat(row.en)) / 1000000) * parseInt(row.adet), 0);

                      const { error } = await supabase
                        .from('ebatlama_orders')
                        .insert([
                          { 
                            firma_adi: clientInfo.firmaAdi || 'Bilinmiyor',
                            yetkili_kisi: clientInfo.yetkiliKisi || 'Bilinmiyor',
                            telefon: clientInfo.telefon || 'Bilinmiyor',
                            siparis_notu: siparisNotu || '',
                            kalinlik: globalKalinlik !== 'Seçiniz' ? globalKalinlik : 'Bilinmiyor',
                            plaka: globalPlaka !== 'Seçiniz' ? globalPlaka : 'Bilinmiyor',
                            siparis_detaylari: validRows,
                            toplam_metrekare: totalArea
                          }
                        ]);

                      if (error) throw error;

                      alert("Siparişiniz başarıyla alındı! Admin panele iletildi.");
                      setIsModalOpen(false);
                      
                      // Optional: Reset form fields here if needed
                      
                    } catch (error) {
                      console.error("Supabase Insert Error: ", error);
                      alert(`Sipariş gönderilirken bir hata oluştu: ${error.message || "Bilinmeyen hata"}`);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className={`flex-1 px-4 py-2 font-bold rounded-lg transition-colors flex justify-center items-center ${isAgreed && !isSubmitting ? 'bg-[#7A1D2D] hover:bg-[#5e1622] text-white shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    "Onayla ve Gönder"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EbatlamaForm;
