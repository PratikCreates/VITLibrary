const { prisma } = require('../prisma/client');

function computeBalance(transactions){
    return transactions.reduce((sum,t)=>{
        return t.transaction_type === "CREDIT"
            ? sum + t.amount
            : sum - t.amount;
    },0);
}

exports.getWallet = async (req,res)=>{

    const wallet = await prisma.wallet.findUnique({
        where:{ account_id:req.user.id },
        include:{
            transactions:true,
            sources:true
        }
    });

    if(!wallet)
        return res.status(404).json({error:"Wallet not found"});

    const balance = computeBalance(wallet.transactions);

    res.json({
        balance,
        transactions:wallet.transactions,
        paymentSources:wallet.sources
    });
};

exports.addPaymentSource = async (req,res)=>{

    const {type,identifier,provider} = req.body;

    if(!type || !identifier)
        return res.status(400).json({error:"Invalid payment source"});

    const wallet = await prisma.wallet.findUnique({
        where:{account_id:req.user.id}
    });

    await prisma.paymentSource.create({
        data:{
            wallet_id:wallet.id,
            type,
            provider:provider || "MOCK",
            identifier
        }
    });

    res.status(200).json({message:"Payment source added"});
};

exports.addUPI = async (req,res)=>{

    const {upi} = req.body;

    const upiRegex = /^[\w.-]+@[\w.-]+$/;

    if(!upiRegex.test(upi))
        return res.status(400).json({error:"Invalid UPI ID"});

    const wallet = await prisma.wallet.findUnique({
        where:{account_id:req.user.id}
    });

    await prisma.paymentSource.create({
        data:{
            wallet_id:wallet.id,
            type:"UPI",
            provider:"UPI",
            identifier:upi
        }
    });

    res.status(200).json({message:"UPI added"});
};

exports.addFunds = async (req,res)=>{

    let {amount} = req.body;

    amount = parseFloat(amount);

    if(!amount || amount<=0 || amount>50000)
        return res.status(400).json({error:"Invalid amount"});

    const wallet = await prisma.wallet.findUnique({
        where:{account_id:req.user.id}
    });

    await prisma.walletTransaction.create({
        data:{
            wallet_id:wallet.id,
            amount,
            transaction_type:"CREDIT",
            description:"Wallet top-up"
        }
    });

    res.status(200).json({message:"Funds added"});
};
