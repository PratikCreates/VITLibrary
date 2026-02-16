const { prisma } = require('../prisma/client');

exports.uploadDocument = async (req,res)=>{

    if(!req.file)
        return res.status(400).json({error:"No file uploaded"});

    await prisma.kycDocument.create({
        data:{
            account_id:req.user.id,
            file_path:req.file.filename,
            doc_type:req.body.type || "ID_PROOF"
        }
    });

    await prisma.account.update({
        where:{ id:req.user.id },
        data:{ verificationStatus:"VERIFIED" }
    });

    res.status(200).json({
        message:"KYC verified",
        file:req.file.filename
    });
};
