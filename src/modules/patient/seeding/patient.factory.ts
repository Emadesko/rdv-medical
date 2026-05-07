import { setSeederFactory } from 'typeorm-extension';
import { fakerFR_SN } from '@faker-js/faker';
import { Patient } from '../entities/patient.entity';

export const PatientFactory = setSeederFactory(Patient, () => {
  const patient = new Patient();
  patient.nom = fakerFR_SN.person.lastName();
  patient.prenom = fakerFR_SN.person.firstName();
  patient.telephone = fakerFR_SN.phone.number();
  return patient;
});
