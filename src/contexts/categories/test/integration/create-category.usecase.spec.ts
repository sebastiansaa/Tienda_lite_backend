import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryUseCase } from '../../app/usecases/create-category.usecase';
import { ICategoryReadRepository } from '../../app/ports/category-read.repository';
import { ICategoryWriteRepository } from '../../app/ports/category-write.repository';
import { CreateCategoryCommand } from '../../app/commands/create-category.command';
import { CategoryEntity } from '../../domain/entity/category.entity';

describe('CreateCategoryUseCase Integration', () => {
    let usecase: CreateCategoryUseCase;
    let readRepo: ICategoryReadRepository;
    let writeRepo: ICategoryWriteRepository;

    const mockReadRepo = {
        findBySlug: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
    };

    const mockWriteRepo = {
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateCategoryUseCase,
                {
                    provide: 'ICategoryReadRepository',
                    useValue: mockReadRepo,
                },
                {
                    provide: 'ICategoryWriteRepository',
                    useValue: mockWriteRepo,
                },

                {
                    provide: CreateCategoryUseCase,
                    useFactory: (read, write) => new CreateCategoryUseCase(read, write),
                    inject: ['ICategoryReadRepository', 'ICategoryWriteRepository']

                }
            ],
        }).compile();

        usecase = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
        readRepo = module.get('ICategoryReadRepository');
        writeRepo = module.get('ICategoryWriteRepository');
    });

    it('should be defined', () => {
        expect(usecase).toBeDefined();
    });

    it('should create a category successfully', async () => {
        const command = new CreateCategoryCommand(
            'New Cat',
            'new-cat',
            'http://example.com/img.jpg'
        );

        mockReadRepo.findBySlug.mockResolvedValue(null);
        mockWriteRepo.save.mockImplementation(async (ent) => ent);

        const result = await usecase.execute(command);

        expect(mockReadRepo.findBySlug).toHaveBeenCalledWith('new-cat');
        expect(mockWriteRepo.save).toHaveBeenCalled();
        expect(result).toBeInstanceOf(CategoryEntity);
        expect(result.slug).toBe('new-cat');
    });

    it('should fail if slug exists', async () => {
        const command = new CreateCategoryCommand(
            'Existing Cat',
            'existing-cat',
            'http://example.com/img.jpg'
        );

        mockReadRepo.findBySlug.mockResolvedValue({ slug: 'existing-cat' } as CategoryEntity); // Mock existing entity

        await expect(usecase.execute(command)).rejects.toThrow('Category with slug existing-cat already exists');
        expect(mockWriteRepo.save).not.toHaveBeenCalled();
    });
});
