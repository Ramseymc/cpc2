create database capeprojects;

use capeprojects;

create table developments (
    id int auto_increment primary key,
    developmentName varchar(160) not null unique,
    createdAt TIMESTAMP DEFAULT NOW()
);

alter table developments add column startDate TIMESTAMP DEFAULT NOW();
alter table developments add column endDate TIMESTAMP DEFAULT NOW();

update developments set startDate = '2021-01-04 08:00:00';
update developments set endDate = '2022-04-30 17:00:00';



insert into developments (developmentName) values ("Enduleni");

create table subsection (
    id int auto_increment primary key,
    development Int not null,
    subsectionName varchar(160) not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (development) REFERENCES developments(id) 
);

insert into subsection (development, subsectionName) values 

(1,	'Block A'),
(1,	'Block B'),
(1,	'Block C'),
(1,	'Block D'),
(1,	'Block E'),
(1,	'Block F');

create table units (
     id int auto_increment primary key,
    development Int not null,
    subsection Int not null,
    unitName varchar(160) not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (development) REFERENCES developments(id),
    FOREIGN KEY (subsection) REFERENCES subsection(id)
);

insert into units (development, subsection, unitName) values 
(1,	1,	'C101'),
(1,	1,	'C102'),
(1,	1,	'A103'),
(1,	1,	'A104'),
(1,	1,	'A105'),
(1,	1,	'A106'),
(1,	1,	'A107'),
(1,	1,	'A108'),
(1,	1,	'A109'),
(1,	1,	'A201'),
(1,	1,	'A202'),
(1,	1,	'A203'),
(1,	1,	'A204'),
(1,	1,	'A205'),
(1,	1,	'A206'),
(1,	1,	'A207'),
(1,	1,	'A208'),
(1,	1,	'A209'),
(1,	1,	'A301'),
(1,	1,	'A302'),
(1,	1,	'A303'),
(1,	1,	'A304'),
(1,	1,	'A305'),
(1,	1,	'A306'),
(1,	1,	'A307'),
(1,	2,	'B101'),
(1,	2,	'B102'),
(1,	2,	'B103'),
(1,	2,	'B201'),
(1,	2,	'B202'),
(1,	2,	'B203'),
(1,	3,	'C201'),
(1,	3,	'C202'),
(1,	3,	'C301'),
(1,	3,	'C302'),
(1,	4,	'D101'),
(1,	4,	'D102'),
(1,	4,	'D103'),
(1,	4,	'D201'),
(1,	4,	'D202'),
(1,	4,	'D203'),
(1,	4,	'D301'),
(1,	4,	'D302'),
(1,	4,	'D303'),
(1,	5,	'E101'),
(1,	5,	'E102'),
(1,	5,	'E103'),
(1,	5,	'E201'),
(1,	5,	'E202'),
(1,	5,	'E203'),
(1,	5,	'E301'),
(1,	5,	'E302'),
(1,	5,	'E303'),
(1,	6,	'F101'),
(1,	6,	'F102'),
(1,	6,	'F103'),
(1,	6,	'F201'),
(1,	6,	'F202'),
(1,	6,	'F203');

create table taskTypes (
     id int auto_increment primary key,
     taskName varchar(160) not null,
    createdAt TIMESTAMP DEFAULT NOW()
);


alter table taskTypes add column development int  after id;

ALTER TABLE taskTypes
ADD CONSTRAINT fk_taskTypes FOREIGN KEY (development) 
REFERENCES developments (id);

-- update taskTypes set development = 1



insert into taskTypes (taskName) values ('Electrical');

create table tasks (
     id int auto_increment primary key,
     taskType Int not null,
     unitNumber Int not null,
     taskDescription varchar(160) not null,
     cost double default 0,
     quantity double default 0,
     price double AS (cost*quantity),
     fix varchar(100) default "1st",
     duration int not null,
     startDate TIMESTAMP DEFAULT NOW(),
     endDate TIMESTAMP DEFAULT NOW(),
     createdAt TIMESTAMP DEFAULT NOW(),
     FOREIGN KEY (unitNumber) REFERENCES units(id),
    FOREIGN KEY (taskType) REFERENCES taskTypes(id)
);

alter table tasks add column dependencies JSON;

alter table tasks add column development INT after id;

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks FOREIGN KEY (development) 
REFERENCES developments (id);



alter table tasks add column supplier INT after endDate;

ALTER TABLE tasks
ADD CONSTRAINT fk_suppliers FOREIGN KEY (supplier) 
REFERENCES suppliers (id);

-- update tasks set supplier = 1;




create table progress (
    id int auto_increment primary key,
    task int not null,
    unitNumber int not null,
    progress float default 0,
    progressDate TIMESTAMP DEFAULT NOW(),
    updatedBy varchar(160),
    lastUpdate TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (task) REFERENCES tasks(id),
    FOREIGN KEY (unitNumber) REFERENCES units(id)
);




create table userRoles (
    id int auto_increment primary key,
    roleName varchar(160) not null
);

insert into userRoles (roleName) values
("Super User"),
("Project Manager"),
("Site Foreman");


create table users (
    id int auto_increment primary key,
    userName varchar(160) not null unique,
    userEmail varchar(160) not null unique,
    userPassword varchar(160) not null,
    userMobile varchar(160) not null,
    userRole Int not null,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (userRole) REFERENCES userRoles(id)
);

create table suppliers (
    id int auto_increment primary key,
    contactID varchar(160) not null unique,
    vat_number varchar(100),
    supplierName varchar(160) not null unique,
    first_name varchar(150),
    last_name varchar(160),
    emailAddress varchar(160),
    default_number varchar(160),
    mobile_number varchar(160),
    street_address text,
    postal_address text
);

create table xeroCredentials (
    id int auto_increment primary key,
    id_token varchar(5000),
    access_token varchar(5000),
    expires_at int,
    token_type varchar(120),
    refresh_token varchar(5000),
    scope varchar(1000),
    session_state varchar(1000),
    active_tenant varchar(1000)
  );

--   insert into xeroCredentials (id_token) values ('test');

  alter table tasks add column supplier INT after endDate;

ALTER TABLE tasks
ADD CONSTRAINT fk_suppliers FOREIGN KEY (supplier) 
REFERENCES suppliers (id);


create table paymentCertificates (
    id int auto_increment primary key,
    development INT NOT NULL,
    supplier INT NOT NULL,
    certificateNumber Varchar(160) NOT NULL UNIQUE,
    ContractValue FLOAT NOT NULL,
    previousValues FLOAT NOT NULL DEFAULT 0,
    currentValue FLOAT NOT NULL DEFAULT 0,
    grossValue Float not null DEFAULT 0,
    recoveries FLOAT NOT NULL DEFAULT 0,
    penalties FLOAT NOT NULL DEFAULT 0,
    damages FLOAT NOT NULL DEFAULT 0,
    netCurrentCertificateValue Float not null default 0,
    certificateDate TIMESTAMP DEFAULT NOW(),
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (development) REFERENCES developments(id),
    FOREIGN KEY (supplier) REFERENCES suppliers(id)
);

alter table paymentCertificates add column pdfName varchar(160) after certificateDate;
alter table paymentCertificates add column payStatus varchar(160) after pdfName;
alter table paymentCertificates add column invNumber varchar(160) after payStatus;
alter table paymentCertificates add column invoiceNumber varchar(160) after netCurrentCertificateValue;
alter table paymentCertificates add column contents json after invoiceNumber;
alter table paymentCertificates add column amtPaid varchar(160) after invNumber;

alter table progress add column certificateIssued BOOLEAN default false after progressDate;
alter table progress add column lastCertificateIssuedAt float default 0 after certificateIssued;
alter table progress add column lastCertificateNumber varchar(160) after lastCertificateIssuedAt;
alter table progress add column paymentDetails JSON after lastCertificateNumber;


create table paymentCertificatesDetails (
    id int auto_increment primary key,
    progressId INT NOT NULL,
    supplier INT NOT NULL,
    taskDescription varchar(160),
    taskName varchar(160),
    unitName varchar(100),
    price float not null default 0,
    progress int not null,
    toDate float not null default 0,
    certificateNumber Varchar(160) NOT NULL,
    amountPaid float not null default 0,
    invoiceNumber varchar(100),
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (supplier) REFERENCES suppliers(id)
);

alter table paymentCertificatesDetails add column fix varchar(160) after certificateNumber;
alter table paymentCertificatesDetails add column development int after id;
alter table paymentCertificatesDetails add column totalValue float after certificateNumber;

ALTER TABLE paymentCertificatesDetails
ADD CONSTRAINT fk_paymentCertificatesDetails FOREIGN KEY (development) 
REFERENCES developments (id);

alter table suppliers add column retention int default 0;

alter table paymentCertificates add column retained float after damages;

alter table paymentCertificatesDetails add column retained float after toDate;
alter table paymentCertificatesDetails add column afterRetention float after retained;



alter table paymentCertificates add column approvedFinance BOOLEAN default false;
alter table paymentCertificates add column approvedManagement BOOLEAN default false;
alter table paymentCertificates add column declinedManagement BOOLEAN default false;


create table signatures (
    id int auto_increment primary key,
    financeSignature BOOLEAN default false,
    managementSignature BOOLEAN default false,
    signatureDate varchar(10) default "",
    fileDetails text
);

insert into signatures (fileDetails) values ("");



alter table paymentCertificates add column sentToSupplier BOOLEAN default false;



alter table paymentCertificates add column unitName varchar(20) after supplier;

update tasks set supplier = 11
delete from suppliers where id = 10


alter table paymentCertificatesDetails modify price decimal(18,2);
alter table paymentCertificatesDetails modify toDate decimal(18,2);
alter table paymentCertificatesDetails modify retained decimal(18,2);
alter table paymentCertificatesDetails modify afterRetention decimal(18,2);
alter table paymentCertificatesDetails modify totalValue decimal(18,2);
alter table paymentCertificatesDetails modify amountPaid decimal(18,2);


alter table paymentCertificates modify ContractValue decimal(18,2);
alter table paymentCertificates modify previousValues decimal(18,2);
alter table paymentCertificates modify currentValue decimal(18,2);
alter table paymentCertificates modify grossValue decimal(18,2);
alter table paymentCertificates modify recoveries decimal(18,2);
alter table paymentCertificates modify penalties decimal(18,2);
alter table paymentCertificates modify damages decimal(18,2);
alter table paymentCertificates modify retained decimal(18,2);
alter table paymentCertificates modify netCurrentCertificateValue decimal(18,2);
alter table paymentCertificates modify amtPaid decimal(18,2);




alter table paymentCertificatesDetails add column isRetention BOOLEAN default false after invoiceNumber;
alter table paymentCertificates add column isRetention BOOLEAN default false;


create table progressRetention (
    id int auto_increment primary key,
    supplier int not null,
    unitNumber int not null,
    progress float default 0,
    progressDate TIMESTAMP DEFAULT NOW(),
    updatedBy varchar(160),
    lastUpdate TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (supplier) REFERENCES suppliers(id),
    FOREIGN KEY (unitNumber) REFERENCES units(id)
);


alter table progressRetention add column taskType Int not null after supplier;




ALTER TABLE progressRetention
ADD CONSTRAINT fk_taskType FOREIGN KEY (taskType) 
REFERENCES taskTypes (id);

alter table progressRetention add column certificateIssued BOOLEAN default false after progressDate;
alter table progressRetention add column lastCertificateIssuedAt float default 0 after certificateIssued;
alter table progressRetention add column lastCertificateNumber varchar(160) after lastCertificateIssuedAt;
alter table progressRetention add column paymentDetails JSON after lastCertificateNumber;

alter table progressRetention add column development INT after id;
alter table progressRetention add column totalRetention decimal(18,2) default 0;
alter table progressRetention add column retentionToDate decimal(18,2) default 0;





create table jobTitle (
     id int auto_increment primary key,
     jobTitle varchar(160) not null,
      lastUpdate TIMESTAMP DEFAULT NOW()
);

alter table users add column jobTitle INT;

ALTER TABLE users
ADD CONSTRAINT fk_jobTitle FOREIGN KEY (jobTitle) 
REFERENCES jobTitle (id);

 insert into jobTitle (jobTitle) values ('System Manager');
 insert into jobTitle (jobTitle) values ('Project Manager');
 insert into jobTitle (jobTitle) values ('Finance Manager');
 insert into jobTitle (jobTitle) values ('Director');
 insert into jobTitle (jobTitle) values ('Site Staff');
 insert into jobTitle (jobTitle) values ('Admin');

 alter table users add column isActive BOOLEAN default true;
 alter table users add column isNew BOOLEAN default false;


insert into units (development, subsection, unitName) values 
(1,	1,	'A.CArea-0'),
(1,	1,	'A.CArea-1'),
(1,	1,	'A.CArea-2'),
(1,	1,	'A.Substr'),
(1,	1,	'A.SuperStr'),
(1,	2,	'B.CArea-0'),
(1,	2,	'B.CArea-1'),
(1,	2,	'B.Substr'),
(1,	2,	'B.SuperStr'),
(1,	3,	'C.CArea-0'),
(1,	3,	'C.CArea-1'),
(1,	3,	'C.CArea-2'),
(1,	3,	'C.Substr'),
(1,	3,	'C.SuperStr'),
(1,	4,	'D.CArea-0'),
(1,	4,	'D.CArea-1'),
(1,	4,	'D.CArea-2'),
(1,	4,	'D.Substr'),
(1,	4,	'D.SuperStr'),
(1,	5,	'E.CArea-0'),
(1,	5,	'E.CArea-1'),
(1,	5,	'E.CArea-2'),
(1,	5,	'E.Substr'),
(1,	5,	'E.SuperStr'),
(1,	6,	'F.CArea-0'),
(1,	6,	'F.CArea-1'),
(1,	6,	'F.Substr'),
(1,	6,	'F.SuperStr');


SUPPLIERS

alter table paymentCertificates add column depositPaid decimal(18,2) default 0.00;
alter table paymentCertificates add column depositRecovered decimal(18,2) default 0.00;
alter table paymentCertificates add column depositRemaining decimal(18,2) default 0.00;
alter table paymentCertificates add column dateDepositProcessed TIMESTAMP DEFAULT NOW();


create table depositsMade (
      id int auto_increment primary key,
    supplier int not null,
    depositPaid decimal(18,2) default 0.0,
    depositRecovered decimal(18,2) default 0.00,
    depositRemaining decimal(18,2) default 0.00,
    dateDepositProcessed TIMESTAMP DEFAULT NOW(),
    certificateNumber varchar(160),
    FOREIGN KEY (certificateNumber) REFERENCES paymentCertificates(certificateNumber),
    FOREIGN KEY (supplier) REFERENCES suppliers(id)
);

alter table depositsMade add column development int;

alter table paymentCertificates add column depositRecoveredThisStatement decimal(18,2) default 0.00;

create table stockItems (
    id int auto_increment primary key,
    itemDescription varchar(160) not null,
    quantity  decimal(18,2) default 0.00,
    unitDescription varchar(50),
    unitCost decimal(18,2) default 0.00,
    totalCost decimal(18,2) default 0.00,
    vat decimal(18,2) default 0.00,
    nettCost decimal(18,2) default 0.00,
    createdAt TIMESTAMP DEFAULT NOW()
 );

 insert into stockItems (itemDescription, quantity, unitCost, totalCost, vat, nettCost) values
 ("ADD002 - Petrol Sub pump",0,452.18,0,0,0),
("ADD003 - 27kg Breaker (incl. chisel)",0,373.91,0,0,0),
("CAR001 - Fitment of internal door and ironmongery",0,67.62,0,0,0),
("CAR013 - 69mm SA Pine Skirting 3m length",0,44,0,0,0),
("CAR015 - Two lever door lock",0,45.48,0,0,0),
("CAR016 - Three lever door lock",0,78,0,0,0),
("CAR017 - Interior door handles",0,87,0,0,0),
("CAR019 - Cozy rail with fixings",0,255.68,0,0,0),
("CAR020 - Timber garden gate",0,706.94,0,0,0),
("CAR021 - QS 100 x 75mm SS 2mm light duty butt hin",0,66.3,0,0,0),
("CAR022 - Umea Coupe Stainless Steel Handles",0,87,0,0,0),
("CAR120 - Woodfiller White",0,20.22,0,0,0),
("CEI015 - 135mm Thick Isotherm ceil insul (1.2x5m)",0,358,0,0,0),
("CEI018 - Highcover",0,474.62,0,0,0),
("CEI500 - Ceiling - Labour",0,5361.74,0,0,0),
("CONS001 - Southwark Consumables/Pierre",0,521.56,0,0,0),
("DOR001 - Hollow core interior door - flat (813 x",0,202.5,0,0,0),
("DOR004 - Solid Exterior Door - striated (813 x 20",0,1679.7,0,0,0),
("DOR015 - Firedoor Hardboard 813 x 2032mm",0,700,0,0,0),
("DOR116 - Auto Door closer firedoor",0,495,0,0,0),
("ELE002 - Double RSA Plug",0,45,0,0,0),
("ELE003 - Distribution Board - Residential",0,305.25,0,0,0),
("ELE009 - External waterproof light",0,293,0,0,0),
("ELE012 - Isolator - 60A",0,175,0,0,0),
("ELE016 - Single lever switch",0,44.9,0,0,0),
("ELE017 - 2 Lever switch",0,45.54,0,0,0),
("ELE018 - 3 Lever switch",0,62.65,0,0,0),
("ELE021 - Waterproof swith point",0,0,0,0,0),
("ELE022 - Braai light",0,167.57,0,0,0),
("ELE023 - Geyser Isolator",0,135,0,0,0),
("ELE025 - 20mm Ø Conduit",0,0,0,0,0),
("ELE055 - Braai light",0,185.88,0,0,0),
("ELE069 - Extractor Fan",0,297.1,0,0,0),
("ELE070 - Double Florescent light fitting",0,219.11,0,0,0),
("ELE071 - Globes",0,31.87,0,0,0),
("ELE072 - Ceiling Light Fitting",0,146.76,0,0,0),
("ELE073 - Ceiling Light Fitting for bathroom",0,148.43,0,0,0),
("ELE074 - External Wall mount light fitting",0,305.7,0,0,0),
("ELE075 - Call out Fee",0,380,0,0,0),
("ELE077 - Flourescent - Bulb/Globe",0,27.36,0,0,0),
("ELE088 - 120mm tube light LED",0,106.26,0,0,0),
("ELE100 - Motion Sensor 180",0,195,0,0,0),
("ELE101 - Motion Sensor 360",0,245,0,0,0),
("ELE102 - 2.5mm Twin and earth",0,12.74,0,0,0),
("ELE103 - 16mm x 16mm trunking",0,8.75,0,0,0),
("ELE104 - Electrical labour",0,556.25,0,0,0),
("ELE105 - 4mm twin and earth cable",0,11.5,0,0,0),
("ELE106 - 4x4 Wallbox",0,19.5,0,0,0),
("ELE108 - Dual socklet wall outlet",0,55,0,0,0),
("ELE110 - Electrical consumables",0,59.78,0,0,0),
("ELE112 - Electrical wonder box 4x2",0,22.1,0,0,0),
("ELE113 - 20Amp circuit Breaker",0,74.25,0,0,0),
("ELE500 - Electrical - Labour",0,3499.59,0,0,0),
("EXT001 - Walling - Vibracrete walls Precast",0,47.14,0,0,0),
("EXT006 - Vibrecrete Slabs 1500mm",0,49.1,0,0,0),
("EXT007 - Poles 2.4m",0,121.22,0,0,0),
("EXT015 - T Hinge for garden gates",0,44,0,0,0),
("EXT016 - Vibracrete 2300m Post / Pole",0,96.78,0,0,0),
("EXT017 - Padbolt 150mm Galvanised",0,29.2,0,0,0),
("FLO002 - Laminate Flooring",0,4214.01,0,0,0),
("FLO004 - Coloured / Stained and sealed screed",0,221.28,0,0,0),
("GAR001 - Garage door call out",0,650,0,0,0),
("GAT001 - Gate Latch Galv 75mm",0,19.63,0,0,0),
("GLA003 - Shower panel",0,8760.18,0,0,0),
("GLA005 - Frosting to Glass",0,1001.6,0,0,0),
("GLA015 - Repair to shower panels",0,91,0,0,0),
("HOU001 - Cleaning of unit",0,269.11,0,0,0),
("JOI001 - Kitchen cupboards",0,35910.75,0,0,0),
("JOI002 - Kitchen postform top",0,3700,0,0,0),
("JOI004 - Fitment of granite countertop",0,8600,0,0,0),
("JOI007 - Bedroom cupboards",0,8283.33,0,0,0),
("JOI012 - Fridge Panel 1850mm x 600mm x 650mm",0,0,0,0,0),
("JOI013 - Kitchen Top Granite",0,0,0,0,0),
("KIT001 - Supply and fit stove",0,5297,0,0,0),
("KIT004 - Supply and fit wood braai",0,804.35,0,0,0),
("KIT005 - Supply Stove & Cookerhood",0,4448,0,0,0),
("LAB001 - General Labourer",0,911.77,0,0,0),
("LAB002 - Plasterer",0,591.27,0,0,0),
("LAB003 - Tiler",0,2259.72,0,0,0),
("LAB005 - Carpenter",0,1923.92,0,0,0),
("LAB008 - Waterproofing labour",0,672.05,0,0,0),
("LAB009 - Structural Labour",0,1532.67,0,0,0),
("LAN001 - Purchase of compost",0,21.74,0,0,0),
("LAN003 - Purchase of plants",0,678.3,0,0,0),
("LAN005 - Purchase of sod grass per m²",0,35,0,0,0),
("LAN006 - Purchase of tree",0,9615,0,0,0),
("LAN009 - Purchase of compost",0,21.74,0,0,0),
("LAN010 - Kikuyu Lawn m2",0,30.43,0,0,0),
("LAN020 - Tree Survey",0,2348,0,0,0),
("MET001 - Supply and fit of balustrades",0,4129.2,0,0,0),
("MET008 - Supply of gate",0,1030,0,0,0),
("NAI001 - Nail in Anchor 8x100",0,2,0,0,0),
("PAI002 - Plaster primer",0,694.78,0,0,0),
("PAI005 - Final coat",0,749.67,0,0,0),
("PAI007 - Fill coat on Ceiling",0,529.42,0,0,0),
("PAI008 - Interiror - Final Coat on Ceiling",0,497.45,0,0,0),
("PAI009 - Timber primer on timber",0,184.19,0,0,0),
("PAI019 - Plaster primer",0,291.58,0,0,0),
("PAI036 - Wateproofing paint",0,254.35,0,0,0),
("PAI040 - matt enamel paint",0,396.19,0,0,0),
("PAI043 - sandpaper - 80 grit",0,13.27,0,0,0),
("PAI044 - sandpaper - 100 grit",0,14.49,0,0,0),
("PAI046 - 230mm Classic Roller Refill",0,41.08,0,0,0),
("PAI047 - Painters Mate",0,22.77,0,0,0),
("PAI048 - Roller - Ceiling",0,34.82,0,0,0),
("PAI049 - Crack Filler",0,109.48,0,0,0),
("PAI050 - Spachtel tool Set",0,30.84,0,0,0),
("PAI051 - 75mm Utility P/Brush",0,58.98,0,0,0),
("PAI052 - Caulking Gun",0,68.28,0,0,0),
("PAI053 - Acrylic Sealant per tube Soudal",0,21.64,0,0,0),
("PAI054 - Woodprimer White 5L",0,279.31,0,0,0),
("PAI055 - Satin Non-drip Acrylic White 5L",0,396.19,0,0,0),
("PAI056 - Masonry Primer 20L",0,808.42,0,0,0),
("PAI057 - SuperCover 20L Southwark Inside TP793-HK",0,696.41,0,0,0),
("PAI058 - Silicone Sealant per tube While",0,47.94,0,0,0),
("PAI059 - Thinners 5 Lt",0,131.17,0,0,0),
("PAI060 - Sabre Shield 5lt Pastel Colour",0,478.8,0,0,0),
("PAI061 - Premium Universal Undercoat 1Lt",0,173.77,0,0,0),
("PAI062 - 15mm Brush",0,45,0,0,0),
("PAI063 - Masking Tape",0,11.01,0,0,0),
("PAI064 - 100mm Paint Brush",0,78.2,0,0,0),
("PAI065 - Bitumen Primer",0,199,0,0,0),
("PAI066 - Block Brush",0,139.6,0,0,0),
("PAI067 - Wall Paint Colour - 20lt",0,748.6,0,0,0),
("PAI068 - White Silicone",0,54.76,0,0,0),
("PAI070 - External Paint 5Lt - Dark grey",0,688.9,0,0,0),
("PAI071 - External Paint 5Lt - Light grey",0,758.93,0,0,0),
("PAI072 - Flexiguard",0,305.9,0,0,0),
("PAI073 - Spririts of Salts",0,85.3,0,0,0),
("PAI074 - Paint Rollers",0,53.08,0,0,0),
("PAI075 - Pollyfilla 10kg bag",0,147.48,0,0,0),
("PAI076 - 50mm Utility P/Brush",0,32.66,0,0,0),
("PAI077 - Skirting Paint",0,396.19,0,0,0),
("PAI078 - Dropsheet",0,32.63,0,0,0),
("PAI079 - Sabre Skim - 5Lt",0,128.38,0,0,0),
("PAI080 - Sabre Skim 20L",0,382.14,0,0,0),
("PAI082 - Turpentine 5L",0,107,0,0,0),
("PAI085 - Polyester Membrane per m",0,7.25,0,0,0),
("PAI090 - Soudaflex FC40 White 330ml",0,80.94,0,0,0),
("PAI091 - Sabre Hi-Cover 20 litre white",0,474.62,0,0,0),
("PAI105 - Sabre Masonry Primer 5 litre",0,223.8,0,0,0),
("PAI500 - Painting Labour",0,2378.8,0,0,0),
("PLA015 - Rhino lite plaster",0,291.58,0,0,0),
("PLA016 - Cretestone Plaster 40kg",0,243,0,0,0),
("PLU014 - 40mm Ø piping",0,0,0,0,0),
("PLU016 - 15mm Ø piping",0,78,0,0,0),
("PLU064 - Toilet angle valve (15mm)",0,69.52,0,0,0),
("PLU065 - Angle Valve (22mm)",0,67.33,0,0,0),
("PLU066 - 300mm braided hose",0,25.5,0,0,0),
("PLU067 - 350mm braided hose",0,25.5,0,0,0),
("PLU072 - 1700mm bath",0,900,0,0,0),
("PLU073 - Double bowl sink",0,885,0,0,0),
("PLU075 - Sink mixer",0,368.75,0,0,0),
("PLU076 - Hand wash basin",0,500,0,0,0),
("PLU077 - Basin mixer",0,364.74,0,0,0),
("PLU079 - Shower mixer",0,350,0,0,0),
("PLU080 - Shower P trap",0,188.33,0,0,0),
("PLU081 - Shower waste",0,133.89,0,0,0),
("PLU082 - Sink P trap",0,103.74,0,0,0),
("PLU083 - Sink waste",0,78.18,0,0,0),
("PLU085 - Bath Trap",0,96.83,0,0,0),
("PLU086 - Bath spout",0,65,0,0,0),
("PLU087 - Bath Nikki spout",0,294.44,0,0,0),
("PLU092 - Fitment of bath complete",0,900,0,0,0),
("PLU093 - Fitment of shower complete",0,5328.83,0,0,0),
("PLU099 - Fitment of garden bib tap",0,107.75,0,0,0),
("PLU100 - CoC per unit",0,650,0,0,0),
("PLU102 - Solar Waterheating CoC",0,650,0,0,0),
("PLU109 - 80mm dia PVC Dowinpipe 3m",0,70,0,0,0),
("PLU110 - 800mm dia coupling socket",0,12,0,0,0),
("PLU111 - 110mm x 6m UG Beige Pipe",0,180,0,0,0),
("PLU112 - 110mm x 45 deg PVG UG Plain Ribbed Junct",0,60,0,0,0),
("PLU113 - 110mm  x 90deg PVC UG Plain Ribbed Bend",0,40,0,0,0),
("PLU114 - 110mm PVC UG Coupling Socket single",0,22,0,0,0),
("PLU150 - Vanity",0,624.96,0,0,0),
("PLU151 - Toilet Roll Holder Unit",0,95,0,0,0),
("PLU152 - Towel Rail Unit",0,184,0,0,0),
("PLU153 - Toilet (Complete unit)",0,396.14,0,0,0),
("PLU154 - Basin Waste",0,77.27,0,0,0),
("PLU155 - Basin Trap",0,38,0,0,0),
("PLU156 - Shower Rose",0,90,0,0,0),
("PLU157 - Double bowl sink trap",0,68.83,0,0,0),
("PLU158 - Shower arm",0,45,0,0,0),
("PLU160 - Bath Clicker",0,64.33,0,0,0),
("PLU161 - Solar Geyser Complete - Supply&Install",0,16815.2,0,0,0),
("PLU162 - Giraffe OverFlow+CP Rosette",0,45,0,0,0),
("PLU163 - Bath Mixer",0,350,0,0,0),
("PLU164 - Antifungal Silicone Clear",0,15,0,0,0),
("PLU201 - Bath resurface / repair",0,1800,0,0,0),
("PLU500 - Plumbing Labour",0,4914.04,0,0,0),
("PRE001 - Rental of Site Toilet",0,770.94,0,0,0),
("PRE002 - Rental of Plant & Tooling",0,740.35,0,0,0),
("PRE010 - Aluminium Step Ladder 2m",0,1038.32,0,0,0),
("PRE011 - 20m Extension Lead for Site use",0,65,0,0,0),
("PRE012 - Broom - Household clean",0,247,0,0,0),
("PRE013 - Sump Pump",0,693.48,0,0,0),
("PRE014 - Dehumidifier",0,1173.91,0,0,0),
("PRE015 - Post Box",0,173.91,0,0,0),
("PRE016 - Concrete Nails",0,52,0,0,0),
("PRE017 - Cordless Drill",0,956.52,0,0,0),
("PRE018 - Cordless Grinder 115mm",0,313.05,0,0,0),
("PRE020 - 10kg Chipper",0,243.48,0,0,0),
("PRE021 - Chisel Chipper Flat",0,26.09,0,0,0),
("PRE022 - Chisel Chipper Point",0,21.76,0,0,0),
("PRE023 - CCTV - Repairs",0,3700,0,0,0),
("PRE027 - Carpet Knife Blades",0,23,0,0,0),
("PRE032 - Chemical Anchoring Mortar 300ml",0,136,0,0,0),
("PRE056 - Rags for cleaning",0,82,0,0,0),
("PRE059 - Weather Strip",0,110,0,0,0),
("PRE062 - Utility Knife",0,69,0,0,0),
("PRE064 - GAS BLOW TORCH - AUTO INGINTION",0,218.5,0,0,0),
("PRE065 - GAS CANISTER 190g",0,29,0,0,0),
("PRE066 - Spirits of Salts",0,35,0,0,0),
("PRE067 - Latex Gloves Large",0,10,0,0,0),
("PRE068 - 230mm Grinder Blade - Diamond",0,114,0,0,0),
("PRE57 - Soft Brooms",0,60,0,0,0),
("PRE999 - Rounding Difference",0,0.05,0,0,0),
("ROF002 - Geyser supports",0,139.4,0,0,0),
("ROF018 - Kliptite PV Brackets Slotted",0,75,0,0,0),
("RUB001 - Receptacle - 2m² Bin",0,448.06,0,0,0),
("SIT500 - Site Establishment - Labour Cost",0,213.9,0,0,0),
("SUT600 - Site Labour - Foreman",0,702.93,0,0,0),
("TIL012 - London Grey Tiles 600 x 600",0,145.7,0,0,0),
("TIL013 - Confu White Tiles 600 x 600",0,194.4,0,0,0),
("TIL014 - Tile Cement 20 KG",0,71.62,0,0,0),
("TIL015 - Light Grey Grout 5 KG",0,136.65,0,0,0),
("TIL016 - Tile Adhesive",0,78.88,0,0,0),
("TIL017 - Corfu Grey tiles 600x600",0,194.81,0,0,0),
("TIL018 - Nomad Beige tiles 600 x 600",0,160.68,0,0,0),
("TIL019 - 12mm aluminium straight edge-natural",0,37.9,0,0,0),
("TIL020 - 3mm - Tile Spacer",0,18.46,0,0,0),
("TIL021 - 5mm Tile Spacer",0,18.46,0,0,0),
("TIL022 - Tile trim",0,46.93,0,0,0),
("TIL150 - Tile cleaner 5 litre",0,255,0,0,0),
("WAT013 - Roofseal rubberised bituemn 20litre",0,605,0,0,0),
("WAT101 - Waterproofing to Parapets (RC)",0,3000,0,0,0),
("WET035 - 14MPa Maxi brick",0,1.97,0,0,0),
("WET047 - Cement 32.5 N bag",0,66.8,0,0,0),
("WET049 - Building Sand",0,95.24,0,0,0),
("WET051 - Bonding Agent",0,100,0,0,0),
("WET053 - Imported clean sandfill",0,920,0,0,0),
("WET057 - Builders Lime 20kg bag",0,281,0,0,0),
("WET058 - Plaster sand",0,1300,0,0,0),
("WET059 - Permobomd 5 lt",0,288,0,0,0),
("WIN007 - Glass panel for front door",0,1015.63,0,0,0),
("WPR008 - Latex paint - thick film to cover waterp",0,40,0,0,0),
("WPR009 - Aluminium paint over waterproofing",0,379.71,0,0,0),
("WPR011 - Uni-Flash (350mm x 15m)",0,893.04,0,0,0),
("WPR012 - Hydroflex Liquid (4.8kg)",0,375.96,0,0,0),
("WPR013 - Hydroflex Powder (10.2kg)",0,114.51,0,0,0),
("WPR014 - Primer D 5L",0,571.3,0,0,0),
("WPR015 - Polypropylene 30grm (800",0,43.06,0,0,0),
("WPR016 - Pipe entry waterproofing (Orbit - Solar",0,1200,0,0,0),
("WPR017 - Roofcote Aluminium 5L",0,376.06,0,0,0),
("WPR018 - Weephole Covers",0,3.59,0,0,0),
("WPR019 - Soudaflex Tube 310ml",0,80.94,0,0,0),
("WPR020 - 1kg Sika Cemflex waterproofing",0,151.38,0,0,0),
("WPR021 - Alco-Flex Polyurethane Adhesive & Sealan",0,81.66,0,0,0),
("WPR022 - Aluminium Angles",0,214,0,0,0),
("WPR21 - Heavy Duty Silicone Gun",0,172.09,0,0,0),
("WPR22 - 25m Waterproofing Membrane",0,119,0,0,0),
("WRP023 - Cemflex 10L",0,722,0,0,0);

create table purchaseOrders (
    id int auto_increment primary key,
    PONumber    varchar(15) not null,
    development int not null,
    supplier int not null,
    reference varchar(160) not null,
    deliveryDate TIMESTAMP DEFAult now(),
     itemDescription varchar(160) not null,
    quantity  decimal(18,2) default 0.00,
    unitDescription varchar(50),
    unitCost decimal(18,2) default 0.00,
    totalCost decimal(18,2) default 0.00,
    vat decimal(18,2) default 0.00,
    nettCost decimal(18,2) default 0.00,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (supplier) REFERENCES suppliers(id),
    FOREIGN KEY (development) REFERENCES developments(id)
);

alter table purchaseOrders add column subsection int after development;
alter table purchaseOrders add column unitNumber int after subsection;
alter table purchaseOrders add column fulfilled BOOLEAN default false;

ALTER TABLE purchaseOrders
ADD CONSTRAINT fk_subsection FOREIGN KEY (subsection) 
REFERENCES subsection (id);

ALTER TABLE purchaseOrders
ADD CONSTRAINT fk_unit FOREIGN KEY (unitNumber) 
REFERENCES units (id);

alter table purchaseOrders add column delivered decimal(18,2) default 0.00;


alter table purchaseOrders add column xeroStatus varchar(80);
alter table purchaseOrders add column invoiceNumber varchar(20) ;
alter table purchaseOrders add column invoiceAmount decimal(18,2) default 0.00; 

create table deliveries (
    id int auto_increment primary key,
    PONumber    varchar(15) not null,
    purchaseNumber Int not null,
    development int not null,
    supplier int not null,
    expectedDeliveryDate TIMESTAMP DEFAult now(),
    quantityExpected decimal(18,2) default 0.00,
    quantityDelivered decimal(18,2) default 0.00,
     actualDeliveryDate TIMESTAMP DEFAult now(),
     enteredBy varchar(160),
     FOREIGN KEY (supplier) REFERENCES suppliers(id),
     FOREIGN KEY (purchaseNumber) REFERENCES purchaseOrders(id),
    FOREIGN KEY (development) REFERENCES developments(id)
);



 alter table purchaseOrders add column sentToSupplier BOOLEAN default false; 

 alter table purchaseOrders add column approvedFinance BOOLEAN default false;
alter table purchaseOrders add column approvedManagement BOOLEAN default false;



create table vatRates (
    id int auto_increment primary key,
    rate decimal (6,2) default 15.00,
    effectiveFrom  TIMESTAMP DEFAult now(),
    created TIMESTAMP DEFAult now() 
);

insert into vatRates (effectiveFrom) values ('2018-04-01');

alter table paymentCertificates add column invDate varchar(160) after invNumber;
alter table purchaseOrders add column invoiceDate varchar(20);
alter table paymentCertificatesDetails add column invoiceDate varchar(20);

alter table suppliers add column vatVendor BOOLEAN default true;
alter table suppliers add column terms int default 1;

create table terms (
    id int auto_increment primary key,
    temNumber Int not null,
    terms varchar(100),
    created TIMESTAMP DEFAult now()    
);

insert into terms (temNumber, terms) values 
(1, "30 from Statement"),
(2, "14 from Invoice"),
(3, "COD"),
(4, "Weekly");

 

create table siteImages (
    id int auto_increment primary key,
    blockName varchar(100),
    unitName varchar(100),
    comments varchar(260),
    secure_url varchar(160),
    publicId varchar(100) 
 );

 alter table siteImages add column development int after id;
 alter table siteImages add column createdAt TIMESTAMP DEFAult now();
 alter table siteImages add column uploadedBy varchar(160);


create table qcquestionnaireTemplate (
    id int auto_increment primary key,
    shortName varchar(160) not null,
    name text not null,
    category varchar(255) not null,
    comments text,
    constructionManager BOOLEAN default false,
    subcontractor BOOLEAN default false,
    siteforeman BOOLEAN default false,
    created TIMESTAMP DEFAult now()
);

insert into qcquestionnaireTemplate (shortName, category, name) values
("balustrades","Handrails and balustrades","Latest drawing revision used? Revision used?"),
("balustrades","Handrails and balustrades","Approved materials? Correct sizes and fasteners?"),
("balustrades","Handrails and balustrades","Approved materials? Graded correctly?"),
("balustrades","Fixing","Is the fastening / fixing line correct? As per Architect / Engineer?"),
("balustrades","Fixing","Is the fastening / fixing level correct? As per Architect / Engineer?"),
("balustrades","Fixing","Is all material affixed correctly? True and plumb?"),
("balustrades","Joints","Slip joint placed properly? Neatened?"),
("balustrades","Joints","Welded connections cleaned and painted with anti-corrosive paint?"),
("balustrades","Joints","Are all joints that need polishing done properly?"),
("balustrades","Joints","Is the installation clean?"),
("balustrades","Joints","Where fasteners were placed is the plaster and paint still proper?"),
("balustrades","Surface finish","Is the surface finish correct?"),
("balustrades","Surface finish","Has the surface finish preparation been done correctly?"),
("electrical","Power on distribution board","DB correctly installed (position per drawing) true and square? Cover installed properly? All screws fitted?"),
("electrical","Power on distribution board","All circuit breakers installed properly? No copper from conductors visible behind circuit breaker?"),
("electrical","Power on distribution board","Earth leakage installed? Tested?"),
("electrical","Power on distribution board","Whole distribution board labelled correctly with a complete legend? Is the legend visible?"),
("electrical","Power on distribution board","Pre-paid meter and relay position blanked off? Draw wire installed?"),
("electrical","Meter Box / Telephone DB","Correctly positioned and installed? Tested wrt app?"),
("electrical","Meter Box / Telephone DB","True and square fitment of outlet / cover?"),
("electrical","Meter Box / Telephone DB","Fitted with lid and cover? No cracks no paint left on it?"),
("electrical","Meter Box / Telephone DB","All draw wires installed?"),
("electrical","Meter Box / Telephone DB","All telco / data / TV outlets blanks fitted?"),
("electrical","Fittings","All light fittings correctly installed? True and square? Did the siteforeman accept this?"),
("electrical","Fittings","All light switches correctly? True and square"),
("electrical","Fittings","All light bulbs installed? Tested? Do they all work? No shimmer?"),
("electrical","Fittings","All plug points fitted where required? True and square?"),
("electrical","Fittings","All telco / data and TV blanks covers fitted where required?"),
("electrical","Fittings","All lights in working order?"),
("electrical","Fittings","All plug points in working order?"),
("timberIron","Door Frame","Positioning of frame on site as per drawing?"),
("timberIron","Door Frame","Hinges - Correct swing (L-H or R-H) quantity correct?"),
("timberIron","Door Frame","Frame built in plumb and square?"),
("timberIron","Door Frame","Frame to correct height as per F.F.L ?"),
("timberIron","Door Frame","Has frame been braced to brickwork?"),
("timberIron","Door Frame","Have voids behind frame and brickwork been caulked with mortar? (Not hollow)"),
("timberIron","Door leaf","Door type per schedule?"),
("timberIron","Door leaf","Door - Square Plumb and margins?"),
("timberIron","Door leaf","Door bevelled on lock side?"),
("timberIron","Door leaf","Blocking (for locks coat hooks etc.)"),
("timberIron","Door leaf","Joint by rebates on double doors even?"),
("timberIron","Door leaf","Planed edges sanded prior to painting?"),
("timberIron","Door leaf","Even gaps between frame and door?"),
("timberIron","Ironmongery","Old ironmongery removed if previosuly fitted?"),
("timberIron","Ironmongery","Door level adjustment done?"),
("timberIron","Ironmongery","Installation of new ironmongery?"),
("timberIron","Ironmongery","Fitted square plumb and straight?"),
("timberIron","Ironmongery","Lock is flush with the door?"),
("timberIron","Ironmongery","Door closer - Patent screws used?"),
("timberIron","Fittings","Louvres specified? Correct dimensions?"),
("timberIron","Ironmongery","Kick plates specified? Correct width and height?"),
("timberIron","Ironmongery","Changing swing of doors?"),
("glazing","Glazing","Glazing as per specification document? Has the window and door schedule been consulted?"),
("glazing","Glazing","Materials used approved?"),
("glazing","Glazing","Glazing installed complete?"),
("glazing","Glazing","Glazing secure?"),
("glazing","Glazing","Clean?"),
("glazing","Glazing","Etching correctly applied?"),
("glazing","Glazing","All glazing edges safe?"),
("glazing","Glazing","Glazing certificate issued?"),
("glazing","Glazing","All ironmongery / fasteners without blemish?"),
("glazing","Glazing","All ironmongery and fasteners fitted correctly?"),
("glazing","Glazing","Has the type of glass been confirmed independently?"),
("structuralSteel","Documentation","Quality control plan implemented?"),
("structuralSteel","Documentation","Welding qualification certificates seen and confirmed?"),
("structuralSteel","Shop detail drawings","Material ordering done properly and material type checked against engineer specification?"),
("structuralSteel","Shop detail drawings","Test certificates - Steel?"),
("structuralSteel","Shop detail drawings","Test certificates - Welding?"),
("structuralSteel","Shop detail drawings","Test certificates - Anti-corrosion applications / systems?"),
("structuralSteel","Shop detail drawings","Test certificates - Rust proofing systems?"),
("structuralSteel","Shop detail drawings","Test certificates - Paint and surface finishes?"),
("structuralSteel","Surface Finish","Has the surface finish been placed over the whole surface? All corners and holes?"),
("structuralSteel","Surface Finish","Has the galvanising if any been approved?"),
("structuralSteel","Compliance","Has the engineer accepted the shop drawings?"),
("structuralSteel","Compliance","Has the engineer received photos and commented on these? Approved them?");


create table qcquestionnaireDone (
    id int auto_increment primary key,
    development int not null,
    section varchar(255) not null,
    unit varchar(160) not null,
    controlDate varchar(160) not null,
    controlTimestamp varchar(255) not null,
    shortName varchar(160) not null,
    name text not null,
    category varchar(255) not null,
    comments text,
    constructionManager BOOLEAN default false,
    subcontractor BOOLEAN default false,
    siteforeman BOOLEAN default false,
    signedConstructionManager BOOLEAN default false,
    signedSubcontractor BOOLEAN default false,
    signedSiteforeman BOOLEAN default false,
    created TIMESTAMP DEFAult now()
);


 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$




insert into qcquestionnaireTemplate (shortName, category, name) values
 ("Specialised Wall Coating","Pre-application","Is mix design approved? SABS / ISO approved materials?"),
("Specialised Wall Coating","Pre-application","Is all overhead and adjoining work complete?"),
("Specialised Wall Coating","Pre-application","Is the scaffolding correct distance from the wall? (stone 400mm, Plaster 250mm)"),
("Specialised Wall Coating","Pre-application","Is scaffolding fully boarded & staged at 2m height intervals?"),
("Specialised Wall Coating","Pre-application","Is the plaster finish acceptable to receive Marmoran / Gamma Zenith etc?"),
("Specialised Wall Coating","Pre-application","Have all pipes, windows & doorframes been built in & finished off smoothly?"),
("Specialised Wall Coating","Pre-application","Have tops of parapets and window cills been waterproofed?"),
("Specialised Wall Coating","Pre-application","Have expansion joints and windows been sealed neatly with polysulphide?"),
("Specialised Wall Coating","Pre-application","Do the applicators have the correct tools / safety equipment? Everything in place?"),
("Specialised Wall Coating","Pre-application","Have the correct marked up drawings been given to the applicators?"),
("Specialised Wall Coating","Post - application","Correct primer used?"),
("Specialised Wall Coating","Post - application","Has the correct striation pattern been used (Plaster application)"),
("Specialised Wall Coating","Post - application","Has the stonework covered the area sufficiently? Are the stonechips evenely spread?"),
("Specialised Wall Coating","Post - application","Are the corners neatly squared or rounded and well covered"),
("Specialised Wall Coating","Post - application","Are the junctions / corners of walls / soffits, walls / doors & window frames neat?"),
("Specialised Wall Coating","Post - application","Are the joints lines horizontal and vertical?"),
("Specialised Wall Coating","Post - application","Has all masking tape & paper been removed?"),
("Specialised Wall Coating","Post - application","Has glazing been applied (if required)?"),
("Specialised Wall Coating","Post - application","Is the work area clean on completion?"),
("Roller Shutter Doors","Roller shutter doors","Barrel assembly inspected and correct? As per drawing?"),
("Roller Shutter Doors","Roller shutter doors","Spring cover tight and no risk of loosening?"),
("Roller Shutter Doors","Roller shutter doors","Side guides galvanized and lubricated?"),
("Roller Shutter Doors","Roller shutter doors","Slats galvanized / covered with anti-corrosion finishes?"),
("Roller Shutter Doors","Roller shutter doors","T-Bar installed - Rubber seal too?"),
("Roller Shutter Doors","Roller shutter doors","Chain - pre-galvanized and lubricated?"),
("Roller Shutter Doors","Roller shutter doors","Lug assembly covered with anti-corrosion finish and lubricated?"),
("Roller Shutter Doors","Roller shutter doors","Additional items confirmed and checked?"),
("Roller Shutter Doors","Roller shutter doors","Winding gear working and lubricated?"),
("Roller Shutter Doors","Roller shutter doors","1/3 Phase motor tested and sealed properly?"),
("Roller Shutter Doors","Roller shutter doors","Correct motor specification used?"),
("Roller Shutter Doors","Roller shutter doors","Testing complete? Installer and electricians?"),
("Roller Shutter Doors","Roller shutter doors","Override lock - operational and tested?"),
("Roller Shutter Doors","Roller shutter doors","Override lock - Neatly finished?"),
("Roller Shutter Doors","Roller shutter doors","Steel frame works and affixed / fastened properly?"),
("Roller Shutter Doors","Roller shutter doors","Key switch level and functioning?"),
("Final Ceiling Closure","Plumbing:","Are all hangers support installed correctly?"),
("Final Ceiling Closure","Plumbing:","Piping complete and all joints checked?"),
("Final Ceiling Closure","Plumbing:","All valves fitted correctly?"),
("Final Ceiling Closure","Plumbing:","Hydro testing performed and certificates signed off? Has the system been under pressure for 72 hours?"),
("Final Ceiling Closure","Plumbing:","Are gas and refrigeration pipes in?"),
("Final Ceiling Closure","Air conditioning and ventialtion:","Is all ducting, plenums and dampers in the correct position? All items supported / hung properly?"),
("Final Ceiling Closure","Air conditioning and ventialtion:","All duct insulation complete?"),
("Final Ceiling Closure","Air conditioning and ventialtion:","All ducting connections complete / checked / proper?"),
("Final Ceiling Closure","Air conditioning and ventialtion:","All electrical work complete and certified?"),
("Final Ceiling Closure","Air conditioning and ventialtion:","Second fix airconditioning and ventialtion systems complete?"),
("Final Ceiling Closure","Fire sprinklers:","First fix complete and tested? All pipes and fittings as per type and standard?"),
("Final Ceiling Closure","Fire sprinklers:","Check setting out, level & position of main pipe runs? All supports in place?"),
("Final Ceiling Closure","2nd Fix","Checked setting out of the ceiling sprinklers? Correctly spaced and as per engineer's design?"),
("Final Ceiling Closure","2nd Fix","Checked positioning of and fixing of droppers?"),
("Final Ceiling Closure","2nd Fix","Checked alignment of sprinklers with other services?"),
("Final Ceiling Closure","2nd Fix","Pressure tested; fill installation with water and pump to 1000kpa hold pressure for 2 hours?"),
("Bulkhead","Suspended","Ties placed correctly and tested? Has the site foreman inpsected the ties?"),
("Bulkhead","Suspended","Wall angle tie done correctly at the correct level?"),
("Bulkhead","Suspended","Main tie and tees tested? At correct level and tested?"),
("Bulkhead","Suspended","Correct type, colour, pattern? Confirmed by site foreman?"),
("Bulkhead","Suspended","Ceiling board / tiles installed correctly? Thickness confirmed?"),
("Bulkhead","Suspended","Correct height above FFL or below slab / roofing? Confirmed by the Site foreman?"),
("Bulkhead","Suspended","All joints checked and tight?"),
("Bulkhead","Suspended","All boards / tiles free of damage / paint / dirt? All clean?"),
("Bulkhead","Suspended","All insulation complete, checked, and correct type? Checked by site foreman?"),
("Bulkhead","Skimmed ceilings","Surface smooth and clean? Checked with a flashlight?"),
("Bulkhead","Skimmed ceilings","All corners square?"),
("Slurry Seal","Slurry Seal","Has fog sprayed section been approved? Checked by site foreman?"),
("Slurry Seal","Slurry Seal","Has the road cleaned and is free of mud, dust and other deleterious material?"),
("Slurry Seal","Slurry Seal","Has animal waste been thoroughly removed with clean water?"),
("Slurry Seal","Slurry Seal","Weather? (Cold, hot, warm, windy, rain, drizzle)"),
("Slurry Seal","Slurry Seal","Have areas without 19mm stone been repaired? And have loose stones been removed from area?"),
("Slurry Seal","Slurry Seal","Has the edge of the section to be slurried been clearly marked with a rope?"),
("Slurry Seal","Slurry Seal","Have moisture content for the slurry dust been determined?"),
("Slurry Seal","Slurry Seal","Has the slurry mix design been adjusted for moisture content in the slurry dust?"),
("Slurry Seal","Slurry Seal","Is the flow or slump been spread in multiple directions for even distribution & deep penetration?"),
("Slurry Seal","Slurry Seal","Has the slurry been properly levelled?"),
("Slurry Seal","Slurry Seal","Have loose stones been removed after the application of slurry?"),
("Slurry Seal","Slurry Seal","Has the area covered by each batch been recorded?"),
("Slurry Seal","Slurry Seal","A day after the application of slurry, has a pneumatic roller been used to client's satisfaction?"),
("Slurry Seal","Slurry Seal","Has client approved total work done?"),
("Ceilings","Suspended","Ties anchored correctly?"),
("Ceilings","Suspended","Wall angle tied correctly?"),
("Ceilings","Suspended","Main tie and tees installed level and plumb?"),
("Ceilings","Suspended","Level & line tested for squareness?"),
("Ceilings","Suspended","Correct type, colour, pattern?"),
("Ceilings","Suspended","Ceiling board installed square, plumb and level?"),
("Ceilings","Suspended","Correct height from floor / structural soffit?"),
("Ceilings","Suspended","Tightness of joints? Joint tape applied?"),
("Ceilings","Suspended","Boards free of damage? All screwheads below plan of boards?"),
("Ceilings","Suspended","All screwheads below plane of boards?"),
("Ceilings","Gypsum","Brandering correct?"),
("Ceilings","Gypsum","Line & Level of brandering?"),
("Ceilings","Gypsum","Correct type, Colour, Pattern?"),
("Ceilings","Gypsum","Ceiling board correctly fixed?"),
("Ceilings","Gypsum","Line & Level of Ceiling board?"),
("Ceilings","Gypsum","Correct Height?"),
("Ceilings","Gypsum","Boards free of damage?"),
("Ceilings","Gypsum","Tightness of joints? Joint tape applied?"),
("Ceilings","Gypsum","All screwheads below plane of boards?"),
("Ceilings","Gypsum plastering","Plaster even and cut tight into corners?"),
("Ceilings","Gypsum plastering","Are all edges / corners neat?"),
("Ceilings","Gypsum plastering","Whole area clean?"),
("Tiling","Check prior to Tiling","Setting out lines & levels according to Architect's plans?"),
("Tiling","Check prior to Tiling","Level & line of plaster (square)? Prior to commencing with tiling"),
("Tiling","Check prior to Tiling","Electrical 1st fix already in position?"),
("Tiling","Check prior to Tiling","Plumbing 1st fix already in position? Check elevation & setting out"),
("Tiling","Tiling","Bonding liquid used where required (type of bonding)?"),
("Tiling","Tiling","Tiles approved?"),
("Tiling","Tiling","Tile setting layout correct?"),
("Tiling","Tiling","General finishing?"),
("Tiling","Tiling","Grout used right colour and consistency?"),
("Tiling","Tiling","Corners cleaned no excessive grout?"),
("Tiling","Tiling","All services properly grouted?"),
("Tiling","Tiling","Top of tile line clean (Wall)?"),
("Tiling","Tiling","Cleaning tiles?"),
("Tiling","Tiling","Are embedded items checked?"),
("Tiling","Tiling","Tile trim neatly cut and placed?"),
("Tiling","Tiling","All left apertures adequate size to receive piping etc?"),
("Tiling","Tiling","All narrow width tiling neat and set plumb and square?"),
("Tiling","Tiling","All tiles set square, level and plumb?"),
("Tiling","Tiling","Tiles on stair risers all facing in the same direction?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Substructure approved by Engineer / manufacturer?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Substructure affixed using appropriate fasteners and tested?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Steel painted?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Correct purlin spacing?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Insulation installed?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Sheet colour correct?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Sheet overlap to specification?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Fasteners correctly aligned, spaced and fitted with correct washers?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Drip flashing installed?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Flashing, and closure pieces fitted?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Damaged sheeting replaced?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Sheets installed cleaned?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Paint touch up's complete?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Finish uniform and acceptable in appearance?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Inserts: i.e Skylights, vents installed correctly and watertight?"),
("Metal Sheet Cladding","Metal Sheet Cladding","Gutters and Down pipes installed?"),
("Excavation for structures","Excavation for structures","Excavation permit from Client on site and same as the surveyed area?"),
("Excavation for structures","Excavation for structures","Latest drawing revision used?"),
("Excavation for structures","Excavation for structures","Any underground services that require hand excavation?"),
("Excavation for structures","Excavation for structures","Survey / Setting out as per the Engineer / Architect plan?"),
("Excavation for structures","Excavation for structures","Existing Services located, indicated and marked?"),
("Excavation for structures","Excavation for structures","Barricading / safety precautions in place?"),
("Excavation for structures","Excavation for structures","Accepted datum level used for comparison?"),
("Excavation for structures","Excavation for structures","Excavated to drawing level?"),
("Excavation for structures","Excavation for structures","Additional excavation (if founding is unsuitable) approved?"),
("Excavation for structures","Excavation for structures","Confirm levels (dipsheet) - used surveyor's datum?"),
("Excavation for structures","Excavation for structures","Volumes calculated from OGL/NGL?"),
("Excavation for structures","Excavation for structures","Approval of excavation; founding material & level by Engineer?"),
("Excavation for structures","Excavation for structures","Disposal of excavated materials?"),
("Excavation for structures","Excavation for structures","Compaction approval of insitu layer?"),
("Floor cover","Floor cover","Type approved and as per plan / specification?"),
("Floor cover","Floor cover","Sub floor preparation done as per type and supplier recommendation?"),
("Floor cover","Floor cover","Spreading of primer and adhesives done according to the manufacturer's recommendation?"),
("Floor cover","Floor cover","Layout to pattern as requested by Architect?"),
("Floor cover","Floor cover","Uniformity and correctness of joints inpsected and confirmed?"),
("Floor cover","Floor cover","Correctness of cuts, base of wall joints and transition strips? All as per th eArchitects plans?"),
("Floor cover","Floor cover","Cleaned upon completion?"),
("Floor cover","Floor cover","Has the area been accepted by the client?"),
("Painting","Painting","Is the plastered / concrete surface acceptable to receive paint?"),
("Painting","Painting","Have drywall partition joints been properly sanded flat?"),
("Painting","Painting","Is there sufficient light to paint?"),
("Painting","Painting","Are the drop sheets sufficient and are all joints / edges taped correctly?"),
("Painting","Painting","Has the paint shelf life been checked and approved?"),
("Painting","Painting","Type of paint used approved?"),
("Painting","Painting","Does the paint meet the required specification?"),
("Painting","Painting","Colour of paint as per Architects / Developers documentation?"),
("Painting","Painting","Surface preparation completed?"),
("Painting","Painting","Method of application as per specification?"),
("Painting","Painting","Number of coats being applied to specification?"),
("Painting","Painting","Thickness of paint coats acceptable?"),
("Painting","Painting","Visual film coat check or with a paint film tester?"),
("Painting","Painting","Evenness of applied paint?"),
("Painting","Painting","Check for paint runs; sags, and brush marks, are there any?"),
("Painting","Painting","Area clean after painting completed?"),
("Painting","Painting","All taping etc. removed?"),
("Painting","Painting","Has the paint been inspected after 48 hours to check for colour accuracy and absence of"),
("Painting","Painting","blotching?"),
("Waterproofing","Pre Waterproofing","Check screed / concrete surface is smooth? Steel trowelled smooth?"),
("Waterproofing","Pre Waterproofing","Are all edges & corners neat & smooth?"),
("Waterproofing","Pre Waterproofing","Have all stormwater oultets ben completed? (full bores etc.)"),
("Waterproofing","Pre Waterproofing","Have expansion joints been identified & details issued?"),
("Waterproofing","Pre Waterproofing","Have all expansion joints been prepared as per detail?"),
("Waterproofing","Pre Waterproofing","Surfaces pressure washed to remove laitance?"),
("Waterproofing","Pre Waterproofing","Any flaking and / or problem areas after washing?"),
("Waterproofing","Pre Waterproofing","Have all trades left the area to avoid interference with waterproofing?"),
("Waterproofing","Pre Waterproofing","Fire extinguishers ready?"),
("Waterproofing","Pre Waterproofing","Signage displayed?"),
("Waterproofing","Post Waterproofing","Has waterproofing been sprayed to correct thickness? (DFT test attached?)"),
("Waterproofing","Post Waterproofing","Has surface been checked for defects & defect repaired?"),
("Waterproofing","Post Waterproofing","All waterproofing termination done correctly?"),
("Waterproofing","Post Waterproofing","Waterproofing to expansion joints done correctly? (as per details)"),
("Waterproofing","Post Waterproofing","Flood tests of were done?"),
("Block Paving","Block Paving","Latest drawings revision used?"),
("Block Paving","Block Paving","Material used approved by Engineer / Architect?"),
("Block Paving","Block Paving","In Situ materials compacted properly and to engineer's specification?"),
("Block Paving","Block Paving","Specific bedding materials approved and used?"),
("Block Paving","Block Paving","Correct bedding thickness?"),
("Block Paving","Block Paving","Setting out - Alignment and falls as per plan?"),
("Block Paving","Block Paving","Setting out - Level, pattern alignment?"),
("Block Paving","Block Paving","Pattern approved?"),
("Block Paving","Block Paving","Compaction of block paving done using a rolling plate compactor?"),
("Block Paving","Block Paving","All joints sealed correctly?"),
("Block Paving","Block Paving","End beam construction acceptance?"),
("Block Paving","Block Paving","Has grouting been done in two directions meeting at 90 degrees?"),
("Block Paving","Block Paving","Has the grout set for more than 72 hours before loading the paving?"),
("Fencing","Fencing","Concession with the land owner received: YES …………….. NO ………………."),
("Fencing","Fencing","Correct drawing revision used?"),
("Fencing","Fencing","Fencing material pre-approved?"),
("Fencing","Fencing","Clearing fence line?"),
("Fencing","Fencing","Survey / check line?"),
("Fencing","Fencing","Hole excavation - Dimensions as per drawings? Holes the distance apart as per the recommendations?"),
("Fencing","Fencing","Straining posts: As per drawing?"),
("Fencing","Fencing","Stay and anchor: As per drawing?"),
("Fencing","Fencing","Standards: Spacing as per drawing, bound correctly?"),
("Fencing","Fencing","Droppers: Spacing, bound as per specification?"),
("Fencing","Fencing","Straining wire tensioned?"),
("Fencing","Fencing","Mesh: Stretched tight across wires?"),
("Fencing","Fencing","Mesh: Joints acceptable?"),
("Fencing","Fencing","Erecting gates as per drawing?"),
("Fencing","Fencing","Complete fencing: Plumb, tight, true line and level?"),
("Fencing","Fencing","Painting: Cold galvanized, brushed, chrome aluminium?"),
("Water reticulation","Water reticulation","Latest drawing revision used?"),
("Water reticulation","Water reticulation","Piping material - Type and size appropriate and according to design?"),
("Water reticulation","Water reticulation","Setting out work - Alignment and level correct?"),
("Water reticulation","Water reticulation","Permission to excavate received?"),
("Water reticulation","Excavation","Correct depth and width?"),
("Water reticulation","Excavation","Bedding material type and thickess as per design?"),
("Water reticulation","Excavation","Compaction of bedding?"),
("Water reticulation","Excavation","Check invert levels and flass from outlet to inlet?"),
("Water reticulation","Excavation","Density test done on bedding?"),
("Water reticulation","Excavation","Check that pipes are free of damage?"),
("Water reticulation","Excavation","Check sealing of joints, all joints correctly bedded and and unstressed?"),
("Water reticulation","Excavation","Check orientation, line and fall?"),
("Water reticulation","Excavation","Check house connection, clear and taped over?"),
("Water reticulation","Excavation","Compaction of blanket material, done in layer that do not exceed 200mm?"),
("Water reticulation","Excavation","Check thrust block are in place?"),
("Water reticulation","Excavation","Check backfilling above pipe level?"),
("Water reticulation","Excavation","Is the re warning / fanger tape over the pipe?"),
("Water reticulation","Excavation","Is the backfilled area suitable for it's intended purpose?"),
("Crack sealing","Crack sealing","Check specification?"),
("Crack sealing","Crack sealing","Centre-piece chipped out to achieve slot shape?"),
("Crack sealing","Crack sealing","Loose material removed?"),
("Crack sealing","Crack sealing","Blown with air to clean cracks?"),
("Crack sealing","Crack sealing","Hold point for inspection - Specialist to inspect prior to proceeding"),
("Crack sealing","Crack sealing","Installed (5mm flat) backing strips to 15mm below concrete level?"),
("Crack sealing","Crack sealing","Prime (using a Sika product) Sika Flex Prime429 or similarly approved?"),
("Crack sealing","Crack sealing","Allowed 15-30 Minute to dry (see product spec)?"),
("Crack sealing","Crack sealing","Install Sika Flex according the spec with silicon gun? Or similar approved?"),
("Crack sealing","Crack sealing","Tool to a smoothed surface?"),
("Crack sealing","Crack sealing","Final inspection - Crack successfully sealed and not visible?"),
("Crack sealing","Crack sealing","Allow 7 days to cure - Inspected again."),
("Backfill to structures","Backfill to structures","Structure completion / approval received?"),
("Backfill to structures","Backfill to structures","Approval of backfill material & sources?"),
("Backfill to structures","Backfill to structures","Compaction equipment agreed upon?"),
("Backfill to structures","Backfill to structures","Backfill in layers precribed? Indicate thickness of layers."),
("Backfill to structures","Backfill to structures","Density test results from lab acceptable? (attach the results)"),
("Backfill to structures","Backfill to structures","Approval of final level? What is the final level?"),
("Backfill to structures","Backfill to structures","How many layers of backfill?"),
("Backfill to structures","Backfill to structures","Is the backfill of the correct mositure to lessen dust?"),
("Backfill to structures","Backfill to structures","Is all organic material removed?"),
("Backfill to structures","Backfill to structures","Are all rocks, exceeding 100mm in radius (in any plane) removed from the backfill?"),
("Backfill to structures","Backfill to structures","Is the backfilled area flat and acceptable for follow up work?"),
("Backfill to structures","Backfill to structures","Has the engineer requested a DCP test?"),
("Backfill to structures","Backfill to structures","Engineer happy with DCP test results? Attach DCP test results."),
("Brickwork","Brickwork","Latest drawing revision used?"),
("Brickwork","Brickwork","Brick type - samples approved? Who approved them?"),
("Brickwork","Brickwork","Has the engineer seen and approved the brick manufacturers data sheet?"),
("Brickwork","Brickwork","Mortar mix design approved? Approved by whom?"),
("Brickwork","Brickwork","Setting out of works / Profiles checked? Surveyor pegs used as the datum?"),
("Brickwork","Brickwork","Dimensions of Rooms / Units correct? Have all first courses been checked and approved?"),
("Brickwork","Brickwork","Gauging as per brick and mix design?"),
("Brickwork","Brickwork","Setting up door frames - Square, plumb & straight?"),
("Brickwork","Brickwork","Hoop iron ties affixed where trusses will be accepted and tied down?"),
("Brickwork","Brickwork","DPC installed and details correct as per NBR and NHBRC requirements?"),
("Brickwork","Brickwork","Expansion joints - Are size and type correct and as per engineer's plan?"),
("Brickwork","Brickwork","Weepholes spacings checked? Weepholes complete throughout the perpend?"),
("Brickwork","Brickwork","Brickforce installed / Wall Ties - Type and spacing?"),
("Brickwork","Brickwork","Alignment of perpends and joints? Correct and checked?"),
("Brickwork","Brickwork","Door & windows lintels correct - level and size?"),
("Brickwork","Brickwork","Embedded items in place and as per design and requirements?"),
("Brickwork","Brickwork","Brickwork plumb and true?"),
("Brickwork","Brickwork","Cavity inspected and clean?"),
("Brickwork","Brickwork","Pointing done appropriately, no overrun onto face, clean and neat?");



alter table tasks add column dependantOn varchar(160);
alter table tasks add column parentId varchar(160);

 startDate TIMESTAMP DEFAULT NOW(),

alter table tasks add column baselineStartDate TIMESTAMP DEFAULT now();
alter table tasks add column baselineEndDate TIMESTAMP DEFAULT now();

alter table tasks add column comments varchar(160);
alter table qcquestionnaireDone add column image varchar(160);
alter table qcquestionnaireTemplate add column image varchar(160);
alter table deliveries add column comments varchar(160);
alter table purchaseOrders add column comments varchar(160);

alter table progress add column currentTime float default 0;
alter table suppliers add column isSubcontractor BOOLEAN default true;



create table fixes (
    id varchar(100) primary key,
    development int,
    taskType int,
    taskName varchar(160),
    unitNumber int,
    unitName varchar(160),
    subsectionName varchar(160),
    fix varchar(100),
    supplier int,
    vatVendor BOOLEAN,
    totalBudget float,
    totalUsed float,
    Remaining float,
    startDate TIMESTAMP default now(),
    endDate TIMESTAMP default now(),
    baselineStartDate TIMESTAMP default now(),
    baselineEndDate TIMESTAMP default now(),
    dependantOn varchar(160),
    parentId varchar(160),
    FOREIGN KEY (supplier) REFERENCES suppliers(id),
    FOREIGN KEY (taskType) REFERENCES taskTypes(id),
    FOREIGN KEY (unitNumber) REFERENCES units(id),
    FOREIGN KEY (development) REFERENCES developments(id)
);

alter table tasks add column sortIndex int;



 

create table taskList (
    id int auto_increment primary key,
    development int,
    taskText text,
    taskTitle varchar(160),
    userName varchar(160),
    icon varchar(160),
    sortIndex int,
    typeTask varchar(160)
);

alter table qcquestionnaireDone add signedSubcontractorImage  varchar(160) after signedSubcontractor;
alter table qcquestionnaireDone add signedSiteforemanImage  varchar(160) after signedSiteforeman;
alter table qcquestionnaireDone add signedConstructionManagerImage  varchar(160) after signedConstructionManager;
alter table taskList add column estimate varchar(160);

alter table qcquestionnaireDone add signedSubcontractorDate  varchar(160) after signedSubcontractorImage;
alter table qcquestionnaireDone add signedSiteforemanDate  varchar(160) after signedSiteforemanImage;
alter table qcquestionnaireDone add signedConstructionManagerDate  varchar(160) after signedConstructionManagerImage;

insert into qcquestionnaireTemplate (shortName, category, name) values
 ("Pre-Occupation Certificate Inspection","Items To Check","Engineer Form 4?"),
("Pre-Occupation Certificate Inspection","Items To Check","Slab System Conformance Certificate? Endorsed by Structural Engineer?"),
("Pre-Occupation Certificate Inspection","Items To Check","Architect Form 4? Including routes and facilities for the handicapped?"),
("Pre-Occupation Certificate Inspection","Items To Check","Architect Energy (SANS 10400 XA)?"),
("Pre-Occupation Certificate Inspection","Items To Check","Fire (Form 4)? From Mechanical Engineer?"),
("Pre-Occupation Certificate Inspection","Items To Check","Ventilation (Form 4)? From Mechanical Engineer?"),
("Pre-Occupation Certificate Inspection","Items To Check","Self closers added / fitted to fire doors?"),
("Pre-Occupation Certificate Inspection","Items To Check","Panic door openers added to escape route doors?"),
("Pre-Occupation Certificate Inspection","Items To Check","Safety signage as per plan? Fitted plumb and square? Secured as directed?"),
("Pre-Occupation Certificate Inspection","Items To Check","Do you have the glazing certificate?"),
("Pre-Occupation Certificate Inspection","Items To Check","Are all safety glass panels etched to indicate that it is safety glass?"),
("Pre-Occupation Certificate Inspection","Items To Check","Roofing Certificate A19?"),
("Pre-Occupation Certificate Inspection","Items To Check","Do you have an Electrical CoC?"),
("Pre-Occupation Certificate Inspection","Items To Check","Waterheating Certificate?"),
("Pre-Occupation Certificate Inspection","Items To Check","Plumbing Certificate?"),
("Pre-Occupation Certificate Inspection","Items To Check","Are all balustrades 1000mm, or more, above adjoining floor level?"),
("Pre-Occupation Certificate Inspection","Items To Check","Are all balustrades securely fitted? Does it pass the 100mm aperture test?"),
("Pre-Occupation Certificate Inspection","Items To Check","Are all handrails at the correct height and have a Ø of 40mm?"),
("Pre-Occupation Certificate Inspection","Items To Check","Do you have a certificate of conformance for the shower panels?"),
("Pre-Occupation Certificate Inspection","Items To Check","Are all weepholes clear and clean?"),
("Pre-Occupation Certificate Inspection","Items To Check","Are all window to cill joints sealed on the exterior?"),
("Pre-Occupation Certificate Inspection","Items To Check","Has the waterheating been confirmed?"),
("Pre-Occupation Certificate Inspection","Items To Check","Have all the locks got the right keys in them?"),
("Pre-Occupation Certificate Inspection","Items To Check","Do all lights switch on an off?"),
("Pre-Occupation Certificate Inspection","Items To Check","Does the stove switch on an off?"),
("Pre-Occupation Certificate Inspection","Items To Check","Have all the electrical outlets been tested?"),
("Pre-Occupation Certificate Inspection","Items To Check","Is there paint on all the timber door surfaces?"),
("Pre-Occupation Certificate Inspection","Items To Check","Have all gutters and downpipes been fitted?");

&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

alter table stockItems add itemCode  varchar(160) after id;
alter table stockItems add pushedToXero  BOOLEAN default false;
alter table purchaseOrders add itemCode  varchar(160) after deliveryDate;



create table stockPurchased (
    id int auto_increment primary key,
    stockItem varchar(160) not null,
    quantityPurchased float not null,
    costPerItem decimal(18,2),
    totalCost decimal(18,2),
    vatAmount   decimal(18,2),
    nettCost decimal(18,2),
    supplier int,
    PONumber varchar(160),
    invoiceNumber   varchar(160), 
    datePurchased TIMESTAMP default now(),
    development int,
    section int,
    unitNumber int,
    FOREIGN KEY (supplier) REFERENCES suppliers(id),
    FOREIGN KEY (unitNumber) REFERENCES units(id),
    FOREIGN KEY (development) REFERENCES developments(id)
);


create table stockBudget (
    id int auto_increment primary key,
    stockItem int not null,
    quantityBudgetted float not null,
    costPerItem decimal(18,2),
    totalCost decimal(18,2),
    vatAmount   decimal(18,2),
    nettCost decimal(18,2),
    supplier int,
    datePurchased TIMESTAMP default now(),
    development int,
    section int,
    unitNumber int,
    FOREIGN KEY (supplier) REFERENCES suppliers(id),
    FOREIGN KEY (unitNumber) REFERENCES units(id),
    FOREIGN KEY (stockItem) REFERENCES stockItems(id),
    FOREIGN KEY (development) REFERENCES developments(id)
);

&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

insert into stockBudget (stockItem, quantityBudgetted, costPerItem, totalCost, vatAmount, nettCost, supplier, datePurchased, development, section, unitNumber) values
(329,	14,	70,	980,	147,	1127,	18,	'2021-05-14',	1,	6,	55),
(330,	4,	35,	140,	21,	161,	18,	'2021-05-14',	1,	6,	55),
(331,	27,	66.8,	1803.6,	270.54,	2074.14,	18,	'2021-05-14',	1,	6,	55),
(332,	15000,	2,	30000,	4500,	34500,	18,	'2021-05-14',	1,	6,	55),
(333,	1010,	1,	1010,	151.5,	1161.5,	18,	'2021-05-14',	1,	6,	55),
(334,	21,	46,	966,	144.9,	1110.9,	18,	'2021-05-14',	1,	6,	55),
(335,	2,	82.69,	165.38,	24.807,	190.187,	18,	'2021-05-14',	1,	6,	55),
(336,	15,	15,	225,	33.75,	258.75,	18,	'2021-05-14',	1,	6,	55),
(337,	97,	9,	873,	130.95,	1003.95,	18,	'2021-05-14',	1,	6,	55),
(338,	479,	2.4,	1149.6,	172.44,	1322.04,	18,	'2021-05-14',	1,	6,	55);

alter table purchaseOrders add stockId  int after deliveryDate;

drop table stockPurchased;

create table stockPurchased (
    id int auto_increment primary key,
    stockItem int not null,
    quantityPurchased float not null,
    costPerItem decimal(18,2),
    totalCost decimal(18,2),
    vatAmount   decimal(18,2),
    nettCost decimal(18,2),
    supplier int,
    PONumber varchar(160),
    invoiceNumber   varchar(160), 
    datePurchased TIMESTAMP default now(),
    development int,
    section int,
    unitNumber int,
    FOREIGN KEY (supplier) REFERENCES suppliers(id),
    FOREIGN KEY (unitNumber) REFERENCES units(id),
    FOREIGN KEY (development) REFERENCES developments(id)
);

##########################################################

alter table purchaseOrders add overBudget  BOOLEAN default false;
alter table purchaseOrders add available  float default 0;











