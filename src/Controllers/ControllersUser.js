const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const users = require("../Models/User");
const bcrypt = require("bcrypt");
exports.getAlls = async (req, res, next) => {
    try {
        let { page, limit ,search} = req.query;
        if(limit || page){
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 2;

        const totalUsers = await users.countDocuments();

        const totalPages = Math.ceil(totalUsers / limit);

        page = Math.min(page, totalPages);

        const offset = (page - 1) * limit;

        const data = await users.find()
            .skip(offset)
            .limit(limit);
         
      const user = data.filter((value)=>{
       const regex = new RegExp(search, 'i'); // 'i' untuk pencarian case-insensitive
             return regex.test(value.username) || regex.test(value.email) ;
       })

        res.status(200).json({
            totalUsers,
            totalPages,
            currentPage: page,
            data:user > -1 ? data:user
        });
    }else if(search){
       const regex = new RegExp(search, 'i')
       const dataSearch = await users.find({ 
           $or: [
               { username: { $regex: regex } }, 
               { email: { $regex: regex } }
           ] 
       })
        res.status(200).json({
            data:dataSearch,
            message:"search Alls data"
        }
        ); 
    }else{
        const dataAlls= await users.find()
        res.status(200).json({
            dataAlls,
            message:"All data"
        })
    }
       
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.deletes = async (req, res, next) => {
    try {
        const { deletes } = req.query;
        
        if (!deletes) {
            return res.status(400).json({
                message: "Parameter 'deletes' diperlukan"
            });
        }
        
        const objectId = new mongoose.Types.ObjectId(deletes);

        const result = await users.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Pengguna tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Pengguna berhasil dihapus",
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.Updates= async (req,res,next)=>{
    

    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(200).json({
                status:500,
                error:errors.array()
            })
        }

        const {username,email,password,newPassword}=req.body

        const {user}=req.query

        const obj={}

        const account = await users.findOne({ username: user});

        if(!account){
                res.status(400).json({
                    message:"tidak ada akun yang di update"
                })  
        }

        if(account){
            if (password) {

                try {
                    const result = await bcrypt.compare(password, account.password);
                    if (result) {
                        const hashedPassword = await bcrypt.hash(newPassword, 10);
                        obj.password = hashedPassword;
                    } else {
                        return res.status(404).json({
                            message: "password invalid"
                        });
                    }
                    
                } catch (error) {
                    return res.status(500).json({
                        message: "Error comparing or hashing passwords",
                        status: 500,
                        error:error
                    });
                }

            }
            if (username) {
                const validUser = await users.findOne({ username: username });
                if (validUser) {
                    return res.status(400).json({ message: "Username sudah digunakan" });
                } else {
                    obj.username = username;
                }
            }
            
        email ? obj.email=email:null

        if(account){

        users.updateOne(
            { username: user },
            { $set: obj }
        ).then(()=>{

            res.status(200).json({
                message:"update successfull"
            })
            
          }).catch(error => {

            res.status(400).json({
              message:"update failed",
              error
            })

          });

        }}
    }catch(error){
        next(error)
    }
}