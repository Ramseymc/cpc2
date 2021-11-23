const express = require("express");
const router = express.Router();
const pool = require("./connection");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const chalk = require("chalk")

    // file upload stuff
    const fileFilter = function (req, file, cb) {
        const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error("Wrong file type");
            error.code = "LIMIT_FILE_TYPES";
            console.log(req.path, error);
            return cb(error, false);

        }
        cb(null, true);
    };

    let MAX_SIZE = 20000000;
    const upload = multer({
        dest: "./public/uploads/",
        fileFilter,
        limits: {
            fileSize: MAX_SIZE,
            fieldSize: 100 * 1024 * 1024,
        },
    });

    function renameFile(req) {
        let fileDetails = [];
        // file manipulation
        if (req.files.length) {
            let contains = req.body.contains.split(",");
       
            contains.forEach((el, index, arr) => {
                let mainIndex = index;
                if (req.files[mainIndex] !== "undefined" || req.files[mainIndex] !== undefined ) {
                    console.log("FILES AFTER CHECK::: ", req.files[mainIndex])
                    let insert = {
                        fileType: el,
                        //fileName: `${req.files[mainIndex].filename}.${req.files[mainIndex].mimetype.split("/")[1]}`,
                        fileName: req.files[mainIndex].filename,
                        originalName: req.files[mainIndex].originalname,
                    };
                    fileDetails.push(insert);
                }
            });

            console.log("fileDetails", fileDetails);

            fileDetails.forEach((el) => {
                let filtered = req.files.filter((el2) => {
                    return el2.filename === el.originalName;
                });
                el.fileNameUpdated = `${el.fileName}`;
                fs.rename(
                    
                    `public/uploads/${el.fileNameUpdated}`,
                    `public/uploads/${el.originalName}`,
                    (err) => {
                        if (err) console.log("Error renaming", err);
                        //throw err
                    }
                    
                );
                console.log("CONNOR:: file renamed from" + `${el.fileNameUpdated}` + " to " + `${el.originalName}`)
            });
            
        }
        return fileDetails
    }

    function excecuteSQL(sql, res) {
        console.log("EXECUTIUNG SQL STATEMENT")
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                resizeBy.send("Error with connection");
            }            
            connection.query(sql, function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    res.json(result);
                    console.log("SQL Statement executed successfully - see json result in browser.");
                  //  console.log(result);
                }
            });
            connection.release();
        });
    }

    router.post("/uploadImage", upload.single("stockImage"), (req, res) => {
        console.log("imageUploaded and renamed to: ", req.body.newImageName);
        // rename the image 
        console.log("req.file", req.file)
        fs.rename(
            `public/uploads/${req.file.filename}`,
            `public/uploads/${req.body.newImageName}`,
            (err) => {
                if (err) console.log("Error renaming", err);
                //throw err
            }
        );
    }),
   
    // ------------------------------------------------------------------------------------------------
    // Investor App Methods
    // ------------------------------------------------------------------------------------------------
    router.post("/updateInvestment", upload.array("documents"), (req, res) => {
        console.log("updateInvestment req", req.body)           
        let fileDetails = renameFile(req) 
        

        var today = new Date();
        let dateToday = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
      
        let mysql = `UPDATE investments 
            SET     
                investment_amount = '${req.body.investmentAmount}',                
                end_date = '${req.body.repaymentDate}',
                investment_interest_rate =  '${req.body.investmentPerc}',
                repayment_amount   = '${req.body.repaymentAmount}',                       
                lastupdated = '${dateToday}', 
                release_percentage =   '${req.body.releasePerc}',
                release_date = '${req.body.releaseDate}',
                release_amount = '${req.body.releaseAmount}',
                linked_unit = '${req.body.linkedUnit}',
                project = '${req.body.project}' `        

        // investment files
        let additionalSQL = ""
        let singedLoanAgreementFileSQL = fileDetails.filter((el) => { return el.fileType === 'singedLoanAgreementFile' })          
            if (singedLoanAgreementFileSQL.length > 0) { singedLoanAgreementFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, singedLoanAgreementFile = '${el.originalName}'`
            })
        }        
        let POPFileSQL = fileDetails.filter((el) => {  return el.fileType === 'POPFile' })  
            if (POPFileSQL.length > 0) { POPFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, POPFile = '${el.originalName}'`
            })
        }        
        let attorneyConfirmLetterFileSQL = fileDetails.filter((el) => {  return el.fileType === 'attorneyConfirmLetterFile' })  
            if (attorneyConfirmLetterFileSQL.length > 0) { attorneyConfirmLetterFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, attorneyConfirmLetterFile = '${el.originalName}'`
            })
        }
    
        if(additionalSQL.length) {
            mysql = `${mysql} ${additionalSQL}` 
            + ` WHERE investor_id = '${req.body.investorId}' `
            + ` AND investment_id = '${req.body.investmentId}' ; ` 
          } else {
            mysql = `${mysql} `
        + ` WHERE investor_id = '${req.body.investorId}' `
        + ` AND investment_id = '${req.body.investmentId}' ; ` 
          }
         
        console.log(chalk.green("createInvestment SQL = ",mysql))
        excecuteSQL(mysql, res);
    }),

    router.post("/getInvestorSuffix", (req, res) => {
        // sql to get the count of investors whos surname is like ${req.body.investorPrefix}
        let mysql = `SELECT COUNT(*) + 1 as count FROM investors i WHERE i.investor_surname LIKE '${req.body.investorPrefix}%' ` 
        excecuteSQL(mysql, res);

    }),
    //getInvestorSuffixNumber()
    // complete sql
    router.post("/createInvestment", upload.array("documents"), (req, res) => {
        let fileDetails = renameFile(req)       

        let singedLoanAgreementFile;
        let POPFile;
        let attorneyConfirmLetterFile;

        if (fileDetails.length) {

            singedLoanAgreementFile = fileDetails.filter((el) => {
                return el.fileType === "singedLoanAgreementFile";
            });
            if (singedLoanAgreementFile.length) {
                singedLoanAgreementFile = singedLoanAgreementFile[0].originalName;
            } else {
                singedLoanAgreementFile = "";
            }

            POPFile = fileDetails.filter((el) => {
                return el.fileType === "POPFile";
            });
            if (POPFile.length) {
                POPFile = POPFile[0].originalName;
            } else {
                POPFile = "";
            }

            attorneyConfirmLetterFile = fileDetails.filter((el) => {
                return el.fileType === "attorneyConfirmLetterFile";
            });
            if (attorneyConfirmLetterFile.length) {
                attorneyConfirmLetterFile = attorneyConfirmLetterFile[0].originalName;
            } else {
                attorneyConfirmLetterFile = "";
            }
        }
        
        var today = new Date();
        let dateToday = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        // add to database , 
        // then do the update like the salesone :) ! :) 

        // dbl check the form_appends 
        // msg Kaven, + Richard
        // Tarot, astrology, silicon valley 
        // indian shop , beach, films later
        let mysql = `INSERT INTO investments (
                        investor_id,
                        investment_amount,
                        
                        end_date,
                        investment_interest_rate,    
                        repayment_amount,                  
                        lastupdated,
                        datecreated,

                        release_percentage, 
                        release_date,
                        release_amount, 

                        linked_unit, 
                        project, 

                        singedLoanAgreementFile, 
                        POPFile, 
                        attorneyConfirmLetterFile)  
                      VALUES (
                        '${req.body.investorId}',
                        '${req.body.investmentAmount}',
                        
                        '${req.body.repaymentDate}',
                        '${req.body.investmentPerc}',
                        '${req.body.repaymentAmount}',                    
                        '${dateToday}', 
                        '${dateToday}', 
                        
                        '${req.body.releasePerc}',
                        '${req.body.releaseDate}',
                        '${req.body.releaseAmount}',

                        '${req.body.linkedUnit}',
                        '${req.body.project}',

                        '${singedLoanAgreementFile}', 
                        '${POPFile}', 
                        '${attorneyConfirmLetterFile}'
                      )`

        console.log(chalk.green("createInvestment SQL = ",mysql))
        excecuteSQL(mysql, res)
    }),

    
    router.post("/getAllInvestments", (req, res) => {

        let mysql = `select * from investors i join investments iv on iv.investor_id = i.investor_id where iv.investment_amount > 0 and i.investor_id = ${req.body.paramId}`
        excecuteSQL(mysql, res)       
    }),
    router.post("/getInvestmentDetails", (req, res) => {
        console.log(req.body)
        let mysql = `select * from investments iv join investors i on i.investor_id = iv.investor_id WHERE iv.investment_id = ${req.body.paramId}` 
        console.log("GET INVESTOR DEETS SQL = ", mysql)
        excecuteSQL(mysql, res)
        // pool.getConnection(function (err, connection) {
        //     if (err) {
        //         connection.release();
        //         resizeBy.send("Error with connection");
        //     }
        //     connection.query(mysql, function (error, result) {
        //         if (error) {
        //             console.log(error);
        //         } else {
        //             res.json(result);
        //         }
        //     });
        //     connection.release();
        // });
    }),
    // test
    router.post("/updateInvestor", upload.array("documents"), (req, res) => {
        console.log("$$$ 100 % $$$ updateInvestor request.body", req.body)     
        let fileDetails = renameFile(req) 
       

        let mysql = `UPDATE investors
        SET 
        investor_name = '${req.body.investorName}',
        investor_surname= '${req.body.investorSurname}',
        investor_id_number= '${req.body.investorIDNumber}',
        contact_email= '${req.body.contactEmail}',
        investor_mobile= '${req.body.mobile}',
        investor_landline= '${req.body.landline}',                                              
        investor_two_name= '${req.body.investorTwoInitials}',
        investor_two_surname='${req.body.investorTwoSurname}',
        investor_two_id_number = '${req.body.investorTwoIDNumber}',
        company_name = '${req.body.companyName}',
        ref_number =  '${req.body.regNumber}',
        company_rep_initals = '${req.body.companyRepInitials}',
        company_rep_surname = '${req.body.companyRepSurname}',
        company_rep_id_number = '${req.body.companyRepIDNumber}',                                                                    
        contact_two_email = '${req.body.contactTwoEmail}',
        mobile =  '${req.body.mobile}',
        landline = '${req.body.landline}',
        mobile_two = '${req.body.mobileTwo}',
        landline_two = '${req.body.landlineTwo}',
        street_no = '${req.body.streetNo}',
        street_name = '${req.body.streetName}',
        address_suburb = '${req.body.addressSuburb}',
        investor_physical_suburb = '${req.body.addressSuburb}',
        province = '${req.body.province}',
        investor_physical_province = '${req.body.province}',
        investor_physical_postal_code = '${req.body.addressPostalCode}',
        box_no = '${req.body.boxNo}',
        investor_postal_street_box = '${req.body.boxNo}',
        postal_suburb = '${req.body.postalSuburb}',
        investor_postal_suburb = '${req.body.postalSuburb}',
        postal_code = '${req.body.postalCode}',                                
        investor_postal_postal_code = '${req.body.postalCode}',                                
        bank_name =  '${req.body.bankName}',
        account_name =  '${req.body.accountName}',
        branch_code = '${req.body.branchCode}',
        account_no = '${req.body.accountNumber}',
        fica_date = '${req.body.ficaDate}' ,             
        person_mode = '${req.body.person_mode}',
        buyers = '${req.body.buyers}',
        linked_email = '${req.body.linkedEmail}'`;


          let additionalSQL = ""
          // investorOneFiles
          let investorOneDisclaimerFileSQL = fileDetails.filter((el) => { return el.fileType === 'investorOneDisclaimerFile' })            
            if (investorOneDisclaimerFileSQL.length > 0) { investorOneDisclaimerFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, investorOneDisclaimerFile = '${el.originalName}'`
                })
          }        
          let investorOneIDFileSQL = fileDetails.filter((el) => {  return el.fileType === 'investorOneIDFile' })  
            if (investorOneIDFileSQL.length > 0) { investorOneIDFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, investorOneIDFile = '${el.originalName}'`
                })
          }        
          let investorOnePOAFileSQL = fileDetails.filter((el) => {  return el.fileType === 'investorOnePOAFile' })  
            if (investorOnePOAFileSQL.length > 0) { investorOnePOAFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, investorOnePOAFile = '${el.originalName}'`
                })
          }

          // investorTwoFiles
          let investorTwoDisclaimerFileSQL = fileDetails.filter((el) => {  return el.fileType === 'investorTwoDisclaimerFile' })  
            if (investorTwoDisclaimerFileSQL.length > 0) { investorTwoDisclaimerFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, investorTwoDisclaimerFile = '${el.originalName}'`
                })
          }
          let investorTwoIdFileSQL = fileDetails.filter((el) => {  return el.fileType === 'investorTwoIDFile' })  
            if (investorTwoIdFileSQL.length > 0) { investorTwoIdFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, investorTwoIdFile = '${el.originalName}'`
                })
          }         
          let investorTwoPOAFileSQL = fileDetails.filter((el) => {  return el.fileType === 'investorTwoPOAFile' })  
            if (investorTwoPOAFileSQL.length > 0) { investorTwoPOAFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, investorTwoPOAFile = '${el.originalName}'`
                })
          }

          // company rep files 
          let representativeDisclaimerFileSQL = fileDetails.filter((el) => {  return el.fileType === 'representativeDisclaimerFile' })  
            if (representativeDisclaimerFileSQL.length > 0) { representativeDisclaimerFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, representativeDisclaimerFile = '${el.originalName}'`
                })
          }
          let representativeIDFileSQL = fileDetails.filter((el) => {  return el.fileType === 'representativeIDFile' })  
            if (representativeIDFileSQL.length > 0) { representativeIDFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, representativeIDFile = '${el.originalName}'`
                })
          }
          let reresentativePOAFileSQL = fileDetails.filter((el) => {  return el.fileType === 'reresentativePOAFile' })  
            if (reresentativePOAFileSQL.length > 0) { reresentativePOAFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, reresentativePOAFile = '${el.originalName}'`
                })
          }

          // company files
          let companyResolutionFileSQL = fileDetails.filter((el) => {  return el.fileType === 'companyResolutionFile' })  
            if (companyResolutionFileSQL.length > 0) { companyResolutionFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, companyResolutionFile = '${el.originalName}'`
                })
          }
          let companyRefDocsFileSQL = fileDetails.filter((el) => {  return el.fileType === 'companyRefDocsFile' })  
            if (companyRefDocsFileSQL.length > 0) { companyRefDocsFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, companyRefDocsFile = '${el.originalName}'`
                })
          }
          let companyPOAFileSQL = fileDetails.filter((el) => {  return el.fileType === 'companyPOAFile' })  
            if (companyPOAFileSQL.length > 0) { companyPOAFileSQL.forEach((el) => {
                additionalSQL = `${additionalSQL}, companyPOAFile = '${el.originalName}'`
                })
          }         

          if(additionalSQL.length) {
            mysql = `${mysql} ${additionalSQL}` 
              + ` WHERE investor_id = '${req.body.id}'; ` 
          } else {
            mysql = `${mysql}` + ` WHERE investor_id = '${req.body.id}'; ` 
          }
              // +  `WHERE id = ${req.body.id}`
        console.log(chalk.yellow("updateInvestor SQL = ",mysql))
        excecuteSQL(mysql, res);
    }),

    // works
    router.post("/createInvestor", upload.array("documents"), (req, res) => {
        console.log(req.body)
        console.log(req.files)

        let fileDetails = renameFile(req)  // return fileDetails 
        //  let fileDetails = [];
        // // file manipulation
        // if (req.files.length) {
        //     let contains = req.body.contains.split(",");
       
        //     contains.forEach((el, index) => {
        //         let mainIndex = index;
        //         if (req.files[mainIndex] !== "undefined" || req.files[mainIndex] !== undefined ) {
        //             console.log("FILES AFTER CHECK::: ", req.files[mainIndex])
        //             let insert = {
        //                 fileType: el,
        //                 //fileName: `${req.files[mainIndex].filename}.${req.files[mainIndex].mimetype.split("/")[1]}`,
        //                 fileName: req.files[mainIndex].filename,
        //                 originalName: req.files[mainIndex].originalname,
        //             };
        //             fileDetails.push(insert);
        //         }
        //     });

        //     console.log("fileDetails", fileDetails);

        //     fileDetails.forEach((el) => {
        //         let filtered = req.files.filter((el2) => {
        //             return el2.filename === el.originalName;
        //         });
        //         el.fileNameUpdated = `${el.fileName}`;
        //         fs.rename(
                    
        //             `public/uploads/${el.fileNameUpdated}`,
        //             `public/uploads/${el.originalName}`,
        //             (err) => {
        //                 if (err) console.log("Error renaming", err);
        //                 //throw err
        //             }
                    
        //         );
        //         console.log("CONNOR:: file renamed from" + `${el.fileNameUpdated}` + " to " + `${el.originalName}`)
        //     });
        // }

        let investorOneDisclaimerFile;
        let investorOneIDFile;
        let investorOnePOAFile;

        let investorTwoDisclaimerFile;
        let investorTwoIDFile;
        let investorTwoPOAFile;

        let representativeDisclaimerFile;
        let representativeIDFile;
        let representativePOAFile;

        let companyResolutionFile;
        let companyRefDocsFile;
        let companyPOAFile;

        if (fileDetails.length) {

            investorOneDisclaimerFile = fileDetails.filter((el) => {
                return el.fileType === "investorOneDisclaimerFile";
            });
            if (investorOneDisclaimerFile.length) {
                investorOneDisclaimerFile = investorOneDisclaimerFile[0].originalName;
            } else {
                investorOneDisclaimerFile = "";
            }

            investorOneIDFile = fileDetails.filter((el) => {
                return el.fileType === "investorOneIDFile";
            });
            if (investorOneIDFile.length) {
                investorOneIDFile = investorOneIDFile[0].originalName;
            } else {
                investorOneIDFile = "";
            }

            investorOnePOAFile = fileDetails.filter((el) => {
                return el.fileType === "investorOnePOAFile";
            });
            if (investorOnePOAFile.length) {
                investorOnePOAFile = investorOnePOAFile[0].originalName;
            } else {
                investorOnePOAFile = "";
            }

            investorTwoDisclaimerFile = fileDetails.filter((el) => {
                return el.fileType === "investorTwoDisclaimerFile";
            });
            if (investorTwoDisclaimerFile.length) {
                investorTwoDisclaimerFile = investorTwoDisclaimerFile[0].originalName;
            } else {
                investorTwoDisclaimerFile = "";
            }

            investorTwoIDFile = fileDetails.filter((el) => {
                return el.fileType === "investorTwoIDFile";
            });
            if (investorTwoIDFile.length) {
                investorTwoIDFile = investorTwoIDFile[0].originalName;
            } else {
                investorTwoIDFile = "";
            }

            investorTwoPOAFile = fileDetails.filter((el) => {
                return el.fileType === "investorTwoPOAFile";
            });
            if (investorTwoPOAFile.length) {
                investorTwoPOAFile = investorTwoPOAFile[0].originalName;
            } else {
                investorTwoPOAFile = "";
            }

            representativeDisclaimerFile = fileDetails.filter((el) => {
                return el.fileType === "representativeDisclaimerFile";
            });
            if (representativeDisclaimerFile.length) {
                representativeDisclaimerFile = representativeDisclaimerFile[0].originalName;
            } else {
                representativeDisclaimerFile = "";
            }

            representativeIDFile = fileDetails.filter((el) => {
                return el.fileType === "representativeIDFile";
            });
            if (representativeIDFile.length) {
                representativeIDFile = representativeIDFile[0].originalName;
            } else {
                representativeIDFile = "";
            }

            representativePOAFile = fileDetails.filter((el) => {
                return el.fileType === "representativePOAFile";
            });
            if (representativePOAFile.length) {
                representativePOAFile = representativePOAFile[0].originalName;
            } else {
                representativePOAFile = "";
            }

            companyResolutionFile = fileDetails.filter((el) => {
                return el.fileType === "companyResolutionFile";
            });
            if (companyResolutionFile.length) {
                companyResolutionFile = companyResolutionFile[0].originalName;
            } else {
                companyResolutionFile = "";
            }

            companyRefDocsFile = fileDetails.filter((el) => {
                return el.fileType === "companyRefDocsFile";
            });
            if (companyRefDocsFile.length) {
                companyRefDocsFile = companyRefDocsFile[0].originalName;
            } else {
                companyRefDocsFile = "";
            }

            companyPOAFile = fileDetails.filter((el) => {
                return el.fileType === "companyPOAFile";
            });
            if (companyPOAFile.length) {
                companyPOAFile = companyPOAFile[0].originalName;
            } else {
                companyPOAFile = "";
            }
        }

            // add the formData names to database fields
        let mysql = `INSERT INTO investors (
            investor_acc_number,
            investor_name,
            investor_surname,
            investor_id_number,
            investor_two_name,
            investor_two_surname,
            investor_two_id_number,
            company_name,
            ref_number,
            company_rep_initals,
            company_rep_surname,
            company_rep_id_number,
            contact_email,
            contact_two_email,
            mobile,
            landline,            
            mobile_two,
            landline_two,   
            street_no,
            street_name,
            address_suburb,
            province,
            address_postal_code,
            box_no,
            postal_suburb,
            postal_code,
            bank_name,
            account_name,
            branch_code,
            account_no,
            fica_date,
            person_mode,
            investorOneDisclaimerFile,
            investorOneIDFile,
            investorOnePOAFile,
            investorTwoDisclaimerFile,
            investorTwoIDFile,
            investorTwoPOAFile,
            representativeDisclaimerFile,
            representativeIDFile,
            representativePOAFile,
            companyResolutionFile,
            companyRefDocsFile,
            companyPOAFile,
            buyers,
            linked_email
            ) VALUES ( 
            '${req.body.investorCode}',
            '${req.body.investorInitials}',
            '${req.body.investorSurname}',
            '${req.body.investorIDNumber}',                            
            '${req.body.investorTwoInitials}',
            '${req.body.investorTwoSurname}',
            '${req.body.investorTwoIDNumber}',
            '${req.body.companyName}',
            '${req.body.regNumber}',
            '${req.body.companyRepInitials}',
            '${req.body.companyRepSurname}',
            '${req.body.companyRepIDNumber}',
            '${req.body.contactEmail}',
            '${req.body.contactTwoEmail}',
            '${req.body.mobile}',
            '${req.body.landline}',
            '${req.body.mobileTwo}',
            '${req.body.landlineTwo}',        
            '${req.body.streetNo}',
            '${req.body.streetName}',
            '${req.body.addressSuburb}',
            '${req.body.province}',
            '${req.body.addressPostalCode}',
            '${req.body.boxNo}',
            '${req.body.postalSuburb}',
            '${req.body.postalCode}',
            '${req.body.bankName}',
            '${req.body.accountName}',
            '${req.body.branchCode}',
            '${req.body.accountNumber}',
            '${req.body.ficaDate}',
            '${req.body.person}',
            '${investorOneDisclaimerFile}', 
            '${investorOneIDFile}', 
            '${investorOnePOAFile}', 
            '${investorTwoDisclaimerFile}', 
            '${investorTwoIDFile}', 
            '${investorTwoPOAFile}', 
            '${representativeDisclaimerFile}', 
            '${representativeIDFile}', 
            '${representativePOAFile}',             
            '${companyResolutionFile}', 
            '${companyRefDocsFile}', 
            '${companyPOAFile}',
            '${req.body.buyers}',
            '${req.body.linkedEmail}'
        )`

        console.log(chalk.blue("createInvestor SQL = ",mysql))
            // + the 'let' file variables
        excecuteSQL(mysql, res)     
    }),

    router.post("/getAllInvestors", (req, res) => {

        let mysql = `select * from investors i`
        excecuteSQL(mysql, res)
       
    }),

    router.post("/getInvestorDetails", (req, res) => {
        console.log(req.body)
        let mysql = `select * from investors i WHERE i.investor_id = ${req.body.paramId}` 
        console.log("GET INVESTOR DEETS SQL = ", mysql)
        excecuteSQL(mysql, res)        
       // console.log("Resposne = ", res)
       
    }),
    // ------------------------------------------------------------------------------------------------
    // Investor App Methods End 
    // ------------------------------------------------------------------------------------------------

    // Test Server Methods
    router.get("/test", (req, res) => {
        res.json({ Awesome: "It Works!!!!!" })
    });

    router.post("/testServer", (req, res) => {
        console.log("completeTransfers req", req.body)
        res.json({ Awesome: "It Works x2 !!!!!" });
    }),


 module.exports = router;