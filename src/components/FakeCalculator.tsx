import React, { useState, useCallback } from 'react';
import { useSOS } from '@/context/SOSContext';

const HIDDEN_PATTERN = ['C', 'C', 'C', '=']; // Triple C then equals to exit

export function FakeCalculator() {
  const { deactivateSOS, appState } = useSOS();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pattern, setPattern] = useState<string[]>([]);

  const checkPattern = useCallback((button: string) => {
    const newPattern = [...pattern, button].slice(-4);
    setPattern(newPattern);
    
    if (newPattern.length === 4 && 
        newPattern.every((p, i) => p === HIDDEN_PATTERN[i])) {
      // Hidden pattern detected - exit fake screen
      setPattern([]);
      deactivateSOS();
    }
  }, [pattern, deactivateSOS]);

  const handleNumber = useCallback((num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForOperand]);

  const handleOperator = useCallback((op: string) => {
    const current = parseFloat(display);
    
    if (previousValue !== null && operator && !waitingForOperand) {
      let result: number;
      switch (operator) {
        case '+': result = previousValue + current; break;
        case '-': result = previousValue - current; break;
        case '×': result = previousValue * current; break;
        case '÷': result = previousValue / current; break;
        default: result = current;
      }
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }
    
    setOperator(op);
    setWaitingForOperand(true);
  }, [display, previousValue, operator, waitingForOperand]);

  const handleEquals = useCallback(() => {
    checkPattern('=');
    
    if (previousValue !== null && operator) {
      const current = parseFloat(display);
      let result: number;
      
      switch (operator) {
        case '+': result = previousValue + current; break;
        case '-': result = previousValue - current; break;
        case '×': result = previousValue * current; break;
        case '÷': result = previousValue / current; break;
        default: result = current;
      }
      
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  }, [display, previousValue, operator, checkPattern]);

  const handleClear = useCallback(() => {
    checkPattern('C');
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, [checkPattern]);

  const handleDecimal = useCallback(() => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display]);

  const handlePercent = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100));
  }, [display]);

  const handleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1));
  }, [display]);

  const Button = ({ 
    value, 
    onClick, 
    variant = 'number' 
  }: { 
    value: string; 
    onClick: () => void; 
    variant?: 'number' | 'operator' | 'function' | 'equals';
  }) => {
    const baseClasses = "h-16 text-2xl font-medium rounded-full transition-all active:scale-95";
    const variantClasses = {
      number: "bg-[hsl(0_0%_28%)] text-white hover:bg-[hsl(0_0%_35%)]",
      operator: "bg-[hsl(32_100%_50%)] text-white hover:bg-[hsl(32_100%_60%)]",
      function: "bg-[hsl(0_0%_65%)] text-black hover:bg-[hsl(0_0%_75%)]",
      equals: "bg-[hsl(32_100%_50%)] text-white hover:bg-[hsl(32_100%_60%)]",
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="fake-screen fixed inset-0 z-50 flex flex-col bg-black">
      {/* Status bar simulation */}
      <div className="flex justify-between items-center px-6 py-2 text-white text-sm">
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <div className="flex gap-1 items-center">
          <div className="w-4 h-2 border border-white rounded-sm">
            <div className="w-3/4 h-full bg-white" />
          </div>
        </div>
      </div>

      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-6 pb-4">
        <span 
          className="text-white font-light"
          style={{ fontSize: display.length > 9 ? '3rem' : display.length > 6 ? '4rem' : '5rem' }}
        >
          {display}
        </span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3 p-4 pb-8">
        <Button value="C" onClick={handleClear} variant="function" />
        <Button value="±" onClick={handleSign} variant="function" />
        <Button value="%" onClick={handlePercent} variant="function" />
        <Button value="÷" onClick={() => handleOperator('÷')} variant="operator" />
        
        <Button value="7" onClick={() => handleNumber('7')} />
        <Button value="8" onClick={() => handleNumber('8')} />
        <Button value="9" onClick={() => handleNumber('9')} />
        <Button value="×" onClick={() => handleOperator('×')} variant="operator" />
        
        <Button value="4" onClick={() => handleNumber('4')} />
        <Button value="5" onClick={() => handleNumber('5')} />
        <Button value="6" onClick={() => handleNumber('6')} />
        <Button value="-" onClick={() => handleOperator('-')} variant="operator" />
        
        <Button value="1" onClick={() => handleNumber('1')} />
        <Button value="2" onClick={() => handleNumber('2')} />
        <Button value="3" onClick={() => handleNumber('3')} />
        <Button value="+" onClick={() => handleOperator('+')} variant="operator" />
        
        <button 
          onClick={() => handleNumber('0')}
          className="col-span-2 h-16 text-2xl font-medium rounded-full bg-[hsl(0_0%_28%)] text-white hover:bg-[hsl(0_0%_35%)] transition-all active:scale-95 text-left pl-7"
        >
          0
        </button>
        <Button value="." onClick={handleDecimal} />
        <Button value="=" onClick={handleEquals} variant="equals" />
      </div>

      {/* Invisible SOS indicator - only visible during active SOS */}
      {appState.isSOSActive && (
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-alert opacity-20 pulse-alert" />
      )}
    </div>
  );
}
