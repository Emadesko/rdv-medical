import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../core/modules/user/entities/user.entity';
import { Patient } from '../../modules/patient/entities/patient.entity';
import { Docteur } from '../../modules/docteur/entities/docteur.entity';
import { ServiceMedical } from '../../modules/service-medical/entities/service-medical.entity';
import { Specialite } from '../../modules/specialite/entities/specialite.entity';
import { fakerFR_SN } from '@faker-js/faker';
import { UserRole } from '../../core/modules/user/enums/user.role'; // ← import direct, pas via constructeur

export class Mock implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(User);
    const serviceFactory = factoryManager.get(ServiceMedical);
    const patientFactory = factoryManager.get(Patient);
    const docteurFactory = factoryManager.get(Docteur);

    const specialiteRepository = dataSource.getRepository(Specialite);
    const patientRepository = dataSource.getRepository(Patient);
    const docteurRepository = dataSource.getRepository(Docteur);

    console.log('Création des services médicaux...');
    const services = await Promise.all(
      Array(8)
        .fill('')
        .map(() => serviceFactory.make()),
    );

    console.log('Création des spécialités...');
    const specialitesData = [
      {
        nom: 'Médecine générale',
        description: 'Soins primaires et suivi général',
      },
      { nom: 'Dentisterie', description: 'Soins bucco-dentaires' },
      { nom: 'Cardiologie', description: 'Maladies du cœur et des vaisseaux' },
      { nom: 'Pédiatrie', description: 'Soins des enfants et nourrissons' },
      { nom: 'Dermatologie', description: 'Maladies de la peau' },
      { nom: 'Gynécologie', description: 'Santé féminine et maternité' },
    ];

    const specialites = specialiteRepository.create(
      specialitesData.map((s) => ({
        ...s,
        serviceMedicals: fakerFR_SN.helpers.arrayElements(
          // ← this.faker → faker
          services,
          fakerFR_SN.number.int({ min: 2, max: 4 }),
        ),
      })),
    );
    await specialiteRepository.save(specialites);

    console.log('Création des patients...');
    const patients = await Promise.all(
      Array(20)
        .fill('')
        .map(async () =>
          patientFactory.make({
            user: await userFactory.make({ role: UserRole.PATIENT }),
          }),
        ),
    );
    await patientRepository.save(patients);

    console.log('Création des docteurs...');
    const docteurs = await Promise.all(
      Array(10)
        .fill('')
        .map(async () =>
          docteurFactory.make({
            user: await userFactory.make({ role: UserRole.MEDECIN }),
            specialites: fakerFR_SN.helpers.arrayElements(
              specialites,
              fakerFR_SN.number.int({ min: 1, max: 3 }),
            ),
          }),
        ),
    );
    await docteurRepository.save(docteurs);

    console.log('✅ Seed terminé !');
    console.log(`   → ${specialites.length} spécialités`);
    console.log(`   → ${services.length} services médicaux`);
    console.log(`   → 20 patients`);
    console.log(`   → 10 docteurs`);
  }
}
