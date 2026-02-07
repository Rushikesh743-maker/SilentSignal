import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactCard } from '@/components/ContactCard';
import { AddContactForm } from '@/components/AddContactForm';
import { useSOS } from '@/context/SOSContext';

export function Contacts() {
  const { contacts, addContact, updateContact, deleteContact, toggleContactSelection } = useSOS();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (name: string, phone: string) => {
    addContact(name, phone);
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Emergency Contacts</h1>
            <p className="text-sm text-muted-foreground">People to notify in an emergency</p>
          </div>
          {!isAdding && (
            <Button 
              size="sm" 
              onClick={() => setIsAdding(true)}
              className="bg-armed hover:bg-armed/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        {/* Add Form */}
        {isAdding && (
          <AddContactForm onAdd={handleAdd} onCancel={() => setIsAdding(false)} />
        )}

        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onToggleSelection={toggleContactSelection}
              onUpdate={updateContact}
              onDelete={deleteContact}
            />
          ))}
        </div>

        {/* Empty State */}
        {contacts.length === 0 && !isAdding && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No contacts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add trusted contacts who will be notified during an emergency
            </p>
            <Button onClick={() => setIsAdding(true)} className="bg-armed hover:bg-armed/90">
              <Plus className="w-4 h-4 mr-1" />
              Add First Contact
            </Button>
          </div>
        )}

        {/* Info */}
        {contacts.length > 0 && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              Toggle the switch to select which contacts receive SOS alerts. Only selected contacts will be notified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contacts;
