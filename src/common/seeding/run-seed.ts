import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import dbConfig from '../../core/config/dbConfig';

import { Mock } from './mock';

import { UserFactory } from '../../core/modules/user/seeding/user.factory';
import { DocteurFactory } from '../../modules/docteur/seeding/docteur.factory';
import { PatientFactory } from '../../modules/patient/seeding/patient.factory';
import { ServiceMedicalFactory } from '../../modules/service-medical/seeding/service-medical.factory';
import * as path from 'path';

const dataSource = new DataSource({
  ...dbConfig(),
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  factories: [
    UserFactory,
    DocteurFactory,
    PatientFactory,
    ServiceMedicalFactory,
  ],
  seeds: [Mock],
} as any);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(process.env.NODE_ENV === 'development');

  await runSeeders(dataSource);

  process.exit();
});
