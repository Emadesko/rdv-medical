import { setSeederFactory } from 'typeorm-extension';
import { Docteur } from '../entities/docteur.entity';
import { fakerFR_SN } from '@faker-js/faker';
import { Creneau } from '../../creneau/entities/creneau.entity';
import { StatutCreneau } from '../../creneau/enums/statut-creneau';

// Plages horaires fixes par créneau de 30min
const PLAGES = [
  { debut: '08:00', fin: '08:30' },
  { debut: '08:30', fin: '09:00' },
  { debut: '09:00', fin: '09:30' },
  { debut: '09:30', fin: '10:00' },
  { debut: '10:00', fin: '10:30' },
  { debut: '10:30', fin: '11:00' },
  { debut: '11:00', fin: '11:30' },
  { debut: '11:30', fin: '12:00' },
  { debut: '14:00', fin: '14:30' },
  { debut: '14:30', fin: '15:00' },
  { debut: '15:00', fin: '15:30' },
  { debut: '15:30', fin: '16:00' },
  { debut: '16:00', fin: '16:30' },
  { debut: '16:30', fin: '17:00' },
];

export const DocteurFactory = setSeederFactory(Docteur, () => {
  const doc = new Docteur();
  doc.nom = fakerFR_SN.person.lastName();
  doc.prenom = fakerFR_SN.person.firstName();
  doc.telephone = fakerFR_SN.phone.number();
  doc.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${fakerFR_SN.string.uuid()}`;
  doc.creneaux = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    if (!fakerFR_SN.datatype.boolean()) continue;

    for (const plage of PLAGES) {
      if (!fakerFR_SN.datatype.boolean()) continue;
      const creneau = new Creneau();
      creneau.date = new Date(date);
      creneau.heureDebut = plage.debut;
      creneau.heureFin = plage.fin;
      creneau.statut = fakerFR_SN.helpers.arrayElement([
        StatutCreneau.DISPONIBLE,
        StatutCreneau.DISPONIBLE,
        StatutCreneau.DISPONIBLE,
        StatutCreneau.BLOQUE,
      ]);
      creneau.docteur = doc;
      doc.creneaux.push(creneau);
    }
  }

  return doc;
});
