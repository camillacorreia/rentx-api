import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import { getRepository, Repository } from 'typeorm';

import { ISpecificationsRepository } from '../../../repositories/ISpecificationsRepository';
import { Specification } from '../entities/Specification';

class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>;

  constructor() {
    this.repository = getRepository(Specification);
  }

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = this.repository.create({
      name,
      description,
    });

    await this.repository.save(specification);

    return specification;
  }

  async list(): Promise<Specification[]> {
    const spefications = await this.repository.find();

    return spefications;
  }

  async findByName(name: string): Promise<Specification> {
    // Select * from categories where name = "name" limit 1
    const specification = await this.repository.findOne({ name });

    return specification;
  }
}

export { SpecificationsRepository };
