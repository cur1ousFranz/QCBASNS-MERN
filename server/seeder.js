const { seedTracks } = require("./src/seeders/TrackSeeder");
const { seedBarangays } = require("./src/seeders/BarangaySeeder");

(async () => {
    await seedBarangays();
    await seedTracks();
})()
