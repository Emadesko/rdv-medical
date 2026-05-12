import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { ServiceMedical } from '../entities/service-medical.entity';

export const ServiceMedicalFactory = setSeederFactory(
  ServiceMedical,
  (faker: Faker) => {
    const service = new ServiceMedical();

    service.description = faker.helpers.maybe(
      () => faker.lorem.sentence({ min: 10, max: 25 }),
      { probability: 0.8 },
    )!;

    service.prix = +faker.commerce.price({
      min: 5000,
      max: 50000,
    });

    service.duree = faker.number.int({ min: 15, max: 90 });

    service.actif = faker.datatype.boolean({ probability: 0.9 });

    return service;
  },
);
