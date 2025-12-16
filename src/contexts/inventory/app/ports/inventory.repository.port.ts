import { IInventoryReadRepository } from './inventory-read.repository';
import { IInventoryWriteRepository } from './inventory-write.repository';

// Alias legado para compatibilidad con imports existentes
export type InventoryRepositoryPort = IInventoryReadRepository & IInventoryWriteRepository;

export default InventoryRepositoryPort;
