import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../core/modules/user/entities/user.entity';
import { Patient } from '../../modules/patient/entities/patient.entity';
import { Docteur } from '../../modules/docteur/entities/docteur.entity';
import { ServiceMedical } from '../../modules/service-medical/entities/service-medical.entity';
import { Specialite } from '../../modules/specialite/entities/specialite.entity';
import { fakerFR_SN } from '@faker-js/faker';
import { UserRole } from '../../core/modules/user/enums/user.role';
import { DocteurSpecialite } from '../../modules/docteur-specialite/entities/docteur-specialite.entity';
import { ServiceSpecialite } from '../../modules/service-specialite/entities/service-specialite.entity'; // ← import direct, pas via constructeur

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
    const serviceRepository = dataSource.getRepository(ServiceMedical);

    console.log('Création des services médicaux...');

    const servicesDatas = [
      'Consultation générale',
      'Analyse de laboratoire',
      'Urgences médicales',
      'Vaccination',
    ];

    const services = await Promise.all(
      servicesDatas.map((nom) => serviceFactory.make({ nom })),
    );
    await serviceRepository.save(services);

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

    const specialites: Specialite[] = [];

    for (const d of specialitesData) {
      const servicesAlready: ServiceMedical[] = [];
      const specialite = new Specialite();
      specialite.nom = d.nom;
      specialite.description = d.description;
      specialite.serviceMedicals = [];
      for (let i = 1; i < fakerFR_SN.number.int({ min: 2, max: 4 }); i++) {
        const s = new ServiceSpecialite();
        s.specialite = specialite;
        do {
          s.serviceMedical = fakerFR_SN.helpers.arrayElement(services);
        } while (servicesAlready.includes(s.serviceMedical));
        specialite.serviceMedicals.push(s);
        servicesAlready.push(s.serviceMedical);
      }
      specialites.push(specialite);
    }

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
    patients.push(
      await patientFactory.make({
        user: await userFactory.make({
          email: 'patient@rdv.com',
          actif: true,
          role: UserRole.PATIENT,
        }),
      }),
    );
    await patientRepository.save(patients);

    console.log('Création des docteurs...');
    const docteurs: Docteur[] = [];
    for (let i = 0; i < 10; i++) {
      const specialiteAlready: Specialite[] = [];
      const doc = await docteurFactory.make({
        user: await userFactory.make({ role: UserRole.MEDECIN }),
      });
      doc.specialites = [];
      for (let j = 1; j < fakerFR_SN.number.int({ min: 2, max: 6 }); j++) {
        const s = new DocteurSpecialite();
        do {
          s.specialite = fakerFR_SN.helpers.arrayElement(specialites);
        } while (specialiteAlready.includes(s.specialite));
        specialiteAlready.push(s.specialite);
        s.docteur = doc;
        doc.specialites.push(s);
      }
      docteurs.push(doc);
    }
    const admin = await docteurFactory.make({
      user: await userFactory.make({
        email: 'docteur@rdv.com',
        actif: true,
        role: UserRole.ADMIN,
      }),
    });
    admin.specialites = [];
    const specialiteAlready: Specialite[] = [];
    for (let j = 1; j < fakerFR_SN.number.int({ min: 2, max: 6 }); j++) {
      const s = new DocteurSpecialite();
      do {
        s.specialite = fakerFR_SN.helpers.arrayElement(specialites);
      } while (specialiteAlready.includes(s.specialite));
      s.docteur = admin;
      specialiteAlready.push(s.specialite);
      admin.specialites.push(s);
    }
    docteurs.push(admin);
    await docteurRepository.save(docteurs);

    console.log('✅ Seed terminé !');
    console.log(`   → ${specialites.length} spécialités`);
    console.log(`   → ${services.length} services médicaux`);
    console.log(`   → 20 patients`);
    console.log(`   → 10 docteurs`);
  }
}
