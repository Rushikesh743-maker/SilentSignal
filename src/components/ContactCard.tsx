import React, { useState } from 'react';
import { User, Phone, Trash2, Check, X, Edit2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EmergencyContact } from '@/types';

interface ContactCardProps {
  contact: EmergencyContact;
  onToggleSelection: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<EmergencyContact, 'name' | 'phone'>>) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onToggleSelection, onUpdate, onDelete }: ContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(contact.name);
  const [editPhone, setEditPhone] = useState(contact.phone);

  const handleSave = () => {
    if (editName.trim() && editPhone.trim()) {
      onUpdate(contact.id, { name: editName.trim(), phone: editPhone.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-xl bg-card border border-border fade-in">
        <div className="space-y-3">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
            className="bg-secondary border-border"
          />
          <Input
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            placeholder="Phone number"
            type="tel"
            className="bg-secondary border-border"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="flex-1 bg-armed hover:bg-armed/90">
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="flex-1">
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border fade-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="w-3 h-3" />
            <span className="font-mono">{contact.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Switch
            checked={contact.isSelected}
            onCheckedChange={() => onToggleSelection(contact.id)}
            className="data-[state=checked]:bg-armed"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="flex-1 text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(contact.id)}
          className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}
