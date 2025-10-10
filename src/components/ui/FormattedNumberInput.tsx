import React, { useState, useEffect } from 'react';
import { Input } from './input';

interface FormattedNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function FormattedNumberInput({
  value,
  onChange,
  placeholder,
  className,
  error,
}: FormattedNumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Format number with international comma pattern and decimals (Sri Lankan style)
  const formatNumber = (num: string): string => {
    if (!num) return '';

    // Split into integer and decimal parts
    const parts = num.split('.');
    const integerPart = parts[0].replace(/\D/g, '');
    const decimalPart = parts[1] || '';

    if (!integerPart) return '';

    // Convert to number and back to remove leading zeros
    const number = parseInt(integerPart, 10);
    if (isNaN(number)) return '';

    // International number formatting (commas every 3 digits)
    // Pattern: XXX,XXX,XXX.XX
    // Examples: 25,000.00 | 100,000.00 | 1,000,000.00
    const formatted = number.toLocaleString('en-US');

    // Add decimal part if exists
    if (decimalPart !== undefined && parts.length > 1) {
      return formatted + '.' + decimalPart.substring(0, 2); // Limit to 2 decimal places
    }

    return formatted;
  };

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow digits, one decimal point, and preserve decimal structure
    const cleaned = input.replace(/[^\d.]/g, '');

    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    const hasDecimal = parts.length > 1;
    const validValue = hasDecimal
      ? parts[0] + '.' + parts.slice(1).join('')
      : cleaned;

    // Remove all non-digit characters for the actual value (for calculations)
    const numericValue = validValue.replace(/\./g, '');

    // Update parent with clean numeric value
    onChange(numericValue);

    // Update display with formatted value
    setDisplayValue(formatNumber(validValue));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all on focus for easy editing
    e.target.select();
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      className={`text-lg font-medium ${error ? 'border-red-500' : ''} ${className || ''}`}
    />
  );
}
