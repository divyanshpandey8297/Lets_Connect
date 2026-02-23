// src/components/QuickEmojiPicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

const QUICK_EMOJIS = ['😊', '❤️', '👍', '😂', '🎉', '🔥', '😢', '👏', '😎', '🥰', '🤔', '🙏'];

const QuickEmojiPicker = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Emoji toggle button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Add emoji"
      >
        <Smile className="w-5 h-5 text-gray-600" />
      </button>

      {/* Emoji picker dropdown */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg p-2 border border-gray-200 grid grid-cols-6 gap-1 z-50"
        >
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onEmojiSelect(emoji);
                setShowPicker(false);
              }}
              className="w-8 h-8 hover:bg-gray-100 rounded-md flex items-center justify-center text-xl transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickEmojiPicker;