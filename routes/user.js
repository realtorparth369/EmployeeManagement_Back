const express = require('express');
const connection = require('../connection');
const router = express.Router();
require('dotenv').config();


const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const app = express();
const axios = require('axios');
















// Client side Authentication
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select * from invitation where employee_email=?"
    rights= "no"
    connection.query(query, [user.userinfo.email], (err, results) => {
        if (!err) {
            if (results[0].company_code != user.userinfo.c_code) {
                console.log("you are not elligible")
                return res.status(400).json({ message: "you are not elligible" });
            } else if (results[0].company_code == user.userinfo.c_code) {
                query = "select email,password from users where email=?"
                connection.query(query, [user.userinfo.email], (err, results) => {
                    if (!err) {
                        if (results.length <= 0) {
                            query = "insert into users(has_all_rights,userName,email,password,mobileNumber,companyName) values(?,?,?,?,?,?)";
                            connection.query(query, [rights,user.userinfo.userName, user.userinfo.email, user.userinfo.password, user.userinfo.mobileNumber, user.cname], (err, results) => {
                                if (!err) {
                                    return res.status(200).json({ message: "Successfully Registered" });
                                } else {
                                    return res.status(500).json(err);
                                }
                            });
                        } else {
                            console.log("you are not elligibleeeeeeeeeee")
                            return res.status(400).json({ message: "Email Already Exist" });
                        }
                    } else {
                        return res.status(500).json(err, { server: "server down" });
                    }
                });
            } else {
                return res.status(500).json(err, { server: "server down" });
            }

        } else {
            return res.status(500).json(err, { server: "server down" });
        }

    });

});




router.post('/login', (req, res) => {
    console.log("fdfdgfywbgywb")
    const user = req.body;
    query = "select email,password from users where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                // console.log("incorrect")
                return res.status(401).json({ message: "Incorrect Username or Password" });
            } else if (results[0].password === user.password) {
                res.status(200).json({ message: "User Authentication Success" });
            } else {
                return res.status(400).json({ message: "Something went Wrong" });
            }
        } else {
            return res.status(500).json(err);
        }
    });

});




router.post('/getPersonaldata', (req, res) => {
    const user = req.body;
    query = "select * from users where email=?";
    connection.query(query, [user.emails], (err, results) => {
        if (!err) {
            res.status(200).json({ token: results[0] });
        } else {
            return res.status(500).json(err);
        }
    });

});

// router.post('/getPersonaldata', (req, res) => {

//     const user = req.body;
//     // console.log(user.emails)
//     query = "select * from users where email=?";
//     connection.query(query, [user.emails], (err, results) => {
//         if (!err) {
//             if (results[0].email !== user.emails) {
//                 // console.log("incorrect")
//                 return res.status(401).json({ message: "Incorrect Username or Password" });
//             } else if (results[0].email === user.emails) {
//                 console.log(results[0].skills)

//                 const resultString = results[0].skills
//                 const namesArray2 = resultString.split(', ').map(name => name.trim());
//                 const arrayOfObjects = namesArray2.map(name => ({ name }));
//                 console.log(arrayOfObjects);

//                 res.status(200).json({ token: results[0], skills: arrayOfObjects });
//             } else {
//                 // console.log("something wrong")
//                 return res.status(400).json({ message: "Something went Wrong" });
//             }
//         } else {
//             // console.log("error")
//             return res.status(500).json(err);
//         }
//     });

// });



// Client side Authentication
router.post('/updatePersonaldata', (req, res) => {
    let user = req.body;
    query = "select * from users where email=?";
    connection.query(query, [user.emails], (err, results) => {
        if (!err) {
            query = "update users set userName=?,email=?,dob=?,gender=?, maritalstatus=?,mobileNumber=?,companyName=?,websiteLink=?,address=?,country=?,employeeid=?,jobtitle=?,department=?,dateofjoining=?,employmenttype=?,supervisorormanagerName=?,languagespoken=?,otherrelevantinformation=? where email=?";
            connection.query(query, [user.allinfo.userName, user.allinfo.email, user.allinfo.dob, user.allinfo.gender, user.allinfo.maritalstatus, user.allinfo.mobileNumber, user.allinfo.comapanyName, user.allinfo.websiteLink, user.allinfo.address, user.allinfo.country, user.allinfo.employeeid, user.allinfo.jobtitle, user.allinfo.department, user.allinfo.dateofjoining, user.allinfo.employmenttype, user.allinfo.supervisorormanagerName, user.allinfo.languagespoken, user.allinfo.otherrelevantinformation, user.emails], (err, results) => {
                if (!err) {
                    return res.status(200).json({ message: "Succesfully Update" });
                } else {
                    return res.status(500).json(err);
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});



router.post('/getAllEmployeeData', (req, res) => {
    const user = req.body;
    // console.log(user.cname)
    query = "select * from users where companyName=?";
    connection.query(query, [user.cname], (err, results) => {
        if (!err) {
            console.log("results")
            // console.log(results)
            // return res.status(200).json({ results });
            return res.status(200).json({ token: results });
        } else {
            return res.status(500).json(err);
        }
    });
});




router.post('/getEmployeeData', (req, res) => {
    const user = req.body;
    console.log(user.id)
    query = "select * from users where id=?";
    connection.query(query, [user.id], (err, results) => {
        if (!err) {
            if (results[0].id != user.id) {
                return res.status(401).json({ message: "Incorrect Username or Password" });
            } else if (results[0].id == user.id) {
                return res.status(200).json({ token: results[0] });
            } else {
                return res.status(400).json({ message: "Something went Wrong" });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});





router.post('/updatePersonalskills', (req, res) => {
    let user = req.body;
    array = user.skills
    query = "select * from users where email=?";
    const namesArray = array.map(obj => obj.name);
    const resultString = namesArray.join(', ');
    connection.query(query, [user.emails], (err, results) => {
        if (!err) {
            query = "update users set skills=? where email=?";
            connection.query(query, [resultString, user.emails], (err, results) => {
                if (!err) {
                    return res.status(200).json({ message: "Succesfully Update" });
                } else {
                    return res.status(500).json(err);
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});


router.post('/updateProfileimage', (req, res) => {
    let user = req.body;
    query = "select * from users where email=?";
    connection.query(query, [user.emails], (err, results) => {
        if (!err) {
            query = "update users set profile_image=? where email=?";
            connection.query(query, [user.img, user.emails], (err, results) => {
                if (!err) {
                    return res.status(200).json({ message: "Succesfully Update" });
                } else {
                    return res.status(500).json(err);
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});




router.post('/addQuality', (req, res) => {
    let user = req.body;
    query = "insert into employeeQualities(email,otherEmployeeEmail,quality) values(?,?,?)"
    connection.query(query, [user.emails, user.otherEmployeeEmail, user.quality.quality], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Successfully Registered" });
        } else {
            return res.status(500).json(err, { server: "server down" });
        }
    });
});



router.post('/getQuality', (req, res) => {
    const user = req.body;
    query = "select * from employeeQualities where otherEmployeeEmail=?";
    connection.query(query, [user.emails], (err, results) => {
        if (!err) {
            if (results <= 0) {
                return res.status(400).json({ message: "Data not Found" });
            }
            else {
                if (results[0].otherEmployeeEmail != user.emails) {
                    return res.status(401).json({ message: "Incorrect" });
                } else if (results[0].otherEmployeeEmail == user.emails) {
                    return res.status(200).json({ token: results });
                } else {
                    return res.status(200).json({ message: "Something went Wrong" });
                }
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/getEmployeeQuality', (req, res) => {
    const user = req.body;
    query = "select * from employeeQualities where otherEmployeeEmail=?";
    connection.query(query, [user.otherEmployeeEmail], (err, results) => {
        if (!err) {
            if (results <= 0) {
                return res.status(400).json({ message: "Data not Found" });
            }
            else {
                if (results[0].otherEmployeeEmail != user.otherEmployeeEmail) {
                    return res.status(401).json({ message: "Incorrect" });
                } else if (results[0].otherEmployeeEmail == user.otherEmployeeEmail) {
                    return res.status(200).json({ token: results });
                } else {
                    return res.status(200).json({ message: "Something went Wrong" });
                }
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/updateQuality', (req, res) => {
    let user = req.body;
    query = "update employeeQualities set quality=? where otherEmployeeEmail=? and email=?";
    connection.query(query, [user.quality, user.otherEmployeeEmail, user.emails], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Succesfully Update" });
        } else {
            return res.status(500).json(err);
        }
    });
});





router.post('/deleteQuality', (req, res) => {
    const user = req.body;
    query = "delete from employeeQualities where email=? and otherEmployeeEmail=? and id=?";
    connection.query(query, [user.emails, user.otherEmployeeEmail, user.qualityid], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Succesfully Delete" });
        } else {
            return res.status(500).json(err);
        }
    });

});






const crypto = require('crypto');

// Key and initialization vector (IV)
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32); // 256-bit key
// const iv = crypto.randomBytes(16);  // 128-bit IV

const key = Buffer.from('12345678901234567890123456789012', 'utf8'); // 32 bytes for AES-256
const iv = Buffer.from('1234567890123456', 'utf8');                  // 16 bytes for AES

// Encrypt function
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Decrypt function
function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log("decrypted")
    console.log(decrypted)
    return decrypted;
}





// Client side Authentication
router.post('/companyAdmin/signup', (req, res) => {
    let user = req.body;

    query = "select email,password from users where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
				const encryptedAdvisorPassword = encrypt(String(user.password));
                query = "insert into companyAdmin(companyName,companyadminName,companyadminEmail,companyadminpassword,companyadminMobileNumber) values(?,?,?,?,?)";
                connection.query(query, [user.companyName, user.companyAdminName, user.companyAdminemail, user.companyAdminpassword, user.companyAdminmobileNumber], (err, results) => {
                    if (!err) {
                        
			// const decryptedOutputPassword = decrypt(results[0].companyadminpassword);
            // console.log(decryptedOutputPassword)

                        const OTP = otpGenerator.generate(4, {
                            digits: true, alphabets: false, upperCase: false, specialChars: false
                        });
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'paramsolutionsotp@gmail.com',
                                pass: 'lmukdngstebmywzd'
                            }
                        });
                        var mailOptions = {
                            from: 'paramsolutionsotp@gmail.com',
                            to: user.companyAdminemail,
                            subject: 'ParamSolutions.inc',
                            text: `Hello from ParamSolutions.inc Thanks to connect with our Team. Your OTP is ` + OTP + `. This OTP will not used after 5 Minutes so Please Hurry up to Signin. we will catch you there...`
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            // if (error) {
                            //     console.log(error);
                            // } else {
                            //     console.log('Email sent: ' + info.response);
                            // }
                        });
                        console.log("otp: " + OTP)
                        otpquery = "update companyAdmin set otp=" + OTP + " where companyadminEmail=?";
                        connection.query(otpquery, [user.companyAdminemail], (error, result) => {
                            if (!error) {
                                console.log("OTP saved Succesfully");
                            } else {
                                console.log("OTP not Saved");
                            }
                        });
                        return res.status(200).json({ message: "Successfully Registered" });
                    } else {
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({ message: "Email Already Exist" });
            }
        } else {
            return res.status(500).json(err, { server: "server down" });
        }
    });
});





router.post('/companyAdmin/verification', (req, res) => {
    const user = req.body;
    query = "select otp from companyAdmin where otp=?";
    connection.query(query, [user.otp], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].otp != user.otp) {
                return res.status(401).json({ message: "Incorrect OTP" });
            } else if (results[0].otp = user.otp) {
                const response = { otp: results[0].otp }
                res.status(200).json({ message: "Successfully Loged In" });
            } else {
                return res.status(400).json({ message: "Something went Wrong" });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});





router.post('/companyAdmin/login', (req, res) => {
    const user = req.body;
    console.log(user)
    query = "select companyadminEmail,companyadminpassword from companyadmin where companyadminEmail=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            console.log(results[0].companyadminpassword)
			// const decryptedOutputPassword = decrypt(results[0].companyadminpassword);
            // console.log(decryptedOutputPassword)
            if (results.length <= 0 || results[0].companyadminpassword != user.password) {
                // console.log(decryptedOutputPassword)
                return res.status(401).json({ message: "Incorrect Username or Password" });
            } else if (results[0].companyadminpassword === user.password) {
                // console.log(decryptedOutputPassword)
                res.status(200).json({ message: "User Authentication Success" });
            } else {
                return res.status(400).json({ message: "Something went Wrong" });
            }
        } else {
            return res.status(500).json(err);
        }
    });

});



router.post('/companyAdmin/getPersonaldata', (req, res) => {
    const user = req.body;
    console.log("user.emails")
    console.log(user.emails)
    query = "select * from companyAdmin where companyadminEmail=?";
    connection.query(query, [user.emails], (err, results) => {
        if (!err) {
            return res.status(200).json({ token: results[0] });
        } else {
            return res.status(500).json(err);
        }
    });

});


router.post('/superAdmin/getEmployeedata', (req, res) => {
    const user = req.body;
    query = "select * from companyAdmin where id=?";
    connection.query(query, [user.ids], (err, results) => {
        if (!err) {
            return res.status(200).json({ token: results[0] });
        } else {
            return res.status(500).json(err);
        }
    });

});



router.post('/companyAdmin/employee/invite', (req, res) => {
    const data = req.body;
    query = "select company_admin_email from invitation where company_admin_email=?"
    connection.query(query, [data.comanyAdminEmail], (err, results) => {
        if (!err) {
            if (data.comanyAdminEmail === data.userinfo.employee_email) {
                return res.status(401).json({ message: "Advisor already Invited" });
            }
            else if (results.length <= 0 || results[0].company_admin_email !== data.userinfo.employee_email || results[0].company_admin_email === data.userinfo.employee_email) {
                query = "insert into invitation(company_admin_email,employee_email,company_code) values(?,?,?)";
                connection.query(query, [data.comanyAdminEmail, data.userinfo.employee_email, data.userinfo.c_code], (err, results) => {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'paramsolutionsotp@gmail.com',
                            pass: 'lmukdngstebmywzd'
                        }
                    });
                    var mailOptions = {
                        from: 'paramsolutionsotp@gmail.com',
                        to: data.userinfo.employee_email,
                        subject: 'ParamSolutions.inc',
                        text: `Hello this is your Company Code "` + data.userinfo.c_code + `". use this code in registration  http://localhost:4200/registration/` + data.c_name
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return res.status(500).json(err);
                        } else {
                            return res.status(200).json({ message: "Succesfully Registered" });
                        }
                    });
                    return res.status(200).json({ message: "Successfully Loged In" });
                });
            }
            else {
                return res.status(400).json({ message: "Something went Wrong" });
            }
        } else {
            return res.status(500).json(err, { server: "server down" });
        }
    });
});






router.post('/superAdmin/login', (req, res) => {
    const user = req.body;
    if (user.email == "paramso01" && user.password == "Harismaran369!") {
        res.status(200).json({ message: "User Authentication Success" });
    } else {
        return res.status(500).json({ message: "Not matched" });
    }
});




router.post('/getAllCompanyAdminData', (req, res) => {
    const user = req.body;
    query = "select * from companyadmin";
    connection.query(query, (err, results) => {
        if (results <= 0) {
            return res.status(500).json(err);
        } else {
            if (!err) {
                return res.status(200).json({ token: results });
            } else {
                return res.status(400).json(err);
            }
        }
    });

});



router.post('/giveallRightstoEmployee', (req, res) => {
    const user = req.body;
    rights = "yes"
    query = "update users set has_all_rights=? where id=?";
    connection.query(query, [rights, user.employeeid], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "update successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});



router.post('/backallRightstoEmployee', (req, res) => {
    const user = req.body;
    rights = "no"
    query = "update users set has_all_rights=? where id=?";
    connection.query(query, [rights, user.employeeid], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "update successfully" });
        } else {
            return res.status(500).json(err);
        }
    });

});




router.post('/getparticularCompanyAdminData', (req, res) => {
    const user = req.body;
    query = "select * from companyAdmin where id=?";
    connection.query(query, [user.id], (err, results) => {
        if (!err) {
            return res.status(200).json({ token: results[0] });
        } else {
            return res.status(500).json(err);
        }
    });
});



router.post('/updateparticularCompanyAdminData', (req, res) => {
    let user = req.body;
    query = "update companyAdmin set companyadminName=?,companyadminEmail=?,companyadminMobileNumber=?,companyName=?,dob=?,gender=?,maritalstatus=?,websiteLink=?,address=?,country=?,dateofjoining=?,languagespoken=?,otherrelevantinformation=? where companyadminEmail=?";
    connection.query(query, [user.allinfo.companyadminName, user.allinfo.companyadminEmail, user.allinfo.companyadminMobileNumber, user.allinfo.companyName, user.allinfo.dob, user.allinfo.gender, user.allinfo.maritalstatus, user.allinfo.websiteLink, user.allinfo.address, user.allinfo.country, user.allinfo.dateofjoining, user.allinfo.languagespoken, user.allinfo.otherrelevantinformation, user.emails], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Succesfully Update" });
        } else {
            return res.status(500).json(err);
        }
    });
});





module.exports = router;