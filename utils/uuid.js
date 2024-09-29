import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => uuidv4();

export const ensureUUID = (item) => {
  if (!item.id) {
    return { ...item, id: generateUUID() };
  }
  return item;
};

export const ensureUUIDForArray = (items) => {
  return items.map(ensureUUID);
};
