import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', { 
        day: '2-digit', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const markAsRead = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
    } catch (error) {
      console.error('Error updating message:', error.message);
      alert('Güncelleme işlemi başarısız: ' + error.message);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error.message);
      alert('Silme işlemi başarısız: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Mesajlar</h2>
          <p className="text-sm text-gray-500 mt-1">İletişim ve randevu formlarından gelen tüm mesajlar.</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto p-8">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#7A1D2D] rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-xl">
            Henüz mesaj bulunmuyor.
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm relative group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {message.name}
                      {!message.is_read && <span className="w-2 h-2 rounded-full bg-amber-500" title="Okunmadı"></span>}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span>📞/✉️ {message.contact_info}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                      {formatDate(message.created_at)}
                    </span>
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <button 
                        onClick={() => markAsRead(message.id, message.is_read)}
                        className="text-xs text-blue-500 hover:text-blue-700 underline"
                      >
                        {message.is_read ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
                      </button>
                      <button 
                        onClick={() => deleteMessage(message.id)}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
                
                {message.area_of_interest && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#7A1D2D] bg-[#7A1D2D]/10 px-2 py-1 rounded">
                      İlgi Alanı: {message.area_of_interest}
                    </span>
                  </div>
                )}
                
                <div className="bg-white p-4 rounded-lg border border-gray-100 text-sm text-gray-700 mt-3 whitespace-pre-wrap">
                  {message.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
