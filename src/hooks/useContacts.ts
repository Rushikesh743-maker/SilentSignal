import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { EmergencyContact } from '@/types';

export function useContacts() {
  const [contacts, setContacts] = useLocalStorage<EmergencyContact[]>('silentsignal_contacts', []);

  const addContact = useCallback((name: string, phone: string) => {
    const newContact: EmergencyContact = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      isSelected: true,
    };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, [setContacts]);

  const updateContact = useCallback((id: string, updates: Partial<Pick<EmergencyContact, 'name' | 'phone'>>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id 
        ? { ...contact, ...updates }
        : contact
    ));
  }, [setContacts]);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  }, [setContacts]);

  const toggleContactSelection = useCallback((id: string) => {
    setContacts(prev => prev.map(contact =>
      contact.id === id
        ? { ...contact, isSelected: !contact.isSelected }
        : contact
    ));
  }, [setContacts]);

  const getSelectedContacts = useCallback(() => {
    return contacts.filter(contact => contact.isSelected);
  }, [contacts]);

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    toggleContactSelection,
    getSelectedContacts,
  };
}
