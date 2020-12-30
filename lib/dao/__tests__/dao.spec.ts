import { createDao, BaseEntity } from '../dao';
describe('dao', () => {
  test('simple', async () => {
    class TestEntity extends BaseEntity {
      hoge!: string;
      fuga!: number;
    }
    const now = new Date();
    const dao = createDao(TestEntity, { adapter: 'memory' });
    const createIndexResult = await dao.createIndex({ index: { fields: ['$createdAt'] } });
    const result = await dao.save({ hoge: 'hoge', fuga: 123 });
    expect(result).not.toBeNull();
    const getResult = await dao.get(result.id);
    expect(getResult).not.toBeNull();
    const findResult = await dao.find({ selector: { $createdAt: { $gt: now } } });
    expect(findResult).not.toBeNull();
    expect(findResult.docs.length).toBe(1);
    expect(findResult.docs[0]._id).toBe(getResult._id);
  })
})
