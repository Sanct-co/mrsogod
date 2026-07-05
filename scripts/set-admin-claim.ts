import { adminAuth } from "../lib/firebase/admin";

async function main() {
  const uid = process.argv[2];
  if (!uid) {
    console.error("Usage: npx tsx scripts/set-admin-claim.ts <uid>");
    process.exit(1);
  }

  await adminAuth.setCustomUserClaims(uid, { admin: true });
  console.log(`Granted admin claim to ${uid}`);
}

main();
