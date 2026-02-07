import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddContactFormProps {
  onAdd: (name: string, phone: string) => void;
  onCancel: () => void;
}

export function AddContactForm({ onAdd, onCancel }: AddContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onAdd(name.trim(), phone.trim());
      setName('');
      setPhone('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-card border border-armed/30 slide-up">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-armed" />
        <h3 className="font-medium text-foreground">Add Contact</h3>
      </div>

      <div className="space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contact name"
          className="bg-secondary border-border"
          autoFocus
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          type="tel"
          className="bg-secondary border-border"
        />
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 bg-armed hover:bg-armed/90"
            disabled={!name.trim() || !phone.trim()}
          >
            Add Contact
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
