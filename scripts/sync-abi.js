import { readFileSync, writeFileSync } from "fs";

const artifact = JSON.parse(
  readFileSync("./artifacts/contracts/SoulboundDiploma.sol/SoulboundDiploma.json", "utf8")
);
writeFileSync("./front/src/abi/SoulboundDiploma.json", JSON.stringify(artifact.abi, null, 2));
console.log(`ABI synced (${artifact.abi.length} entries)`);
