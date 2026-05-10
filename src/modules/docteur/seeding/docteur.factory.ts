import { setSeederFactory } from 'typeorm-extension';
import { Docteur } from '../entities/docteur.entity';
import { fakerFR_SN } from '@faker-js/faker';

export const DocteurFactory = setSeederFactory(Docteur, () => {
  const doc = new Docteur();
  doc.nom = fakerFR_SN.person.lastName();
  doc.prenom = fakerFR_SN.person.firstName();
  doc.telephone = fakerFR_SN.phone.number();
  doc.avatar = fakerFR_SN.image.avatar();
  return doc;
});
