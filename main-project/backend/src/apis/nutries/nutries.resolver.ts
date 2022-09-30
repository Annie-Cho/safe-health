import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Nutri } from './entities/nutri.entity';
import { NutriesService } from './nutries.service';

@Resolver()
export class NutriesResolver {
  constructor(private readonly nutriesService: NutriesService) {}

  @Query(() => [Nutri])
  fetchNutries() {
    return this.nutriesService.findAll();
  }

  @Mutation(() => Nutri)
  createNutri(@Args('nutriName') nutriName: string) {
    return this.nutriesService.create({ nutriName });
  }
}
