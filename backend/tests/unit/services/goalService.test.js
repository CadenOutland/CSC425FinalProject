// Unit tests for goalService
const goalService = require('../../../src/services/goalService');

// Mock the Goal model functions used by the service
jest.mock('../../../src/models/Goal', () => ({
  findByUserId: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const Goal = require('../../../src/models/Goal');

describe('goalService', () => {
  afterEach(() => jest.clearAllMocks());

  test('getUserGoals returns normalized goals', async () => {
    const sample = [{ id: 1, title: 'Test', description: 'd', user_id: 5, progress_percentage: 20 }];
    Goal.findByUserId.mockResolvedValue(sample);

    const res = await goalService.getUserGoals(5);
    expect(Goal.findByUserId).toHaveBeenCalledWith(5);
    expect(res).toHaveLength(1);
    expect(res[0].progress).toBe(20);
  });

  test('createGoal calls Goal.create and returns created object', async () => {
    const input = { title: 'New', description: 'desc', user_id: 5 };
    const created = { id: 10, ...input, progress_percentage: 0 };
    Goal.create.mockResolvedValue(created);

    const res = await goalService.createGoal(input);
    expect(Goal.create).toHaveBeenCalled();
    expect(res.id).toBe(10);
    expect(res.title).toBe('New');
  });

  test('updateGoal calls Goal.update and returns updated object', async () => {
    const goalId = 10;
    const input = { title: 'Updated', description: 'new desc' };
    const updated = { id: goalId, ...input, user_id: 5, progress_percentage: 20 };
    Goal.update.mockResolvedValue(updated);

    const res = await goalService.updateGoal(goalId, input);
    expect(Goal.update).toHaveBeenCalledWith(goalId, input);
    expect(res.title).toBe('Updated');
    expect(res.progress).toBe(20);
  });

  test('deleteGoal calls Goal.delete', async () => {
    const goalId = 10;
    Goal.delete.mockResolvedValue(true);

    await goalService.deleteGoal(goalId);
    expect(Goal.delete).toHaveBeenCalledWith(goalId);
  });

  test('getUserGoals throws error for invalid user', async () => {
    Goal.findByUserId.mockRejectedValue(new Error('User not found'));

    await expect(goalService.getUserGoals(-1)).rejects.toThrow('User not found');
  });

  test('createGoal validates required fields', async () => {
    const invalidInput = { description: 'Missing title' };
    
    await expect(goalService.createGoal(invalidInput))
      .rejects.toThrow('Title is required');
  });
});