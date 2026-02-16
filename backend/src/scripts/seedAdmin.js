const { prisma } = require('../prisma/client');
const bcrypt = require('bcrypt');

async function seedAdmin() {
    const email = "admin@vit.ac.in";
    const password = "adminPassword123";
    const name = "Library Admin";

    const existing = await prisma.account.findUnique({
        where: { email }
    });

    if (existing) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.account.create({
        data: {
            name,
            email,
            password_hash: hashedPassword,
            role: "ADMIN",
            dob: new Date("1980-01-01"),
            verificationStatus: "VERIFIED"
        }
    });

    console.log("Admin account created successfully!");
    console.log("Email: " + email);
    console.log("Password: " + password);
}

seedAdmin()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
