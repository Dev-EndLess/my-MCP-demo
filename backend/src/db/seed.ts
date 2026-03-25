/**
 * Seed script — popola il DB con contatti di esempio.
 * Esecuzione: npx tsx src/db/seed.ts (dalla cartella backend/)
 */
import { contactsDb } from "./database.js";

const SEED_CONTACTS = [
  {
    name: "Marco Rossi",
    email: "marco.rossi@gmail.com",
    phone: "+39 333 1234567",
    notes: "Amico di vecchia data",
  },
  {
    name: "Sara Bianchi",
    email: "sara.bianchi@gmail.com",
    phone: "+39 347 9876543",
    notes: "Collega di lavoro",
  },
  {
    name: "Luca Verdi",
    email: "luca.verdi@example.com",
    phone: "+39 320 5551234",
    notes: "Cliente principale",
  },
  {
    name: "Anna Neri",
    email: "anna.neri@example.com",
    phone: null,
    notes: "Da richiamare",
  },
  {
    name: "Fabrizio Ferrari",
    email: "fabrizio.ferrari@gmail.com",
    phone: "+39 391 1112233",
    notes: null,
  },
];

console.log("🌱 Seeding database...\n");

async function seed() {
  let inserted = 0;
  let skipped = 0;

  for (const contact of SEED_CONTACTS) {
    try {
      const created = await contactsDb.add(contact);
      console.log(`  ✅ Aggiunto: ${created.name} <${created.email}>`);
      inserted++;
    } catch (err: unknown) {
      // UNIQUE constraint su email → contatto già esistente
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("UNIQUE")) {
        console.log(`  ⚠️  Saltato (già esiste): ${contact.name} <${contact.email}>`);
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`\n✅ Seed completato: ${inserted} inseriti, ${skipped} saltati.`);
}

seed().catch((err) => {
  console.error("❌ Errore durante il seed:", err);
  process.exit(1);
});
