const { prisma } = require('../prisma/client');

function computeBalance(transactions) {
    return transactions.reduce((sum, t) => {
        return t.transaction_type === "CREDIT"
            ? sum + t.amount
            : sum - t.amount;
    }, 0);
}

exports.getStats = async (req, res) => {
    try {
        const totalBooks = await prisma.book.count();
        const activeBookings = await prisma.booking.count({ where: { status: 'ACTIVE' } });
        const libraryMembers = await prisma.account.count({ where: { role: { in: ['STUDENT', 'EMPLOYEE'] } } });

        // Mocking revive rate for now as it's a derived stat
        const reviveRate = "94%";

        res.json({
            totalBooks,
            activeBookings,
            libraryMembers,
            reviveRate
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch admin stats" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.account.findMany({
            where: { role: { in: ['STUDENT', 'EMPLOYEE'] } },
            include: {
                student: true,
                employee: true,
                wallet: {
                    include: { transactions: true }
                }
            }
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            idNumber: user.role === 'STUDENT' ? user.student?.register_number : user.employee?.employee_code,
            balance: computeBalance(user.wallet?.transactions || []),
            verificationStatus: user.verificationStatus
        }));

        res.json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                account: true,
                book: true
            },
            orderBy: { borrow_date: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

exports.updateKycStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        await prisma.account.update({
            where: { id: userId },
            data: { verificationStatus: status }
        });
        res.json({ message: `KYC status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to update KYC status" });
    }
};
