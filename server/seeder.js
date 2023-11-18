const { seedTracks } = require("./src/seeders/TrackSeeder");
const { seedBarangays } = require("./src/seeders/BarangaySeeder");
const { seedSections } = require("./src/seeders/SectionSeeder");

(async () => {
    await seedBarangays();
    await seedTracks();
    await seedSections()
})()
