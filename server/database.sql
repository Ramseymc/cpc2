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


alter table purchaseOrders add overBudget  BOOLEAN default false;
alter table purchaseOrders add available  float default 0;

alter table purchaseOrders add DNImage varchar(160) after delivered;
alter table suppliers add creditLimit decimal(15,2) default 0;

create table notifications (
    id int auto_increment primary key,
    title varchar(160) not null,
    msg varchar(160) not null,
    user int not null,
    created TIMESTAMP default now(),
    FOREIGN KEY (user) REFERENCES users(id)
);

alter table notifications add type varchar(160);

alter table purchaseOrders modify DNImage text;

alter table stockBudget add createdBy varchar(160) default "System";

##########################################################

create table instructionToCommence (
    id int auto_increment primary key,
    itcRefNumber varchar(160),
    development int,
    subsection int,
    unit int,
    floorLevel varchar(160), 
    supplier int,
    netVal decimal(18,2),
    startDate TIMESTAMP default now(),
    taskType varchar(160),
    issuer varchar(160),
    contact varchar(160),
    notes text,
    sentToSupplier BOOLEAN default false,
    FOREIGN KEY (development) REFERENCES developments(id),
    FOREIGN KEY (subsection) REFERENCES subsection(id),
    FOREIGN KEY (unit) REFERENCES units(id),
    FOREIGN KEY (supplier) REFERENCES suppliers(id)
);



alter table tasks add itcDone BOOLEAN default false;


insert into units (development, subsection, unitName) values 
(1,	7,	'Security'),
(1,	7,	'Play Equipment'),
(1,	7,	'Boundary Wall');





create table pandg (
    id int auto_increment primary key,
    activity varchar(255) not null,
    itemDescription text not null,
    monthEnd TIMESTAMP default now(),
    budgetAmount decimal(20,2) default 0.00,
    actualAmount decimal(20,2) default 0.00
);



CREATE TABLE salesinfo (
  id int auto_increment primary key,
  firstname varchar(50) NOT NULL,
  lastname varchar(50) NOT NULL,
  iDNumber varchar(13) NOT NULL,
  email varchar(100) NOT NULL,
  bankName varchar(50) NOT NULL,
  accountNumber varchar(50) NOT NULL,
  accountType varchar(20) NOT NULL,
  block varchar(30) NOT NULL,
  unit varchar(20) NOT NULL,
  mood varchar(30) NOT NULL DEFAULT 'Mood 1',
  flooring varchar(30) NOT NULL DEFAULT 'Tiles',
  fileOTP varchar(111) NOT NULL,
  fileId varchar(111) NOT NULL,
  fileBank varchar(111) NOT NULL,
  filePaySlip varchar(250) NOT NULL,
  fileFica varchar(250) NOT NULL,
  salesEmailSent varchar(1) NOT NULL DEFAULT 'N',
  dateCreated datetime NOT NULL,
  signedOff Boolean NOT NULL DEFAULT false
);



CREATE TABLE pandgoriginal LIKE pandg;

INSERT INTO pandgoriginal SELECT * FROM pandg;

alter table pandg add posted Boolean default false;

alter table salesinfo add mobile varchar(20);
alter table salesinfo add landline varchar(20);
alter table salesinfo add floorplan varchar(20);
alter table salesinfo add postalAddress text;
alter table salesinfo add residentialAddress text;



alter table tasks add PC Boolean default true;
alter table progress add PC Boolean default true;

create table dashboardCategories (
    id int auto_increment primary key,
    discipline varchar(160) not null,
    section int not null,
   lineNumber int not null
);

create table draws (
    id int auto_increment primary key,
    drawNumber varchar(50) not null
);

create table supplierTerms (
     id int auto_increment primary key,
     supplierTerms varchar(60) not null
);

create table financeInput (
    id int auto_increment primary key,
    development int not null,
    category int not null,
    budgetAmount decimal(20,2) default 0.00,
    actualAmount decimal(20,2) default 0.00,
    paymentDate datetime,
    invoiceDate datetime,
    invoiceNumber varchar(50),
    supplier varchar(160),
    supplierTerms int not null,
    vatable Boolean not null,
    drawNumber int,
    vatDate datetime,
    FOREIGN KEY (category) REFERENCES dashboardCategories(id),
    FOREIGN KEY (drawNumber) REFERENCES draws(id),
    FOREIGN KEY (supplierTerms) REFERENCES supplierTerms(id)
);

alter table financeInput add paid Boolean default false;

INSERT INTO dashboardCategories (discipline, section, lineNumber) values 
("Land Cost",1,1),
("Transfer Duties",1,2),
("Transfer Cost",1,3),
("Security Bond Registration",1,4),
("Sectional Title Register and RRA's",1,5),
("Rates & Taxes Admin Prov",1,6),
("Balance on funds raised available",1,7),
("Architect",2,1),
("Town Planner",2,2),
("TIA",2,3),
("Development Manager",2,4),
("Civil Engineer",2,5),
("Electrical Engineer",2,6),
("Land Surveyor",2,7),
("Raising Fee",2,8),
("Structuring Fee",2,9),
("Health & Safety",2,10),
("ECO",2,11),
("Plan Approval Fees",2,12),
("SDP Approval Fees",2,13),
("NHBRC",2,14),
("Structural Engineer",2,15),
("Mechanical Engineer",2,16),
("Geotechnical",2,17),
("Qs",2,18),
("Fire Engineer",2,19),
("Marketing",2,20),
("Other ",2,21),
("Bulk Levies",3,1),
("Civils",3,2),
("Electrical",3,3),
("Demolision",3,4),
("Water Connection",3,5),
("CPC_Site Establishment",3,6),
("Security",3,7),
("Sewerage Connection_GLC",3,8),
("COCT (Shared Network Charge)",3,9),
("COCT (Connection fee/Meter)",3,10),
("COCT (Security Deposit)",3,11),
("Landscaping",3,12);

INSERT INTO dashboardCategories (discipline, section, lineNumber) values 
("Boundary Walls_DP2",4,1);

INSERT INTO draws ( drawNumber) values
("Draw 1"),
("Draw 2"),
("Draw 3"),
("Draw 4"),
("Draw 5"),
("Draw 6"),
("Draw 7"),
("Draw 8"),
("Draw 9"),
("Draw 10"),
("Draw 11"),
("Draw 12"),
("Draw 13"),
("Draw 14"),
("Draw 15"),
("Draw 16"),
("Draw 17"),
("Draw 18"),
("Draw 19"),
("Draw 20"),
("Draw 21"),
("Draw 22"),
("Draw 23"),
("Draw 24"),
("Draw 25"),
("Draw 26"),
("Draw 27"),
("Draw 28"),
("Draw 29"),
("Draw 30"),
("ER1"),
("ER2"),
("ER3"),
("ER4"),
("ER5"),
("ER6"),
("ER7"),
("ER8"),
("ER9"),
("ER10"),
("ER11"),
("ER12"),
("ER13"),
("ER14"),
("ER15");


INSERT INTO supplierTerms (supplierTerms) VALUES
("30 days from date of Invoice"),
("30 days from date of Statement"),
("COD Now"),
("COD - EOM");

insert into financeInput (development,category ,budgetAmount,actualAmount,paymentDate, invoiceDate, supplier, supplierTerms, vatable, drawNumber ,vatDate ) Values
(1,24,13575,13575,"2019/11/13","2019/11/07","JC Engelbrecht",1,TRUE,6,"2020/02/29"),
(1,1,9806250,9806250,"2021/02/12","2021/02/12","MHI - Carstens",1,FALSE,1,"2021/04/30"),
(1,2,1104430.5,1104430.5,"2021/02/12","2021/02/12","MHI - Carstens",1,FALSE,1,"2021/04/30"),
(1,8,703335.1,703335.1,"2021/02/14","2021/02/14","Bpas architecture",1,TRUE,1,"2021/04/30"),
(1,12,201681.25,201681.25,"2021/02/14","2021/02/14","NWE Consulting",1,TRUE,1,"2021/04/30"),
(1,34,8518.15,8518.15,"2021/02/14","2021/02/14","Cape Projects Construction (Pty) Ltd",1,TRUE,1,"2021/04/30"),
(1,11,971130.04,971130.04,"2021/02/14","2021/02/14","Cape Projects Structured Developments (Pty) Ltd",1,TRUE,1,"2021/04/30"),
(1,14,47457.61,47457.61,"2021/02/14","2021/02/14","Base Plan & Beyers & P van der Westhuizen",1,TRUE,1,"2021/04/30"),
(1,40,6100,6100,"2021/02/14","2021/02/14","Adele Turner",1,TRUE,1,"2021/04/30"),
(1,27,61332.5,61332.5,"2021/02/14","2021/02/14","",1,TRUE,1,"2021/04/30"),
(1,23,40250,40250,"2021/02/14","2021/02/14","NWE Consulting Engineers",1,TRUE,1,"2021/04/30"),
(1,28,7475,7475,"2021/02/14","2021/02/14","Doug Jeffrey",1,TRUE,1,"2021/04/30"),
(1,15,1055127.23,1055127.23,"2021/02/14","2021/02/14","Opportunity Global Investment (Pty) Ltd",1,TRUE,1,"2021/04/30"),
(1,4,77266,77266,"2021/02/14","2021/02/14","STBB",1,TRUE,1,"2021/04/30"),
(1,16,895499,895499,"2021/02/14","2021/02/14","Cape Projects Structured Developments (Pty) Ltd",1,TRUE,1,"2021/04/30"),
(1,10,34500,34500,"2021/02/14","2021/02/14","Cachet",1,TRUE,1,"2021/04/30"),
(1,9,70000,70000,"2021/02/14","2021/02/14","Atlas",1,TRUE,1,"2021/04/30"),
(1,28,16500,16500,"2021/04/30","2021/03/02","Gramic",1,FALSE,3,"2021/06/30"),
(1,32,281750,281750,"2021/04/30","2021/03/18","GL Conradie Plant Hire",1,TRUE,4,"2021/06/30"),
(1,29,44736.69,44736.69,"2021/04/01","2021/03/30","City of Cape Town",1,TRUE,4,"2021/06/30"),
(1,30,466233.27,466233.27,"2021/04/28","2021/03/30","DP2 Construction",1,TRUE,3,"2021/06/30"),
(1,28,10125,10125,"2021/04/30","2021/03/31","Gramic",1,FALSE,3,"2021/06/30"),
(1,15,110535.59,110535.59,"2021/04/21","2021/03/31","Opportunity Global Investment Realty",1,TRUE,6,"2021/06/30"),
(1,17,3800,3800,"2021/04/30","2021/04/07","Qualisafe",1,TRUE,3,"2021/06/30"),
(1,38,31873.15,31873.15,"2021/06/09","2021/04/08","City of Cape Town",1,TRUE,3,"2021/06/30"),
(1,38,829495.22,829495.22,"2021/06/09","2021/04/08","City of Cape Town",1,TRUE,3,"2021/06/30"),
(1,12,32882.81,32882.81,"2021/04/30","2021/04/15","NWE Consulting",1,TRUE,3,"2021/06/30"),
(1,36,113130.34,113130.34,"2021/06/04","2021/04/21","GLC Development",1,TRUE,4,"2021/06/30"),
(1,36,19873.73,19873.73,"2021/06/04","2021/04/21","GLC Development",1,TRUE,4,"2021/06/30"),
(1,41,74005.49,74005.49,"2021/07/30","2021/04/22","Decorton",1,TRUE,6,"2021/06/30"),
(1,18,6900,6900,"2021/04/30","2021/04/26","Doug Jeffrey",1,TRUE,3,"2021/06/30"),
(1,29,156600.38,156600.38,"2021/05/04","2021/04/28","City of Cape Town",1,TRUE,4,"2021/06/30"),
(1,30,1320957.29,1320957.29,"2021/06/09","2021/04/28","DP2 Construction",1,TRUE,4,"2021/06/30"),
(1,34,4779.91,4779.91,"2021/04/30","2021/04/28","Cape Projects Construction",1,TRUE,3,"2021/06/30"),
(1,25,40000,40000,"2021/03/15","2021/04/28","Hot Potato",1,TRUE,4,"2021/06/30"),
(1,25,42136.36,42136.36,"2021/06/11","2021/04/28","Hot Potato",1,TRUE,3,"2021/06/30"),
(1,19,49128.4,49128.4,"2021/05/05","2021/05/05","City of Cape Town",1,TRUE,4,"2021/08/31"),
(1,12,32882.81,32882.81,"2021/06/01","2021/05/14","NWE Consulting",1,TRUE,5,"2021/08/31"),
(1,15,300536.35,300536.35,"2021/06/10","2021/05/14","Opportunity Global Investment Realty",1,TRUE,5,"2021/08/31"),
(1,34,9184.79,9184.79,"2021/06/01","2021/05/17","Cape Projects Construction",1,TRUE,4,"2021/08/31"),
(1,18,6900,6900,"2021/06/11","2021/05/18","Doug Jeffrey",1,TRUE,6,"2021/08/31"),
(1,41,27655.43,27655.43,"2021/07/30","2021/05/20","Decorton",1,TRUE,6,"2021/08/31"),
(1,30,1668839.5,1668839.5,"2021/06/25","2021/05/25","DP2 Construction",1,TRUE,5,"2021/08/31"),
(1,34,2341.09,2341.09,"2021/06/11","2021/06/09","Cape Projects Construction",1,TRUE,6,"2021/08/31"),
(1,34,3516.69,3516.69,"2021/06/18","2021/06/11","Cape Projects Construction",1,TRUE,5,"2021/08/31"),
(1,28,13500,13500,"2021/06/25","2021/06/12","Gramic",1,FALSE,6,"2021/08/31"),
(1,12,32882.81,32882.81,"2021/07/30","2021/06/28","NWE Consulting",1,TRUE,6,"2021/08/31"),
(1,34,6012.55,6012.55,"2021/07/30","2021/06/30","Cape Projects Construction",1,TRUE,6,"2021/08/31"),
(1,34,10374.32,10374.32,"2021/07/30","2021/06/30","Cape Projects Construction",1,TRUE,6,"2021/08/31"),
(1,21,132293.25,132293.25,"2021/07/30","2021/06/30","NHBRC",1,FALSE,6,"2021/08/31"),
(1,30,1007126.36,1007126.36,"2021/07/30","2021/07/01","DP2 Civil Contractor",1,TRUE,6,"2021/10/31"),
(1,12,32882.81,32882.81,"2021/08/27","2021/07/23","NWE Consulting",1,TRUE,6,"2021/10/31"),
(1,11,277743.83,277743.83,"2021/07/30","2021/07/23","CPS",1,TRUE,6,"2021/10/31"),
(1,14,9936,9936,"2021/07/27","2021/07/27","Baseplan",1,TRUE,6,"2021/10/31"),
(1,30,1092605.34,1092605.34,"2021/07/30","2021/07/28","DP2 Civil Contractor",1,TRUE,6,"2021/10/31"),
(1,21,89395.5,89395.5,"2021/07/30","2021/07/28","NHBRC",1,FALSE,6,"2021/08/31"),
(1,21,126893.25,126893.25,"2021/07/30","2021/07/28","NHBRC",1,FALSE,6,"2021/08/31"),
(1,22,200739.929,200739.929,"2021/07/30","2021/07/29","KLS Structural Engineers",1,TRUE,6,"2021/10/31"),
(1,18,6900,6900,"2021/07/28","2021/07/30","Doug Jeffrey",1,TRUE,6,"2021/10/31"),
(1,27,81290.53,81290.53,"2021/07/30","2021/07/30","Quinate",1,TRUE,6,"2021/10/31"),
(1,17,7000,7000,"2021/07/28","2021/07/31","Qualisafe",1,TRUE,6,"2021/10/31"),
(1,14,4140,4140,"2021/09/24","2021/07/31","Baseplan",1,TRUE,6,"2021/10/31"),
(1,15,0,0,"2021/07/28","2021/07/31","Opportunity Global Investment Realty",1,TRUE,6,"2021/10/31");

insert into financeInput (development,category ,budgetAmount,actualAmount,paymentDate, supplierTerms, vatable, drawNumber ,vatDate ) Values
(1,8,2500,0,"2021/11/28",1,TRUE,null,"2021/12/31"),
(1,8,2500,0,"2021/11/28",1,TRUE,null,"2021/12/31"),
(1,8,2500,0,"2021/11/28",1,TRUE,null,"2021/12/31"),
(1,8,2500,0,"2021/12/12",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/12",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/12",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2021/12/26",1,TRUE,null,"2022/02/28"),
(1,8,1000,0,"2022/01/07",1,TRUE,null,"2022/02/28"),
(1,8,1000,0,"2022/01/07",1,TRUE,null,"2022/02/28"),
(1,8,1000,0,"2022/01/07",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2022/01/09",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2022/01/09",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2022/01/09",1,TRUE,null,"2022/02/28"),
(1,8,1000,0,"2022/01/21",1,TRUE,null,"2022/02/28"),
(1,8,1000,0,"2022/01/21",1,TRUE,null,"2022/02/28"),
(1,8,1000,0,"2022/01/21",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2022/01/23",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2022/01/23",1,TRUE,null,"2022/02/28"),
(1,8,2500,0,"2022/01/23",1,TRUE,null,"2022/02/28"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/04",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/02/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/02/06",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/18",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/18",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/02/18",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/02/20",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/02/20",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/03/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/03/04",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/03/04",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/06",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/03/18",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/03/18",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/20",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/20",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,2500,0,"2022/03/27",1,TRUE,null,"2022/04/30"),
(1,8,1000,0,"2022/04/01",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/01",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/03",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/03",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/15",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/17",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/17",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/17",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/17",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/17",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/17",1,TRUE,null,"2022/06/30"),
(1,8,2500,0,"2022/04/17",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/29",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/04/29",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/06",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/13",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/13",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/27",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/27",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/27",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/27",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/27",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/27",1,TRUE,null,"2022/06/30"),
(1,8,1000,0,"2022/05/27",1,TRUE,null,"2022/06/30"),
(1,29,740224.72,0,"2021/08/15",1,TRUE,null,"2021/10/31"),
(1,30,2174305.75,0,"2021/09/24",1,TRUE,null,"2021/10/31"),
(1,11,64742,0,"2021/08/30",1,TRUE,null,"2021/10/31"),
(1,11,64742,0,"2021/09/30",1,TRUE,null,"2021/10/31"),
(1,11,64742,0,"2021/10/31",1,TRUE,null,"2021/12/31"),
(1,11,64742,0,"2021/11/30",1,TRUE,null,"2021/12/31"),
(1,11,64742,0,"2021/12/31",1,TRUE,null,"2022/02/28"),
(1,11,64742,0,"2022/01/31",1,TRUE,null,"2022/04/30"),
(1,11,64742,0,"2022/02/28",1,TRUE,null,"2022/04/30"),
(1,11,64742,0,"2022/03/31",1,TRUE,null,"2022/06/30"),
(1,11,64742,0,"2022/04/30",1,TRUE,null,"2022/06/30"),
(1,11,64742,0,"2022/05/31",1,TRUE,null,"2022/08/31"),
(1,18,6900,0,"2021/08/27",1,TRUE,null,"2021/10/31"),
(1,18,6900,0,"2021/09/24",1,TRUE,null,"2021/10/31"),
(1,18,6900,0,"2021/10/29",1,TRUE,null,"2021/12/31"),
(1,18,6900,0,"2021/11/26",1,TRUE,null,"2021/12/31"),
(1,18,6900,0,"2021/12/28",1,TRUE,null,"2022/02/28"),
(1,18,6900,0,"2022/01/28",1,TRUE,null,"2022/02/28"),
(1,18,6900,0,"2022/02/25",1,TRUE,null,"2022/04/30"),
(1,18,6900,0,"2022/03/25",1,TRUE,null,"2022/04/30"),
(1,18,6900,0,"2022/04/28",1,TRUE,null,"2022/06/30"),
(1,18,6900,0,"2022/05/28",1,TRUE,null,"2022/06/30"),
(1,31,1143924.12,0,"2021/10/28",1,TRUE,null,"2021/12/31"),
(1,26,17905.5,0,"2021/08/31",1,TRUE,null,"2021/10/31"),
(1,26,17905.5,0,"2021/09/30",1,TRUE,null,"2021/10/31"),
(1,26,17905.5,0,"2021/12/31",1,TRUE,null,"2022/02/28"),
(1,26,17905.5,0,"2022/05/31",1,TRUE,null,"2022/08/31"),
(1,17,3800,0,"2021/08/27",1,TRUE,null,"2021/10/31"),
(1,17,3800,0,"2021/09/24",1,TRUE,null,"2021/10/31"),
(1,17,3800,0,"2021/10/24",1,TRUE,null,"2021/12/31"),
(1,17,3800,0,"2021/11/26",1,TRUE,null,"2021/12/31"),
(1,17,3800,0,"2021/12/25",1,TRUE,null,"2022/02/28"),
(1,17,3800,0,"2022/01/28",1,TRUE,null,"2022/02/28"),
(1,17,3800,0,"2022/02/25",1,TRUE,null,"2022/04/30"),
(1,17,3800,0,"2022/03/25",1,TRUE,null,"2022/04/30"),
(1,17,3800,0,"2022/04/28",1,TRUE,null,"2022/06/30"),
(1,17,3800,0,"2022/05/28",1,TRUE,null,"2022/06/30"),
(1,14,42056,0,"2021/08/27",1,TRUE,null,"2021/10/31"),
(1,14,40437.2,0,"2021/10/29",1,TRUE,null,"2021/12/31"),
(1,27,50000,0,"2021/10/29",1,TRUE,null,"2021/12/31"),
(1,27,50000,0,"2021/11/26",1,TRUE,null,"2021/12/31"),
(1,27,50000,0,"2021/12/28",1,TRUE,null,"2022/02/28"),
(1,27,22467.5,0,"2022/01/27",1,TRUE,null,"2022/02/28"),
(1,27,16200,0,"2022/02/25",1,TRUE,null,"2022/04/30"),
(1,23,23000,0,"2021/08/27",1,TRUE,null,"2021/10/31"),
(1,23,20470,0,"2021/09/24",1,TRUE,null,"2021/10/31"),
(1,21,555000,0,"2021/09/24",1,FALSE,null,"2021/10/31"),
(1,19,75739,0,"2021/08/13",1,TRUE,null,"2021/10/31"),
(1,6,10000,0,"2021/06/30",1,TRUE,null,"2021/08/31"),
(1,6,10000,0,"2021/07/28",1,TRUE,null,"2021/08/31"),
(1,6,10000,0,"2021/08/25",1,TRUE,null,"2021/10/31"),
(1,6,10000,0,"2021/09/19",1,TRUE,null,"2021/10/31"),
(1,6,10000,0,"2021/09/24",1,TRUE,null,"2021/04/30"),
(1,6,10000,0,"2021/10/29",1,TRUE,null,"2021/12/31"),
(1,6,10000,0,"2021/11/26",1,TRUE,null,"2021/12/31"),
(1,6,10000,0,"2021/12/31",1,TRUE,null,"2022/02/28"),
(1,6,10000,0,"2022/01/28",1,TRUE,null,"2022/02/28"),
(1,6,10000,0,"2021/07/30",1,TRUE,null,"2021/08/31"),
(1,35,235639.08,0,"2021/08/27",1,TRUE,null,"2021/10/31"),
(1,35,235639.08,0,"2021/09/24",1,TRUE,null,"2021/10/31"),
(1,22,66266.39,0,"2021/10/28",1,TRUE,null,"2021/12/31"),
(1,22,42983.61,0,"2021/11/26",1,TRUE,null,"2021/12/31"),
(1,22,66312.40,0,"2022/03/25",1,TRUE,null,"2022/04/30");

#######################

create table salesData (
id int auto_increment primary key,
unit int not null,
beds float,
bath float,
unit_type varchar(100),
size float,
base_price decimal(20,2),
contract_price decimal(20,2),
sold Boolean default false,
isEnclosed decimal(20,2),
bathAdd decimal(20,2),
study decimal(20,2),
parking decimal(20,2),
bay_no varchar(15),
mood_board varchar(50),
extras decimal(20,2),
notes text,
deductions decimal(20,2),
sale_date datetime,
bond_app_date datetime,
lodge_date datetime,
transfer_date datetime
);

ALTER TABLE salesData
ADD CONSTRAINT fk_salesData FOREIGN KEY (unit) REFERENCES units(id);

alter table salesData add development int default 1;


alter table salesData add actualsale_date datetime;
insert into salesData (unit,beds,bath,unit_type,size,base_price,contract_price,sold,isEnclosed,bathAdd,study,parking,bay_no,mood_board,extras,notes,deductions,sale_date,bond_app_date,lodge_date,transfer_date) values
(54,2,2,"G",78,1404900,1411900,TRUE,0,0,0,25000,"","",2000,"Yard gate Cash Deal",20000,"2021/11/08","2021/11/28","2021/12/18","2022/01/07"),

(55,2,2,"H",78,1449900,1429900,TRUE,0,1,0,0,"","",0," Cash Deal",20000,"2021/11/08","2021/11/28","2021/12/18","2022/01/07"),
(56,2,1,"C",73,1479900,1499900,TRUE,20000,0,0,0,"","",0," ",0,"2021/11/08","2021/11/28","2021/12/18","2022/01/07"),
(57,2,2,"H",78,1479900,1479900,FALSE,0,0,0,0,"","",0," ",0,"2021/11/22","2021/12/12","2022/01/01","2022/01/21"),
(58,2,2,"H",78,1479900,1479900,TRUE,0,0,0,0,"","",0," ",0,"2021/11/22","2021/12/12","2022/01/01","2022/01/21"),
(59,2,1,"B",73,1488900,1497900,TRUE,0,0,0,0,"","",9000,"Addition to plan? ",0,"2021/11/22","2021/12/12","2022/01/01","2022/01/21"),
(45,2,2,"G",78,1459900,1439900,TRUE,0,1,0,0,"","",0," Cash Deal",20000,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(46,2,2,"H",78,1474900,1499900,TRUE,0,1,0,25000,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(47,2,1,"A",73,1499900,1499900,TRUE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(48,2,2,"H",78,1414900,1414900,TRUE,0,1,0,0,"","",0," ",0,"2021/12/20","2022/01/09","2022/01/29","2022/02/18"),
(49,2,2,"H",78,1479900,1479900,TRUE,0,0,0,0,"","",0," ",0,"2021/12/20","2022/01/09","2022/01/29","2022/02/18"),
(50,2,1,"A ",73,1389900,1389900,TRUE,0,0,0,0,"","",0," ",0,"2021/12/20","2022/01/09","2022/01/29","2022/02/18"),
(51,2,2,"H",78,1549900,1549900,TRUE,0,0,0,0,"","",0," ",0,"2022/01/03","2022/01/23","2022/02/12","2022/03/04"),
(52,2,2,"H",78,1444900,1489900,TRUE,20000,0,0,25000,"","",0," ",0,"2022/01/03","2022/01/23","2022/02/12","2022/03/04"),
(53,2,1,"D",73,1444900,1489900,TRUE,20000,0,0,25000,"","",0," ",0,"2022/01/03","2022/01/23","2022/02/12","2022/03/04"),
(36,2,1,"A",73,1349900,1349900,TRUE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(37,2,1,"A,C",73,1349900,1349900,TRUE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(38,2,1,"A,C",73,1444999,1444999,TRUE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(39,2,1,"A,B,C,D",73,1309900,1319900,TRUE,20000,0,0,0,"","",0," Discount on enclosed",10000,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(40,2,1,"A,B,C,D",73,1249900,1249900,TRUE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(41,2,1,"A,B,C,D",73,1349900,1349900,TRUE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(42,2,1,"A,B,C,D",73,1399900,1399900,FALSE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(43,2,1,"A,B,C,D",73,1399900,1399900,FALSE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(44,2,1,"A",73,1299900,1299900,TRUE,0,0,0,0,"","",0," ",0,"2021/12/06","2021/12/26","2022/01/15","2022/02/04"),
(88,2,2,"H",78,1425000,1567500,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(89,2,2,"H",78,1559900,1715890,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(32,2,2,"H",78,1425000,1567500,FALSE,0,0,0,0,"","",0," ",0,"2022/02/28","2022/03/20","2022/04/09","2022/04/29"),
(33,2,2,"H",78,1399000,1538900,FALSE,0,0,0,0,"","",0," ",0,"2022/02/28","2022/03/20","2022/04/09","2022/04/29"),
(34,2,2,"H",78,1399000,1538900,FALSE,0,0,0,0,"","",0," ",0,"2022/03/14","2022/04/03","2022/04/23","2022/05/13"),
(35,2,2,"H",78,1399000,1538900,FALSE,0,0,0,0,"","",0," ",0,"2022/03/14","2022/04/03","2022/04/23","2022/05/13"),
(26,2,2,"M",75,1499000,1648900,FALSE,0,0,0,0,"","",0," ",0,"2022/01/17","2022/02/06","2022/02/26","2022/03/18"),
(27,2,1,"A,C",73,1425000,1567500,FALSE,0,0,0,0,"","",0," ",0,"2022/01/17","2022/02/06","2022/02/26","2022/03/18"),
(28,2,1,"A,C",73,1425000,1567500,FALSE,0,0,0,0,"","",0," ",0,"2022/01/31","2022/02/20","2022/03/12","2022/04/01"),
(29,2,2,"M",75,1475000,1622500,FALSE,0,0,0,0,"","",0," ",0,"2022/01/31","2022/02/20","2022/03/12","2022/04/01"),
(30,2,1,"A,C",73,1399000,1538900,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(31,2,1,"A,C",73,1399000,1538900,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(1,2,1,"A,C",73,1449000,1601145,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(2,2,2,"G",79,1499000,1656395,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(3,2,2,"J",76,1499000,1656395,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(4,2,1,"A,C",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(5,2,1,"A,C",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(6,2,1,"A,C",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(7,2,1,"A,C",73,1579900,1745789.5,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(8,2,2,"N",77,1499000,1656395,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(9,2,1,"A,C",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/02/14","2022/03/06","2022/03/26","2022/04/15"),
(10,2,1,"A,B,C,D",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(11,2,2,"G",79,1475000,1629875,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(12,2,2,"J",74,1475000,1629875,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(13,2,1,"A,C",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(14,2,1,"A,C",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(15,2,1,"A,C",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(16,2,1,"A,C",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(17,2,2,"A,C",73,1475000,1629875,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(18,2,1,"N",77,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/07","2022/03/27","2022/04/16","2022/05/06"),
(19,2,2,"K",83,1475000,1629875,FALSE,0,0,0,0,"","",0," ",0,"2022/03/28","2022/04/17","2022/05/07","2022/05/27"),
(20,2,1,"A,B,C,D",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/28","2022/04/17","2022/05/07","2022/05/27"),
(21,2,1,"A,B,C,D",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/28","2022/04/17","2022/05/07","2022/05/27"),
(22,2,1,"A,B,C,D",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/28","2022/04/17","2022/05/07","2022/05/27"),
(23,2,1,"A,B,C,D",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/28","2022/04/17","2022/05/07","2022/05/27"),
(24,2,2,"N",77,1475000,1629875,FALSE,0,0,0,0,"","",0," ",0,"2022/03/28","2022/04/17","2022/05/07","2022/05/27"),
(25,2,1,"A,B,C,D",73,1425000,1574625,FALSE,0,0,0,0,"","",0," ",0,"2022/03/28","2022/04/17","2022/05/07","2022/05/27");

create table investorDetails (
    id int auto_increment primary key,
unit int not null,
investor_code varchar(50),
investor varchar(120),
la_email_date datetime,
la_sign_date datetime,
pledged decimal(20,2) default 0.00,
attorney_inv_amount decimal(20,2) default 0.00,
fica_inv_date datetime,
amount decimal(20,2) default 0.00,
quinteDate datetime,
draw int,
interest_rate float,
repayment_date datetime,
trust_account_interest float,
supplementary_interest float,
opc_comm float
);

alter table investorDetails add development int default 1;



alter table investorDetails add drawAdjustment decimal(20,2) default 0.00;

insert into investorDetails (unit,investor_code,investor,la_email_date,la_sign_date,pledged,attorney_inv_amount,fica_inv_date,amount,quinteDate,draw,interest_rate,trust_account_interest,supplementary_interest,opc_comm) values
(1,"","K Ngoepe","2021-05-25",Null,190000,0,Null,0,Null,null,0.15,0.035,0.0275,0.04),
(1,"ZJEN01","A Jennings","2021-06-11","2021-06-21",0,100000,"2021-06-29",100000,Null,6,0.15,0.035,0.0275,0.04),
(1,"ZWES01","G Wessels","2021-06-14","2021-06-15",0,500000,"2021-06-21",500000,Null,6,0.18,0.035,0.0275,0.04),
(1,"ZNAG01","A Nagel","2021-06-23","2021-06-29",0,200000,"2021-07-05",200000,Null,null,0.15,0.035,0.0275,0.04),
(2,"ZHAU01","J Haumann","2021-06-23","2021-06-28",0,300000,"2021-06-30",300000,Null,null,0.18,0.035,0.0275,0.04),
(2,"ZGIL02","J Gildenhuis","2021-06-09","2021-06-15",0,100000,"2021-07-19",100000,Null,null,0.15,0.035,0.0275,0.04),
(2,"ZSTO01","N Stols","2021-06-25","2021-06-29",0,200000,"2021-06-30",200000,Null,null,0.15,0.035,0.0275,0.04),
(2,"ZWIL01","G Wilson","2021-06-25",Null,0,100000,"2021-06-30",100000,Null,6,0.15,0.035,0.0275,0.04),
(2,"ZERA01","Sumsare Family (Pty) Ltd (J Erasmus)","2021-06-02","2021-07-03",0,200000,"2021-07-05",200000,Null,null,0.18,0.035,0.0275,0.04),
(3,"ZLOU02","L Louw","2021-06-09","2021-06-09",0,500000,"2021-06-22",500000,Null,6,0.18,0.035,0.0275,0.04),
(3,"ZVOL01","G Volschenk","2021-06-10","2021-06-15",0,500000,"2021-06-17",500000,Null,6,0.18,0.035,0.0275,0.04),
(4,"ZPRO01","Prostart Properties (Dr A du Toit)","2021-06-11","2021-06-14",0,1000000,"2021-06-21",1000000,Null,6,0.18,0.035,0.0275,0.04),
(5,"ZPRO01","Prostart Properties (Dr A du Toit)","2021-06-11","2021-06-14",0,1000000,"2021-06-21",1000000,Null,6,0.18,0.035,0.0275,0.04),
(6,"ZDEC01","H de Klerk","2021-07-02","2021-07-20",250000,0,Null,0,Null,null,0.15,0.035,0.0275,0.04),
(6,"ZLEW01","MC Lewis","2021-07-02","2021-07-07",0,750000,"2021-07-12",750000,Null,null,0.18,0.035,0.0275,0.04),
(7,"ZSCO01","C Scott","2021-07-06","2021-07-14",0,250000,"2021-08-05",250000,Null,null,0.15,0.035,0.0275,0.04),
(7,"ZVIS01","E Visser (L&S)","2021-07-19","2021-07-20",0,300000,"2021-07-21",300000,Null,null,0.15,0.035,0.0275,0.04),
(8,"ZKRI02","HJ Kriel","2021-06-21","2021-06-27",0,1000000,"2021-07-07",1000000,Null,null,0.18,0.035,0.0275,0.04),
(9,"ZALM01","Alma Trust","2021-05-12","2021-05-13",0,100000,"2021-05-31",100000,Null,6,0.15,0.035,0.0275,0.04),
(9,"ZMED01","G de Montille ","2021-06-18","2021-06-21",0,100000,"2021-06-23",100000,Null,6,0.15,0.035,0.0275,0.04),
(9,"","R McDowell","2021-06-15",Null,0,200000,"2021-08-05",200000,Null,null,0.18,0.035,0.0275,0.04),
(9,"ZKEW01","L Kewley","2021-06-22","2021-06-22",0,100000,"2021-06-28",100000,Null,null,0.15,0.035,0.0275,0.04),
(9,"","T Neethling","2021-06-15",Null,500000,0,Null,0,Null,null,0.18,0.035,0.0275,0.04),
(10,"","J Kleinhans","2021-06-15",Null,500000,0,Null,0,Null,null,0.18,0.035,0.0275,0.04),
(10,"ZELO01","G Eloff","2021-06-18","2021-06-18",0,500000,"2021-06-23",500000,Null,7,0.18,0.035,0.0275,0.04),
(11,"ZSLE01","SJ Sleigh","2021-07-20","2021-07-20",0,180000,"2021-08-05",180000,Null,null,0,0.035,0.0275,0.04),
(11,"ZKRI03","H Kriel (Helena Kriel) (L&S)","2021-06-15","2021-07-18",0,800000,"2021-07-21",800000,Null,null,0.18,0.035,0.0275,0.04),
(12,"","LM Oberholzer","2021-07-27",Null,200000,0,Null,0,Null,null,0,0.035,0.0275,0.04),
(12,"","C Buffet","2021-07-26",Null,600000,0,Null,0,Null,null,0,0.035,0.0275,0.04),
(88,"","DP 2","2021-04-10","2021-04-22",0,500000,"2021-04-30",500000,"2021-04-30",null,0.08,0.035,0.0275,0.04),
(88,"ZERA01","J Erasmus","2021-04-23","2021-04-28",0,500000,"2021-04-29",500000,"2021-06-07",4,0.18,0.035,0.0275,0.04),
(89,"","E Geller","2021-04-23",Null,250000,0,Null,0,Null,null,0.15,0.035,0.0275,0.04),
(89,"ZDAV01","H Davies ","2021-04-30","2021-05-04",0,250000,"2021-05-06",250000,"2021-06-15",5,0.15,0.035,0.0275,0.04),
(89,"ZERA02","C Erasmus","2021-05-12","2021-05-25",0,400000,"2021-05-27",400000,"2021-06-15",5,0.15,0.035,0.0275,0.04),
(89,"ZMAT03","D Matthee","2021-06-09","2021-06-15",0,100000,"2021-06-22",100000,Null,6,0.15,0.035,0.0275,0.04),
(32,"ZOLI01","J & L Olivier","2021-05-06","2021-05-10",0,560000,"2021-05-10",560000,Null,6,0.18,0.035,0.0275,0.04),
(32,"","L Naidoo","2021-05-07",Null,100000,0,Null,0,Null,null,0.15,0.035,0.0275,0.04),
(32,"ZNIE01","G van Niekerk","2021-05-07",Null,250000,0,Null,0,Null,null,0.15,0.035,0.0275,0.04),
(32,"","L van Niekerk","2021-07-27",Null,100000,0,Null,0,Null,null,0.15,0.035,0.0275,0.04),
(33,"ZZEL01","Zelpy (M Svacha)","2021-05-14","2021-05-18",0,200000,"2021-06-28",200000,Null,null,0.15,0.035,0.0275,0.04),
(33,"ZCRO02","G Crouse","2021-05-25","2021-06-09",0,550000,"2021-06-11",550000,"2021-06-15",5,0.18,0.035,0.0275,0.04),
(33,"ZVER03","J Vermeulen","2021-05-25",Null,0,100000,"2021-05-28",100000,"2021-06-15",5,0.15,0.035,0.0275,0.04),
(34,"ZSON01","C-Sonke Trading","2021-05-18",Null,0,844602.74,"2021-05-14",844602.74,"2021-06-07",4,0.18,0.035,0.0275,0.04),
(35,"","T McPherson",Null,Null,1000000,0,Null,0,Null,null,0.18,0.035,0.0275,0.04),
(36,"ZWAT01","PG Watts","2020-10-15","2020-10-15",0,605352.4,"2020-10-29",605352.4,"2020-11-30",33,0.18,0.035,0.0275,0.04),
(36,"ZLEB01","Lebusa","2020-11-13","2020-11-24",0,350942.621849315,"2020-11-25",350942.621849315,"2021-02-12",1,0.18,0.035,0.0275,0.04),
(37,"ZSON01","C-Sonke Trading","2020-11-13","2020-11-25",0,294523.46,"2020-11-25",294523.46,"2020-12-15",35,0.18,0.035,0.0275,0.04),
(37,"ZHUT01","T Hutchings","2020-11-13","2020-11-16",0,200000,"2021-02-01",200000,"2021-04-30",3,0.18,0.035,0.0275,0.04),
(37,"ZDIC01","Lutel Properties (G Dickinson)",Null,"2021-03-15",0,500000,"2021-03-29",500000,"2021-04-30",3,0.18,0.035,0.0275,0.04),
(38,"ZSON01","C-Sonke Trading","2020-11-13","2020-11-25",0,1000000,"2020-11-25",500000,"2020-12-01",34,0.18,0.035,0.0275,0.04),
(38,"","C-Sonke Trading",Null,Null,0,0,Null,500000,"2020-12-21",37,0.18,0.035,0.0275,0.04),
(39,"ZVWY01","JJP Van Wyk ","2020-08-04","2020-11-05",0,117237.44,"2020-07-23",117237.44,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(39,"ZLEW01","MC  Lewis","2020-11-13","2020-11-10",0,763016.87,"2020-11-18",763016.87,"2021-02-12",1,0.18,0.035,0.0275,0.07),
(40,"ZZYL01","J Zylstra","2020-08-04","2020-08-17",0,819268.49,"2020-08-14",819268.49,"2021-02-12",1,0.18,0.035,0.0275,0.04),
(40,"ZZYL01","J Zylstra","2020-08-04","2020-08-17",0,200000,"2020-10-01",200000,"2021-02-12",1,0.18,0.035,0.0275,0.07),
(41,"ZROB01","The Robyn Trust","2020-08-04","2020-08-19",0,1000000,"2020-09-28",1000000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(42,"ZBET01","Betterlife","2020-10-02","2020-10-15",0,1000000,"2021-01-26",1000000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(43,"ZBET01","Betterlife","2020-10-02","2020-10-15",0,1000000,"2021-01-26",1000000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(44,"ZBET01","Betterlife","2020-10-02","2020-10-15",0,1000000,"2021-01-26",1000000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(45,"ZALM01","Alma Trust ","2020-05-05","2020-05-05",0,100000,"2020-04-11",100000,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(45,"ZROD01","V Rodolo ","2020-07-03","2020-07-14",0,100000,"2020-07-23",100000,"2021-02-19",1,0.15,0.035,0.0275,0.07),
(45,"ZESP01","E Espag","2020-07-06","2020-07-07",0,600000,"2020-07-09",600000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(45,"ZKIR01","MT Lebuso (Kiri)","2020-07-08","2021-01-31",0,100000,"2020-09-28",100000,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(45,"ZBRO01","C Brown","2020-07-15","2020-08-17",0,100000,"2020-08-21",100000,"2021-02-19",1,0.15,0.035,0.0275,0.07),
(46,"ZINT01","Intipunku Trust ","2020-05-05","2020-05-05",0,100000,"2020-05-04",100000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(46,"ZFON01","L Aveling-Fountain ","2020-08-07","2020-08-14",0,100000,"2020-09-28",100000,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(46,"ZHUT01","T Hutchings","2020-11-13","2020-11-16",0,200000,"2021-02-01",200000,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(46,"ZMCD01","VA Mcdonald ","2020-07-15","2020-07-20",0,100000,"2020-07-20",100000,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(46,"ZLEB01","H Lebusa ","2020-07-08","2020-07-26",0,442851.94,"2020-07-07",444937.91,"2021-02-12",1,0.18,0.035,0.0275,0.04),
(47,"ZSCH01","I Schubert ","2020-07-20","2020-07-20",0,431760.07,"2020-06-26",431760.074,"2021-01-05",38,0.18,0.035,0.0275,0.04),
(47,"ZSON01","C-Sonke Trading ","2020-07-20","2020-11-30",0,569164.39,"2020-10-08",569164.39,"2020-12-18",36,0.18,0.035,0.0275,0.04),
(48,"ZPLA01","A Placzkowska","2020-07-14","2020-08-03",0,500000,"2020-09-14",500000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(48,"ZWEL01","C Welham ","2020-07-15","2021-01-30",0,281315.07,"2020-07-07",281315.07,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(48,"ZDIC01","Lutel Properties (G Dickinson)",Null,Null,0,200000,"2021-03-29",200000,"2021-06-07",4,0.18,0.035,0.0275,0.04),
(49,"ZHEI01","D Heinze ","2020-07-30","2020-08-11",0,260425.86,"2020-07-18",260425.86,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(49,"ZHEI01","D Heinze ","2020-07-30","2020-08-11",0,239574.4,"2021-01-31",239574.4,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(49,"ZDIC01","Lutel Properties (G Dickinson)",Null,Null,0,500000,"2021-03-29",500000,"2021-06-07",4,0.18,0.035,0.0275,0.04),
(50,"ZBET01","Betterlife","2020-10-02","2020-10-15",0,1000000,"2021-01-26",1000000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(51,"ZMED05","L Mdebuka","2021-01-11","2021-02-23",0,176630,"2020-12-15",176630,"2021-06-15",5,0.18,0.035,0.0275,0.04),
(51,"ZVED01","C Vedders ","2020-07-29","2021-02-02",0,240948.63,"2020-09-28",240948.63,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(51,"ZRAN01","RPG Rankin ","2020-07-30","2021-02-01",0,495547.8,"2020-11-18",495547.8,"2021-04-30",3,0.18,0.035,0.0275,0.04),
(52,"ZLEB01","H Lebusa","2020-07-29","2020-08-11",0,340718.63,"2020-07-23",340718.63,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(52,"ZSOU01","BIG BUCKS TRUST","2020-07-29","2020-07-31",0,100000,"2020-08-12",100000,"2021-02-19",1,0.15,0.035,0.0275,0.07),
(52,"ZWAT01","PG Watts ","2020-07-22","2020-07-23",0,541409.23,"2020-07-21",541409.23,"2020-11-06",31,0.18,0.035,0.0275,0.04),
(53,"ZBAL01","B Baldwin","2020-07-29","2020-07-29",0,118979.31,"2020-09-28",118979.31,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(53,"ZBOT01","C Botha ","2020-07-29","2020-07-29",0,120391.26,"2020-09-28",120391.26,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(53,"ZNAT01","Nathi Business Solutions","2020-07-30","2021-01-29",0,258940.17,"2020-08-14",258940.17,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(53,"ZMAT01","N Matthews","2020-09-30","2020-11-18",0,150000,"2020-11-26",150000,"2021-02-12",1,0.18,0.035,0.0275,0.04),
(53,"ZSPA01","A Sparrow","2020-09-30","2020-10-01",0,320000,"2020-10-08",320000,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(54,"ZWED01","HJP Wedermann","2020-07-30","2020-07-31",0,500000,"2021-02-01",500000,"2021-02-19",1,0.18,0.035,0.0275,0.04),
(54,"ZKUS01","R Kuster ","2020-03-19","2020-03-20",0,109665.75,"2020-03-17",109655.75,"2021-02-12",1,0.18,0.035,0.0275,0.04),
(54,"ZALM01","Alma Trust","2020-05-05","2020-05-05",0,100000,"2020-04-21",100000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(54,"ZNGO01","M Ngomane","2020-05-13","2020-07-31",0,100000,"2020-08-12",100000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(54,"ZJER01","T Nyirende-Jere","2020-08-07","2020-08-10",0,100000,"2020-08-21",100000,"2021-02-19",1,0.15,0.035,0.0275,0.07),
(55,"ZWAT01","PG Watts ","2020-07-22","2020-07-23",0,553419.26,"2020-03-13",553419.26,"2020-11-25",32,0.18,0.035,0.0275,0.04),
(55,"ZROB01","The Robyn Trust ","2020-09-15","2020-09-21",0,200000,"2020-09-28",200000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(55,"ZKUS02","K Kuster","2020-03-19","2020-03-19",0,204000,"2020-03-20",204000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(56,"ZMCD02","JA McDonald ","2020-03-19","2020-03-19",0,100000,"2020-03-13",100000,"2021-04-30",3,0.18,0.035,0.0275,0.04),
(56,"ZSCH01","I Schubert ","2020-03-19","2020-03-24",0,517080.94,"2021-01-13",517080.94,"2021-01-27",40,0.18,0.035,0.0275,0.04),
(56,"ZKUS03","J Kuster","2020-03-19","2020-03-19",0,130000,"2020-03-23",130000,"2021-04-30",3,0.18,0.035,0.0275,0.07),
(56,"ZWED02","C Wedermann","2020-03-25","2021-01-31",0,50000,"2021-02-01",50000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(56,"ZMDE01","B Mdebuka","2021-01-11","2021-01-19",0,179145.21,"2021-01-13",179145.21,"2021-06-15",5,0.18,0.035,0.0275,0.04),
(57,"ZKRU01","J Kruger","2020-03-25","2020-05-24",0,500000,"2020-07-08",500000,"2021-02-12",1,0.18,0.035,0.0275,0.07),
(57,"ZVER02","JJ Verheaghe","2020-08-07","2020-08-11",0,100000,"2020-08-12",100000,"2021-02-19",1,0.15,0.035,0.0275,0.07),
(57,"ZDAK01","B Daku","2020-04-01","2020-07-17",0,100000,"2020-09-03",100000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(57,"ZRAB01","Rabbit Pants Family ","2020-04-03","2020-04-06",0,100000,"2020-04-11",100000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(57,"ZNIE01","G van Niekerk","2021-05-05","2021-05-05",0,125000,"2021-05-13",125000,"2021-06-15",5,0.18,0.035,0.0275,0.07),
(58,"ZKRO01","C Kropp","2020-05-15","2020-05-16",0,150000,"2020-05-13",150000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(58,"ZHAR01","T Hart","2020-06-02","2020-06-30",0,100000,"2020-05-28",100000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(58,"ZPIE01","J Pienaar","2020-06-22","2020-06-22",0,100000,"2020-07-10",100000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(58,"ZRAM01","T Ramoshaba","2020-06-22","2020-08-04",0,100000,"2020-06-29",100000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(58,"ZJAN01","Jansen Van Rensburg","2020-07-02","2020-07-06",0,350000,"2020-08-04",350000,"2021-02-19",1,0.18,0.035,0.0275,0.07),
(58,"ZMAD01","E Maduna","2021-02-05","2021-02-19",0,100000,"2021-02-25",100000,"2021-06-15",5,0.18,0.035,0.0275,0.07),
(58,"ZNIE01","G van Niekerk","2021-05-05","2021-05-05",0,125000,"2021-05-13",125000,"2021-06-15",5,0.15,0.035,0.0275,0.07),
(59,"ZHEI01","D Heinze","2020-07-30","2020-08-11",0,623724.7,"2020-06-25",626924.55,"2021-01-22",39,0.18,0.035,0.0275,0.04),
(59,"ZHEI01","D Heinze ","2020-07-30","2020-08-11",0,376275.36,"2020-07-18",373075.45,"2021-01-22",39,0.18,0.035,0.0275,0.04);


&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

update investorDetails set pledged = attorney_inv_amount where attorney_inv_amount != 0;

UPDATE    investorDetails i,
          salesData s
    SET       i.repayment_date = s.transfer_date
   WHERE     i.unit = s.unit and i.amount != 0;

   insert into developments (developmentName) values ('Heron Fields');

   alter table pandg add development int default 1;
   alter table pandgoriginal add development int default 1;


   &&&&&&&&&&&&&&&&&&&&&&&&&&&

   insert into subsection (development, subsectionName) values 

(2,	'Block A'),
(2,	'Block B');

insert into units (development, subsection, unitName) values 
(2,8,"A101"),
(2,8,"A102"),
(2,8,"A103"),
(2,8,"A104"),
(2,8,"A105"),
(2,8,"A106"),
(2,8,"A201"),
(2,8,"A202"),
(2,8,"A203"),
(2,8,"A204"),
(2,8,"A205"),
(2,8,"A206"),
(2,8,"A301"),
(2,8,"A302"),
(2,8,"A303"),
(2,8,"A304"),
(2,8,"A305"),
(2,8,"A306"),
(2,9,"B101"),
(2,9,"B102"),
(2,9,"B103"),
(2,9,"B104"),
(2,9,"B105"),
(2,9,"B106"),
(2,9,"B107"),
(2,9,"B108"),
(2,9,"B109"),
(2,9,"B110"),
(2,9,"B111"),
(2,9,"B201"),
(2,9,"B202"),
(2,9,"B203"),
(2,9,"B204"),
(2,9,"B205"),
(2,9,"B206"),
(2,9,"B207"),
(2,9,"B208"),
(2,9,"B209"),
(2,9,"B210"),
(2,9,"B211"),
(2,9,"B212"),
(2,9,"B213"),
(2,9,"B214"),
(2,9,"B215"),
(2,9,"B301"),
(2,9,"B302"),
(2,9,"B303"),
(2,9,"B304"),
(2,9,"B305"),
(2,9,"B306"),
(2,9,"B307"),
(2,9,"B308"),
(2,9,"B309"),
(2,9,"B310"),
(2,9,"B311"),
(2,9,"B312"),
(2,9,"B313"),
(2,9,"B314"),
(2,9,"B315");


################################################
insert into dashboardCategories (discipline, section, lineNumber) values 
('Substation Slab',4,21), ('External Works',4,22), ('Landscaping',4,23), ('Security',4,24), ('Boundary Wall',4,25), ('Play Equipment',4, 26);

insert into dashboardCategories (discipline, section, lineNumber) values 
 ('Escalations',4,27), ('Contingencies',4, 28);

 alter table investorDetails add drawn Boolean default false;


 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

 CREATE TABLE balconyinfo (
   id int auto_increment primary key,
  plan varchar(50) NOT NULL,
  enclosedBalcony int NOT NULL,
  enclosedValue int NOT NULL
); 


INSERT INTO balconyinfo (id, plan, enclosedBalcony, enclosedValue) VALUES
(1, 'A', 0, 0),
(2, 'B', 1, 20000),
(3, 'C', 0, 0),
(4, 'D', 1, 20000),
(5, 'G', 0, 0),
(6, 'H', 1, 20000),
(7, 'N', 0, 0);

DROP TABLE IF EXISTS salesinfo;
CREATE TABLE salesinfo (
  id int auto_increment primary key,
  firstname varchar(50) NOT NULL,
  lastname varchar(50) NOT NULL,
  iDNumber varchar(13) NOT NULL,
  email varchar(100) NOT NULL,
  bankName varchar(50) NOT NULL,
  accountNumber varchar(50) NOT NULL,
  accountType varchar(20) NOT NULL,
  block varchar(30) NOT NULL,
  unit varchar(20) NOT NULL,
  mood varchar(30) NOT NULL DEFAULT 'Mood 1',
  flooring varchar(30) NOT NULL DEFAULT 'Tiles',
  fileOTP varchar(111) NOT NULL,
  fileId varchar(111) NOT NULL,
  fileBank varchar(111) NOT NULL,
  filePaySlip varchar(250) NOT NULL,
  fileFica varchar(250) NOT NULL,
  salesEmailSent varchar(1) NOT NULL DEFAULT 'N',
  dateCreated datetime NOT NULL,
  signedOff int NOT NULL DEFAULT 0,
  mobile varchar(20) NOT NULL,
  landline varchar(20) NOT NULL,
  floorplan varchar(20) NOT NULL,
  postalAddress text NOT NULL,
  residentialAddress text NOT NULL,
  salesAgent varchar(50) NOT NULL,
  salesAgentPhone varchar(25) NOT NULL,
  saleType varchar(50) NOT NULL,
  personTwoFirstName varchar(50)  NOT NULL,
  personTwoLastName varchar(50)  NOT NULL,
  personTwoIDNumber varchar(20)  NOT NULL,
  personTwoEmail varchar(50)  NOT NULL,
  personTwoBankName varchar(50)  NOT NULL,
  personTwoAccountNumber varchar(50)  NOT NULL,
  personTwoAccountType varchar(50)  NOT NULL,
  personTwoFileID varchar(250)  NOT NULL,
  personTwoFileBank varchar(250)  NOT NULL,
  personTwoFilePaySlip varchar(250)  NOT NULL,
  personTwoFileFica varchar(250)  NOT NULL,
  personTwoMobile varchar(20)  NOT NULL,
  personTwoLandline varchar(20)  NOT NULL,
  personTwoPostalAddress varchar(80)  NOT NULL,
  personTwoResidentialAddress varchar(80)  NOT NULL,
  marital varchar(30)  NOT NULL,
  salePerson varchar(80)  NOT NULL,
  saleBuyers int NOT NULL,
  cashDeal Boolean default 0,
  balanceRem int NOT NULL,
  deposit int NOT NULL,
  depositDate datetime,
  gasStove int NOT NULL,
  personTwoMarital varchar(20) NOT NULL,
  spareRoom varchar(50)  NOT NULL,
  additionalExtras varchar(500)  NOT NULL,
  additionalExtrasCost int NOT NULL DEFAULT 0,
  bayNo varchar(100) NOT NULL,
  notes varchar(500) NOT NULL,
  enclosedBalcony int NOT NULL DEFAULT 0,
  fileDepositPop varchar(500) NOT NULL DEFAULT '',
  gasStoveCost int NOT NULL
);



CREATE PROCEDURE spSalesInfoR1 ()
BEGIN
select 
si.*, 
sd.parking, 
sd.bay_no, 
sd.extras, 
sd.deductions, 
sd.contract_price, 
sd.base_price, 
sd.sold, 
sd.actualsale_date, 
sd.unit_type, 
sd.notes as sdnotes, 
sd.beds, 
sd.bath ,
        u.id as unitId
from salesinfo si 
join units u on si.unit = u.unitName 
join salesdata sd on sd.unit = u.id 
where si.id > 0 
 and si.firstName > '' ;
END

+++++++++++++++++++++++++

alter table investorDetails add available_date datetime;
alter table investorDetails add available decimal(20,2) default 0.00;


++++++++++++++++++++++++++
*****************************
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

alter table investorDetails add pledgeUsed Boolean default false;
alter table investorDetails add pledge_date datetime;

Create table percentagesToInvestors (
    id int auto_increment primary key,
    development int not null,
    vatOrSales  varchar(20) not null,
    dashboardDate datetime not null,
    percentageTransferred float
);

insert into percentagesToInvestors (development, vatOrSales, dashboardDate, percentageTransferred) values 
(1, "Sales", '2021-08-30', 50),
(1, "Sales", '2021-08-30', 40),
(1, "VAT", '2021-07-30', 30);

**********************************************


update financeInput set vatDate = date_sub(vatDate, interval 1 month)


create table VATPlanning (
    id int auto_increment primary key,
    development int not null,
    discipline varchar(250) not null,
    amount float not null default 0,
    vatDate dateTime not null,
    vatPeriod varchar(6)
);

alter table VATPlanning add processed boolean default false;

ALTER TABLE purchaseOrders ADD FULLTEXT (reference, itemCode, itemDescription);

*****************************************************************************

alter table purchaseOrders add task int default 0 after unitNumber;

*****************************************************************************

CREATE TABLE financeConstructionInput (
    id int auto_increment primary key,
    development Int not null,
    task Int not null default 0,
    taskType Int not null default 0,
    unitNumber Int not null default 0,
    supplier int not null,
    vatVendor Boolean not null,
    paymentDate dateTime not null,
    budgetAmount float default 0,
    vatDate dateTime,
    actualAmount float default 0,
    invoiceNumber varchar(150),
    invoiceDate datetime,
    budgetted boolean default true,
    purchaseOrder int,
    purchaseOrderNumber varchar(150),
    purchaseOrderAmount float default 0,
    purchaseOrderDate dateTime,
    paymentCertificate int,
    paymentCertificateNumber varchar(150),
    paymentCertificateAmount float default 0,
    paymentCertificateDate dateTime,
    finalised boolean default false,
    paid boolean default false
);

*****************************************************************************

alter table VATPlanning add processed boolean default false;

*****************************************************************************

alter table financeInput add pop varchar(250);

*****************************************************************************

create table pandgNew (
    id int auto_increment primary key,
    Processed Boolean default false,
  Draw varchar(30),
  OFFICE_BASED_MANAGEMENT float,
  SITE_BASED_MANAGEMENT float,
  INSURANCE float,
  MAINTENANCE_ALLOWANCE float,
  SITE_STAFF float,
  SITE_ESTABLISHMENT float,
  TRAINING float,
  SITE_SECURITY float,
  TEMPORARY_FENCING__GATES_ETC float,
  PHONES_FAX_INTERNET_RADIOS float,
  TEMPORARY_ELECTRICAL_SERVICES float,
  TEMPORARY_WATER_SUPPLY float,
  SETTING_OUT__GENERAL_Assistance float,
  SITE_SAFETY_AND_SAFETY_EQUIPMENT float,
  MEDICALS float,
  COMPUTER_EXPENSES float,
  PRINTING__STATIONARY_EXPENSES float,
  MINOR_PLANT_AND_LOOSE_TOOLS float,
  HOUSEKEEPING_SITE_TIDINESS float,
  HAND_OVER_CLEANING_ float,
  PROTECTION_OF_WORKS float,
  HIRED_PLANT_INTERNAL_incl_weekends float,
  GENERAL_TRANSPORT float,
  RUBBLE_MANAGEMENT float,
  SCAFFOLDING float,
  MATERIALS_HANDLING float,
  PETTY_CASH float,
  effectiveDate dateTime,
  development Int
);

create table contingenciesAndEscalationsBudget (
    id int auto_increment primary key,
    development int,
    category varchar(150),
    amount float
);

insert into contingenciesAndEscalationsBudget (development, category, amount) values
(1, 'Contingincies',  806566.64 ),
(1, 'Escalations',   1613133.27  );

create table contingencies (
    id int auto_increment primary key,
    development int,
    paymentDate datetime,
    amount float,
    processed boolean default false,
    draw int
);

create table escalations (
    id int auto_increment primary key,
    development int,
    paymentDate datetime,
    amount float,
    processed boolean default false,
    draw int
);

insert into dashboardCategories (discipline, section, lineNumber) values ('Overs / Unders', 4, 28);

*************************

ALTER TABLE `salesinfo` 
ADD COLUMN `trustName` VARCHAR(45) NULL;

ALTER TABLE `salesinfo` 
ADD COLUMN `trustNumber` VARCHAR(45) NULL;

ALTER TABLE `salesinfo` 
ADD COLUMN `originalBayNo` VARCHAR(45) NULL; 

CREATE TABLE `stocktake` (
  id int auto_increment primary key,
  `stockId` int DEFAULT NULL,
  `itemCode` varchar(45) DEFAULT NULL,
  `reference` varchar(45) DEFAULT NULL,
  `qtyOnHand` int DEFAULT NULL,
  `qtyCounted` int DEFAULT NULL,
  `countCorrect` int DEFAULT 0,
  `stockTakeDate` datetime DEFAULT NULL,
  `supplierId` int DEFAULT NULL,
  `contactId` varchar(115) DEFAULT NULL,
  `stocktakecol` varchar(45) DEFAULT NULL,
  `user` varchar(45) DEFAULT NULL,
  `userId` int DEFAULT NULL
); 

CREATE TABLE `stocktranfers` (
  `transferId` int auto_increment primary key,
  `supplierName` varchar(45) DEFAULT NULL,
  `contactID` varchar(45) DEFAULT NULL,
  `block` varchar(4000) DEFAULT NULL,
  `unit` varchar(4000) DEFAULT NULL,
  `stockId` varchar(45) DEFAULT NULL,
  `qtyTransfered` varchar(45) DEFAULT NULL,
  `stockImageUrl` varchar(45) DEFAULT NULL,
  `transferDate` date DEFAULT NULL,
  `user` varchar(45) DEFAULT NULL,
  `userId` int DEFAULT NULL
);

alter table stockItems add requisitioned int;

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

alter table salesinfo add column planType varchar(160);
















insert into taskTypes (taskName) values 
('Landscaping - Soft'),
('Landscaping - Hard'),
('Metalwork'),
('DSTV / Data'),
('Electric Fencing'),
('CCTV System'),
('Site Signage'),
('Shadenetting (Vehicle Parking)'),
('Powerfloating'),
('Fencing around attenuation dam'),
('Painting of vibracrete walling'),
('Yard gate  - supply and fit'),
('Waterheating'),
('Metalwork');

&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

alter table purchaseOrders add column paid Boolean;
alter table purchaseOrders add column paidAmount float;

alter table tasks add column payDate datetime;
alter table tasks add column actualAmount float;
update tasks set actualAmount = price;

alter table paymentCertificates add column paid Boolean;
alter table paymentCertificates add column paidAmount float;
alter table paymentCertificates add column payDate datetime;
alter table purchaseOrders add column payDate datetime;
alter table paymentCertificatesDetails add column paid Boolean;
alter table paymentCertificatesDetails add column paidAmount float;
alter table paymentCertificatesDetails add column payDate datetime;

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

CREATE TABLE investorDetailsPlanning LIKE investorDetails; 
INSERT investorDetailsPlanning SELECT * FROM investorDetails;

delete from investorDetails where available > 0;
delete from investorDetailsPlanning where available = 0;

INSERT INTO investorDetailsPlanning (unit, investor, available)
SELECT u.id, 'Available' as investor, 0 as available FROM units u 
WHERE u.development = 1 and u.subsection != 7 and length(u.unitName) <= 4 
and u.id not IN (SELECT unit FROM investorDetailsPlanning);

update investorDetails set trust_account_interest = trust_account_interest + supplementary_interest, supplementary_interest = 0;

update investorDetailsPlanning set trust_account_interest = trust_account_interest + supplementary_interest, supplementary_interest = 0;

update investorDetailsPlanning set repayment_date = '2022-05-23' where repayment_date is null and available != 0;

alter table salesData add column smartRow varchar(100);
alter table salesData add column smartColumn varchar(100);

update salesData set smartRow = '1725948637931396', smartColumn = '3634515536045956' where unit = 1; update salesData set smartRow = '6080809387091844', smartColumn = '3634515536045956' where unit = 2; update salesData set smartRow = '1577209759721348', smartColumn = '3634515536045956' where unit = 3; update salesData set smartRow = '7206709293934468', smartColumn = '3634515536045956' where unit = 4; update salesData set smartRow = '2703109666563972', smartColumn = '3634515536045956' where unit = 5; update salesData set smartRow = '4954909480249220', smartColumn = '3634515536045956' where unit = 6; update salesData set smartRow = '451309852878724', smartColumn = '3634515536045956' where unit = 7; update salesData set smartRow = '8614084177487748', smartColumn = '3634515536045956' where unit = 8; update salesData set smartRow = '6060394199574404', smartColumn = '3634515536045956' where unit = 9; update salesData set smartRow = '1556794572203908', smartColumn = '3634515536045956' where unit = 10; update salesData set smartRow = '7186294106417028', smartColumn = '3634515536045956' where unit = 11; update salesData set smartRow = '6362284363802500', smartColumn = '3634515536045956' where unit = 12; update salesData set smartRow = '1858684736432004', smartColumn = '3634515536045956' where unit = 13; update salesData set smartRow = '7488184270645124', smartColumn = '3634515536045956' where unit = 14; update salesData set smartRow = '2984584643274628', smartColumn = '3634515536045956' where unit = 15; update salesData set smartRow = '5236384456959876', smartColumn = '3634515536045956' where unit = 16; update salesData set smartRow = '732784829589380', smartColumn = '3634515536045956' where unit = 17; update salesData set smartRow = '8051134224066436', smartColumn = '3634515536045956' where unit = 18; update salesData set smartRow = '7355448172144516', smartColumn = '3634515536045956' where unit = 19; update salesData set smartRow = '2851848544774020', smartColumn = '3634515536045956' where unit = 20; update salesData set smartRow = '5103648358459268', smartColumn = '3634515536045956' where unit = 21; update salesData set smartRow = '600048731088772', smartColumn = '3634515536045956' where unit = 22; update salesData set smartRow = '7918398125565828', smartColumn = '3634515536045956' where unit = 23; update salesData set smartRow = '3414798498195332', smartColumn = '3634515536045956' where unit = 24; update salesData set smartRow = '5666598311880580', smartColumn = '3634515536045956' where unit = 25; update salesData set smartRow = '800212997564292', smartColumn = '3634515536045956' where unit = 26; update salesData set smartRow = '8118562392041348', smartColumn = '3634515536045956' where unit = 27; update salesData set smartRow = '3614962764670852', smartColumn = '3634515536045956' where unit = 28; update salesData set smartRow = '5866762578356100', smartColumn = '3634515536045956' where unit = 29; update salesData set smartRow = '1363162950985604', smartColumn = '3634515536045956' where unit = 30; update salesData set smartRow = '6992662485198724', smartColumn = '3634515536045956' where unit = 31; update salesData set smartRow = '6346739132327812', smartColumn = '3634515536045956' where unit = 88; update salesData set smartRow = '1843139504957316', smartColumn = '3634515536045956' where unit = 89; update salesData set smartRow = '7472639039170436', smartColumn = '3634515536045956' where unit = 32; update salesData set smartRow = '2969039411799940', smartColumn = '3634515536045956' where unit = 33; update salesData set smartRow = '5220839225485188', smartColumn = '3634515536045956' where unit = 34; update salesData set smartRow = '717239598114692', smartColumn = '3634515536045956' where unit = 35; update salesData set smartRow = '3698560008120196', smartColumn = '3634515536045956' where unit = 36; update salesData set smartRow = '5950359821805444', smartColumn = '3634515536045956' where unit = 37; update salesData set smartRow = '1446760194434948', smartColumn = '3634515536045956' where unit = 38; update salesData set smartRow = '7076259728648068', smartColumn = '3634515536045956' where unit = 39; update salesData set smartRow = '2572660101277572', smartColumn = '3634515536045956' where unit = 40; update salesData set smartRow = '4824459914962820', smartColumn = '3634515536045956' where unit = 41; update salesData set smartRow = '320860287592324', smartColumn = '3634515536045956' where unit = 42; update salesData set smartRow = '8483634612201348', smartColumn = '3634515536045956' where unit = 43; update salesData set smartRow = '3980034984830852', smartColumn = '3634515536045956' where unit = 44; update salesData set smartRow = '117817856157572', smartColumn = '3634515536045956' where unit = 45; update salesData set smartRow = '8913910878365572', smartColumn = '3634515536045956' where unit = 46; update salesData set smartRow = '4410311250995076', smartColumn = '3634515536045956' where unit = 47; update salesData set smartRow = '6662111064680324', smartColumn = '3634515536045956' where unit = 48; update salesData set smartRow = '2158511437309828', smartColumn = '3634515536045956' where unit = 49; update salesData set smartRow = '7788010971522948', smartColumn = '3634515536045956' where unit = 50; update salesData set smartRow = '3284411344152452', smartColumn = '3634515536045956' where unit = 51; update salesData set smartRow = '5536211157837700', smartColumn = '3634515536045956' where unit = 52; update salesData set smartRow = '1032611530467204', smartColumn = '3634515536045956' where unit = 53; update salesData set smartRow = '8948213976852356', smartColumn = '3634515536045956' where unit = 54; update salesData set smartRow = '4444614349481860', smartColumn = '3634515536045956' where unit = 55; update salesData set smartRow = '6696414163167108', smartColumn = '3634515536045956' where unit = 56; update salesData set smartRow = '2192814535796612', smartColumn = '3634515536045956' where unit = 57; update salesData set smartRow = '7822314070009732', smartColumn = '3634515536045956' where unit = 58; update salesData set smartRow = '3318714442639236', smartColumn = '3634515536045956' where unit = 59;

-- ALTER TABLE salesData DROP COLUMN smartRow;
-- ALTER TABLE salesData DROP COLUMN smartColumn;

%%%%%%%%%%%%%%%%%%%%%%

ALTER TABLE investorDetailsPlanning ALTER interest_rate SET DEFAULT 0;
ALTER TABLE investorDetailsPlanning ALTER trust_account_interest SET DEFAULT 0;
ALTER TABLE investorDetailsPlanning ALTER supplementary_interest SET DEFAULT 0;

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

--  access_token: 'jlw06d5tf5l9dqh6b4e6oa5ddk',
--   token_type: 'bearer',
--   refresh_token: 'gblnv7smcr31hrh0adnyj9f46j',
--   expires_in: 604799

CREATE TABLE smartToken (
    id int auto_increment primary key,
    access_token varchar(100),
    token_type varchar(100),
    refresh_token varchar(100),
    expires_in dateTime,
    development int
);


CREATE TABLE smartTaskTypes (
    id int auto_increment primary key,
    taskTypeName varchar(150)
);

CREATE TABLE smartUnits (
    id int auto_increment primary key,
    subsection int,
    development int,
    unitName varchar(160)
);

CREATE TABLE smartTasks (
    id int auto_increment primary key,
    sheetId varchar(160),
    rowId varchar(160),
    subsection int,
    development int,
    unitName varchar(160),
    taskName varchar(160),
  taskType varchar(160),
  startDate datetime,
  endDate dateTime,
  assignedTo varchar(350),
  comments varchar(160),
  subcontractor1 float,
  subcontractor2 float,
  labourCost float,
  materialCost float,
  totalCost float,
  percentComplete float
);

--  duration: '1d',
  
--   taskName: 'WM, DW,Mixers,Sink',
--   taskType: 'Interior Plumbing Works',
--   startDate: '2022-02-14T08:00:00',
--   endDate: '2022-02-14T16:59:59',
--   assignedTo: null,
--   comments: null,
--   subcontractor1: 0,
--   subcontractor2: 0,
--   labourCost: 0,
--   materialCost: 0,
--   totalCost: 0,
--   percentComplete: 0,

 

  
  

CREATE TABLE smartsheetControl (
    id int auto_increment primary key,
    smartsheetId varchar(50),
    development int,
    block int,
    TaskName varchar(50),
    isUnit varchar(50),
    isTaskType varchar(50),
    isTask varchar(50),
    Duration varchar(50),
    StartDate varchar(50),
    EndDate varchar(50),
    Predecessors varchar(50),
    PercentComplete varchar(50),
    Status varchar(50),
    AssignedTo varchar(50),
    Comments varchar(50),
    Subcontractor1 varchar(50),
    Subcontractor2 varchar(50),
    LabourCost varchar(50),
    MaterialCost varchar(50),
    TotalCost varchar(50)
); 

insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(
    "5918862060349316",
    1,
    1,
    "2339800723285892",
    "5413181005817732",
    "3161381192132484",
    "7664980819502980",
    "6843400350656388",
    "1213900816443268",
    "5717500443813764",
    "3465700630128516",
    "7969300257499012",
    "650950863021956",
    "5154550490392452",
    "2902750676707204",
    "5340804095993732",
    "3089004282308484",
    "3405797446182788",
    "5657597259868036",
    "1153997632497540"
);

insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(
    "3689069659088772",
    1,
    2,
    "5272006034777988",
    "5411469998221188",
    "3159670184535940",
    "7663269811906436", 
    "3020206221092740",
    "7523805848463236",
    "1894306314250116",
    "6397905941620612",
    "4146106127935364", 
    "8649705755305860",
    "486931430696836",
    "4990531058067332",
    "8604061460129668", 
    "441287135520644",
    "3279540440065924",
    "5531340253751172",
    "1027740626380676"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(

    "2722152261674884",
    1,
    3,
    "8062635265550212",
    "8296047343626116",
    "977697949149060",
    "5481297576519556",
    "744285871073156",
    "5247885498443652",
    "2996085684758404",
    "7499685312128900",
    "1870185777915780",
    "6373785405286276",
    "4121985591601028",
    "8625585218971524",
    "1154217346918276",
    "5657816974288772",
    "3513687024658308",
    "5765486838343556", 
    "1261887210973060"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(
    "7066683480270724",
    1,
    4,
    "1812736295364484",
    "2425222186985348",
    "6928821814355844",
    "1299322280142724",
    "6316335922734980",
    "4064536109049732",
    "8568135736420228",
    "405361411811204", 
    "4908961039181700",
    "2657161225496452",
    "7160760852866948",
    "1531261318653828",
    "2748199969548164", 
    "7251799596918660",
    "8377726749960068",
    "3874127122589572",
    "6125926936274820"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(
    "4960391252993924",
    1,
    5,
    "3021810190051204",
    "6455619497551748",
    "4203819683866500",
    "8707419311236996",
    "7525409817421700",
    "1895910283208580",
    "6399509910579076", 
    "4147710096893828",
    "8651309724264324",
    "488535399655300",
    "4992135027025796",
    "2740335213340548",
    "8027075553585028",
    "708726159107972",
    "3034246267856772",
    "5286046081542020", 
    "782446454171524"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(     
    "1115914486736772",
    1,
    6,
    "1662779458381700", 
    "8605181909723012",
    "442407585113988",
    "4946007212484484",
    "6166379085752196",
    "3914579272066948",
    "8418178899437444",
    "1099829504960388",
    "5603429132330884",
    "3351629318645636",
    "7855228946016132",
    "2225729411803012",
    "4832761004484484",
    "2580961190799236",
    "192893473318788",
    "8777880262993796",  
    "4274280635623300"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(     


    "6713637168539524",
    1,
    1,
    "7369453313779588",
    "1427674693429124",
    "3775853573236612",
    "8279453200607108",
    "1739953779566468",
    "6243553406936964",
    "3991753593251716", 
    "8495353220622212",
    "332578896013188",
    "4836178523383684",
    "2584378709698436",
    "7087978337068932",
    "7341478514059140",
    "1711978979846020",
    "6886660133676932",
    "2383060506306436",
    "4634860319991684"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(     
    "2316346571679620",
    1,
    2,
    "3530018839127940",
    "2258036290021252",
    "6761635917391748",
    "1132136383178628",
    "8033618466498436",
    "715269072021380",
    "5218868699391876",
    "2967068885706628",
    "7470668513077124", 
    "1841168978864004",
    "6344768606234500",
    "4092968792549252",
    "4663411786180484",
    "2411611972495236",
    "489400835565444",
    "8652175160174468", 
    "4148575532803972"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(     
    "6781428932339588",
    1,
    3,
    "8424300502902660",
    "8789169718749060",
    "204182929074052",
    "4707782556444548",
    "1105951108425604",
    "5609550735796100",
    "3357750922110852",
    "7861350549481348",
    "2231851015268228",
    "6735450642638724",
    "4483650828953476",
    "8987250456323972",
    "1001007273535364",
    "5504606900905860",
    "7953280901900164",
    "3449681274529668",
    "5701481088214916"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(     
    "2563083852900228",
    1,
    4,
    "8638504480597892",
    "5340560088164228",
    "3088760274478980",
    "7592359901849476",
    "475730155988868",
    "4979329783359364",
    "2727529969674116",
    "7231129597044612",
    "1601630062831492",
    "6105229690201988",
    "3853429876516740",
    "8357029503887236",
    "872742370207620", 
    "5376341997578116",
    "1744639387559812",
    "7374138921772932", 
    "2870539294402436"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(     
    "3301577709643652",
    1,
    5,
    "916703038203780",
    "828370526201732",
    "5331970153572228",
    "3080170339886980",
    "5420302665574276",
    "3168502851889028",
    "7672102479259524",
    "2042602945046404",
    "6546202572416900",
    "4294402758731652",
    "8798002386102148",
    "213015596427140",
    "7759378831959940",
    "2129879297746820",
    "4095214859118468",
    "6347014672803716",
    "1843415045433220"
);


insert into smartsheetControl (
 smartsheetId,
    development,
    block,
    TaskName,
    isUnit,
    isTaskType,
    isTask,
    Duration,
    StartDate,
    EndDate,
    Predecessors,
    PercentComplete,
    Status,
    AssignedTo,
    Comments,
    Subcontractor1,
    Subcontractor2,
    LabourCost,
    MaterialCost,
    TotalCost) values
(     
    "3232342836832132",
    1,
    6,
    "2074720710485892",
    "2357198494951300",
    "6860798122321796",
    "1231298588108676",
    "6578320337856388",
    "4326520524171140",
    "8830120151541636",
    "245133361866628",
    "4748732989237124",
    "2496933175551876",
    "7000532802922372",
    "1371033268709252",
    "8795410843101060",
    "210424053426052",
    "4607939464980356",
    "104339837609860",
    "8900432859817860"
);

insert into smartsheetControl (smartsheetId, development, block) values ("3232342836832132", 1, 6);

*******************************

update salesinfo set mood = "Allure" where mood = "Mood1";
update salesinfo set mood = "Serene" where mood = "Mood2";


alter table salesinfo add column actualSalesdate datetime;
alter table salesinfo add column development int;
update salesinfo set development = 1;

********************************

create table smartUploads (
    id int auto_increment primary key,
    uploadUnsignedDoc1 varchar(100),
    uploadUnsignedDoc2 varchar(100),
    uploadUnsignedDoc3 varchar(100),
    uploadUnsignedDoc4 varchar(100),
    uploadUnsignedDoc5 varchar(100),
    uploadUnsignedDocUser varchar(100),
    uploadUnsignedDocDate datetime,
    uploadSignedDoc1 varchar(100),
    uploadSignedDoc2 varchar(100),
    uploadSignedDoc3 varchar(100),
    uploadSignedDoc4 varchar(100),
    uploadSignedDoc5 varchar(100),
    uploadSignedDocUser varchar(100),
    uploadSignedDocDate datetime
);

alter table smartUploads add column submissionNumber Int;

insert into smartUploads (
    uploadUnsignedDoc1,
    uploadUnsignedDoc2,
    uploadUnsignedDoc3,
    uploadUnsignedDoc4,
    uploadUnsignedDoc5,
    uploadUnsignedDocUser,
    uploadUnsignedDocDate,
    uploadSignedDoc1,
    uploadSignedDoc2,
    uploadSignedDoc3,
    uploadSignedDoc4,
    uploadSignedDoc5,
    uploadSignedDocUser,
    uploadSignedDocDate) values (
        "test1",
        "test2",
        "test3",
        "test4",
        "test5",
        "Wayne",
        "2021-11-02",
        "testing1",
        "testing2",
        "testing3",
        "testing4",
        "testing5",
        "Bob",
        "2021-11-03"
    );

    +++++++++++++++++++++++++

    alter table stocktranfers add column development int default 1;

    $$$$$$$$$$$$$$$$$$$$$$$$$$$$

    insert into subsection (development, subsectionName) values
    (1, 'None'),
    (2, 'None');

    insert into units (development, subsection, unitName) values
    (1, 10, 'None'),
    (2, 11, 'None');

    alter table investorDetails add column actionToTake varchar(75);


**********************************************
     alter table smartsheetControl add column sheetName varchar(150);
******************************************

CREATE TABLE `investments` (
  `investment_id` int(11) NOT NULL COMMENT 'TRIAL',
  `investor_id` int(11) NOT NULL COMMENT 'TRIAL',
  `opportunity_id` int(11) NOT NULL COMMENT 'TRIAL',
  `investment_amount` decimal(18,2) DEFAULT NULL COMMENT 'TRIAL',
  `investment_exit_rollover` int(11) DEFAULT NULL COMMENT 'TRIAL',
  `release_date` date DEFAULT NULL COMMENT 'TRIAL',
  `end_date` date DEFAULT NULL COMMENT 'TRIAL',
  `investment_interest_rate` decimal(18,2) DEFAULT NULL COMMENT 'TRIAL',
  `transaction_type` int(11) DEFAULT NULL COMMENT 'TRIAL',
  `blocked` tinyint(1) NOT NULL COMMENT 'TRIAL',
  `datecreated` date NOT NULL COMMENT 'TRIAL',
  `lastupdated` date NOT NULL COMMENT 'TRIAL',
  `trial785` char(1) DEFAULT NULL COMMENT 'TRIAL',
  `repayment_amount` decimal(18,2) DEFAULT NULL,
  `release_percentage` decimal(18,2) DEFAULT NULL,
  `release_amount` decimal(18,2) DEFAULT NULL,
  `linked_unit` varchar(45) DEFAULT NULL,
  `project` varchar(45) DEFAULT NULL,
  `singedLoanAgreementFile` varchar(45) DEFAULT NULL,
  `POPFile` varchar(45) DEFAULT NULL,
  `attorneyConfirmLetterFile` varchar(45) DEFAULT NULL,
  `investment_closed` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='TRIAL';

--
-- Dumping data for table `investments`
--

INSERT INTO `investments` (`investment_id`, `investor_id`, `opportunity_id`, `investment_amount`, `investment_exit_rollover`, `release_date`, `end_date`, `investment_interest_rate`, `transaction_type`, `blocked`, `datecreated`, `lastupdated`, `trial785`, `repayment_amount`, `release_percentage`, `release_amount`, `linked_unit`, `project`, `singedLoanAgreementFile`, `POPFile`, `attorneyConfirmLetterFile`, `investment_closed`) VALUES
(177, 67, 126, '50000.00', NULL, '2018-08-14', '2019-12-02', '21.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(178, 67, 126, '-50000.00', NULL, '2020-01-29', '2020-01-29', '21.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(179, 1, 123, '100000.00', NULL, '2019-07-21', '2020-07-20', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(180, 1, 123, '-100000.00', NULL, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(182, 1, 123, '100000.00', NULL, '2019-08-03', '2019-11-14', '18.00', 2, 1, '2020-05-19', '2020-11-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(185, 1, 132, '105967.12', NULL, '2019-11-14', '2020-07-20', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(186, 2, 115, '250000.00', NULL, '2019-12-11', '2020-10-15', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(187, 2, 115, '-250000.00', NULL, '2019-12-12', '2019-12-12', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(189, 2, 115, '250000.00', NULL, '2019-12-12', '2020-10-15', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(190, 64, 123, '100000.00', NULL, '2019-07-04', '2019-11-14', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(191, 64, 123, '-100000.00', NULL, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(193, 64, 123, '100000.00', NULL, '2019-08-03', '2019-11-14', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(196, 64, 132, '107224.66', NULL, '2019-11-14', '2020-07-20', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(197, 4, 116, '120000.00', NULL, '2019-10-04', '2020-11-30', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(198, 4, 116, '120000.00', 2, '2019-11-01', '2020-11-30', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(199, 4, 116, '-120000.00', 2, '2019-11-01', '2019-11-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(201, 5, 119, '50000.00', NULL, '2019-07-06', '2020-10-14', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(202, 5, 119, '-50000.00', 2, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(204, 5, 119, '50000.00', 2, '2019-08-03', '2020-10-14', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(205, 6, 113, '300000.00', NULL, '2019-09-17', '2020-09-30', '0.00', 5, 0, '2020-05-19', '2021-11-16', 'T', '0.00', '0.00', '0.00', 'null', 'null', NULL, NULL, NULL, NULL),
(206, 6, 113, '-350000.00', 2, '2019-09-18', '2019-09-18', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(208, 6, 113, '350000.00', NULL, '2019-09-18', '2020-09-30', '18.00', 2, 1, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(209, 7, 115, '250000.00', NULL, '2019-07-29', '2020-10-15', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(210, 7, 115, '-250000.00', 2, '2019-08-01', '2019-09-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(212, 7, 115, '250000.00', 2, '2019-09-01', '2020-10-15', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(213, 9, 123, '100000.00', NULL, '2019-07-23', '2020-07-20', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(214, 9, 123, '-100000.00', NULL, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(216, 9, 123, '100000.00', NULL, '2019-08-03', '2019-11-14', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(219, 9, 132, '105819.18', NULL, '2019-11-14', '2020-07-20', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(220, 10, 113, '60528.77', NULL, '2019-09-21', '2020-09-30', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(221, 12, 113, '100000.00', NULL, '2019-09-26', '2020-11-12', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(222, 12, 116, '-100000.00', 2, '2019-11-01', '2019-11-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(224, 12, 116, '100000.00', 2, '2019-10-22', '2020-11-30', '9.00', 5, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(226, 13, 112, '50000.00', NULL, '2019-10-07', '2020-11-30', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(227, 13, 112, '50000.00', 2, '2019-11-01', '2020-11-30', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(228, 13, 112, '-50000.00', 2, '2019-10-31', '2019-10-31', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(231, 16, 125, '450000.00', 2, '2018-08-21', '2020-08-21', '21.00', 2, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(232, 17, 119, '50000.00', NULL, '2019-07-25', '2020-10-14', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(233, 17, 119, '-50000.00', 2, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(235, 17, 119, '50000.00', 2, '2019-08-03', '2020-10-14', '18.00', 2, 1, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(236, 18, 126, '200000.00', NULL, '2018-08-10', '2019-12-02', '21.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(237, 18, 116, '50000.00', NULL, '2018-09-19', '2019-09-30', '21.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(238, 18, 116, '-50000.00', NULL, '2019-10-01', '2019-10-01', '21.00', 4, 1, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(239, 18, 126, '200000.00', NULL, '2019-12-03', '2020-11-02', '18.00', 2, 0, '2020-05-19', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(241, 19, 128, '100000.00', NULL, '2019-10-29', '2020-01-24', '9.00', 5, 1, '2020-05-19', '2021-08-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(242, 19, 128, '-100000.00', 2, '2019-11-01', '2019-11-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(244, 19, 128, '100000.00', 2, '2019-11-01', '2020-01-24', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(249, 19, 114, '100000.00', NULL, '2020-01-25', '2021-01-25', '18.00', 2, 1, '2020-05-19', '2021-07-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(251, 22, 111, '100000.00', NULL, '2019-10-10', '2020-12-31', '18.00', 2, 0, '2020-05-19', '2020-10-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(252, 23, 128, '500000.00', NULL, '2019-09-05', '2020-01-24', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(253, 23, 128, '-500000.00', 2, '2019-10-03', '2019-10-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(255, 23, 128, '500000.00', NULL, '2019-10-03', '2020-01-24', '18.00', 2, 1, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(258, 23, 114, '531438.36', 2, '2020-01-25', '2021-01-24', '18.00', 2, 0, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(261, 68, 120, '100000.00', NULL, '2019-07-19', '2020-02-07', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(262, 68, 120, '-100000.00', 2, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(264, 68, 120, '100000.00', 2, '2019-08-03', '2020-02-07', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(269, 26, 129, '250000.00', NULL, '2018-11-03', '2019-09-20', '21.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(270, 26, 130, '350000.00', NULL, '2019-04-02', '2020-01-31', '21.00', 2, 0, '2020-05-19', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(271, 26, 129, '-250000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(272, 26, 113, '296171.23', NULL, '2019-09-21', '2020-09-30', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(273, 26, 129, '296171.23', NULL, '2019-09-21', '2020-07-22', '18.00', 2, 0, '2020-05-19', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(274, 27, 118, '500000.00', NULL, '2019-09-03', '2020-01-07', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(275, 27, 118, '-500000.00', 2, '2019-09-19', '2019-09-19', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(277, 27, 118, '500000.00', 2, '2019-09-19', '2020-01-07', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(280, 27, 126, '229218.18', NULL, '2020-01-08', '2020-11-02', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(281, 27, 115, '300000.00', NULL, '2020-01-08', '2020-10-15', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(282, 28, 116, '100000.00', NULL, '2019-10-21', '2020-11-30', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(283, 28, 116, '-100000.00', 2, '2019-11-01', '2019-11-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(284, 28, 116, '100000.00', 2, '2019-11-01', '2020-11-30', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(286, 29, 108, '200000.00', NULL, '2019-11-06', '2020-11-17', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(287, 29, 116, '100000.00', NULL, '2019-11-06', '2020-11-30', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(288, 29, 108, '-200000.00', 2, '2019-11-07', '2019-11-07', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(290, 29, 108, '200000.00', 2, '2019-11-07', '2020-11-18', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(291, 29, 116, '100000.00', 2, '2019-12-02', '2020-11-30', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(293, 29, 116, '-100000.00', 2, '2019-12-02', '2019-12-02', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(294, 65, 119, '200000.00', NULL, '2019-07-24', '2020-10-14', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(295, 65, 119, '-200000.00', 2, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(297, 65, 119, '200000.00', 2, '2019-08-03', '2020-10-14', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(298, 30, 110, '100000.00', NULL, '2019-09-19', '2020-09-01', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(300, 30, 110, '100000.00', 2, '2019-09-20', '2020-09-19', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(301, 30, 110, '-100000.00', 2, '2019-09-20', '2019-09-20', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(303, 31, 110, '100000.00', NULL, '2019-09-16', '2020-09-01', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(304, 31, 110, '-100000.00', 2, '2019-09-19', '2019-09-19', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(306, 31, 110, '100000.00', 2, '2019-09-19', '2020-09-01', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(307, 32, 128, '450000.00', NULL, '2018-10-12', '2019-09-20', '21.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(314, 32, 114, '450000.00', 2, '2020-01-25', '2021-01-25', '18.00', 2, 0, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(315, 66, 121, '-100000.00', NULL, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(317, 66, 121, '100000.00', NULL, '2019-08-02', '2020-03-13', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(318, 66, 121, '100000.00', NULL, '2019-08-03', '2020-03-13', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(319, 33, 116, '500000.00', NULL, '2019-11-12', '2020-11-30', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(320, 33, 116, '500000.00', 2, '2019-12-02', '2020-11-30', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(321, 33, 116, '-500000.00', 2, '2019-12-02', '2019-12-02', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(323, 34, 108, '200000.00', NULL, '2019-08-15', '2020-11-12', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(324, 34, 108, '-200000.00', NULL, '2019-09-01', '2019-09-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(326, 34, 108, '200000.00', NULL, '2019-09-01', '2020-11-12', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(327, 35, 131, '150000.00', 2, '2019-12-06', '2020-12-06', '9.00', 5, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(328, 35, 131, '-150000.00', 2, '2019-12-11', '2019-12-11', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(330, 35, 131, '150000.00', 2, '2019-12-11', '2020-12-06', '18.00', 2, 0, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(331, 36, 112, '150000.00', NULL, '2019-12-06', '2020-11-30', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(332, 36, 112, '-150000.00', 2, '2019-12-11', '2019-12-11', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(334, 36, 112, '150000.00', 2, '2019-12-11', '2020-11-30', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(335, 37, 118, '-450000.00', 2, '2019-09-09', '2020-01-07', '21.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(337, 37, 118, '450000.00', NULL, '2018-09-19', '2019-05-22', '21.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(339, 38, 110, '150000.00', NULL, '2019-08-14', '2020-09-01', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(340, 38, 110, '-150000.00', 2, '2019-09-01', '2019-09-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(342, 38, 110, '150000.00', 2, '2019-09-01', '2020-09-01', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(343, 39, 109, '450000.00', 2, '2019-10-03', '2020-01-13', '18.00', 2, 0, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(344, 39, 112, '600000.00', NULL, '2019-10-03', '2020-11-30', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(345, 39, 109, '-450000.00', 2, '2020-01-14', '2020-01-14', '18.00', 4, 1, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(346, 40, 115, '150000.00', NULL, '2019-07-26', '2020-10-15', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(347, 40, 115, '-150000.00', 2, '2019-09-01', '2019-09-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(349, 40, 115, '150000.00', 2, '2019-09-01', '2020-10-15', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(350, 69, 114, '450000.00', NULL, '2018-11-08', '2019-05-22', '21.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(351, 69, 114, '-450000.00', 2, '2019-05-22', '2019-05-22', '21.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(352, 41, 112, '250000.00', NULL, '2019-01-18', '2019-09-30', '21.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(353, 41, 112, '-250000.00', 2, '2019-09-30', '2019-09-30', '21.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(354, 42, 111, '50000.00', 2, '2019-10-21', '2020-12-31', '9.00', 5, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(355, 42, 111, '-50000.00', 2, '2019-11-01', '2019-11-01', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(356, 42, 111, '50000.00', NULL, '2019-11-01', '2020-12-31', '18.00', 2, 0, '2020-05-19', '2020-11-11', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(358, 43, 129, '200000.00', NULL, '2019-02-14', '2019-09-20', '21.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(360, 43, 129, '225084.93', NULL, '2019-09-21', '2020-07-22', '18.00', 2, 0, '2020-05-19', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(361, 46, 111, '100000.00', NULL, '2019-09-12', '2020-12-31', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(362, 46, 111, '-100000.00', 2, '2019-09-19', '2019-09-19', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(364, 46, 111, '100000.00', 2, '2019-09-19', '2020-12-31', '18.00', 2, 1, '2020-05-19', '2021-04-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(365, 47, 113, '100000.00', NULL, '2019-11-29', '2020-09-30', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(367, 47, 113, '-100000.00', NULL, '2019-12-11', '2019-12-11', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(368, 47, 113, '100000.00', NULL, '2019-12-11', '2020-09-30', '18.00', 2, 1, '2020-05-19', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(387, 70, 123, '100000.00', NULL, '2019-07-10', '2019-11-13', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(388, 70, 123, '-100000.00', 2, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(390, 70, 123, '100000.00', 2, '2019-08-03', '2019-11-13', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(393, 49, 107, '450000.00', 2, '2019-01-25', '2019-09-21', '21.00', 2, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(395, 49, 110, '450000.00', 2, '2019-01-25', '2019-09-20', '21.00', 2, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(396, 49, 121, '500000.00', 2, '2019-07-10', '2020-03-13', '9.00', 5, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(397, 49, 121, '-500000.00', 2, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(399, 49, 121, '500000.00', 2, '2019-08-03', '2020-03-14', '18.00', 2, 1, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(400, 49, 107, '-450000.00', 2, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(402, 49, 110, '-450000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(403, 49, 107, '511619.18', NULL, '2019-09-21', '2020-06-25', '18.00', 2, 0, '2020-05-19', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(404, 49, 110, '511619.18', NULL, '2019-09-21', '2020-11-12', '18.00', 2, 0, '2020-05-19', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(406, 50, 111, '800000.00', NULL, '2019-08-09', '2020-12-31', '9.00', 5, 1, '2020-05-19', '2021-07-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(407, 50, 107, '-500000.00', NULL, '2019-09-19', '2019-09-19', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(408, 50, 111, '-800000.00', NULL, '2019-09-19', '2019-09-19', '9.00', 1, 1, '2020-05-19', '2021-07-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(411, 50, 107, '500000.00', NULL, '2019-09-18', '2019-09-18', '9.00', 5, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(414, 50, 115, '100000.00', 2, '2019-09-20', '2020-10-15', '9.00', 5, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(415, 50, 115, '-100000.00', 2, '2019-09-21', '2019-09-21', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(416, 50, 115, '100000.00', 2, '2019-09-21', '2020-10-15', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(418, 50, 117, '500000.00', 2, '2019-11-06', '2020-11-02', '18.00', 2, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(419, 50, 126, '500000.00', 2, '2019-11-06', '2020-11-02', '9.00', 5, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(420, 50, 126, '500000.00', 2, '2019-12-02', '2020-11-02', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(421, 50, 126, '-500000.00', 2, '2019-12-02', '2019-12-02', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(423, 51, 129, '300000.00', NULL, '2019-09-20', '2020-09-30', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(424, 51, 129, '-300000.00', 2, '2019-10-03', '2019-10-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(426, 51, 129, '300000.00', 2, '2019-10-03', '2020-09-30', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(427, 52, 113, '50000.00', NULL, '2018-11-16', '2019-09-20', '21.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(428, 52, 113, '-50000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-05-19', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(429, 52, 113, '58860.27', NULL, '2019-09-21', '2020-09-30', '18.00', 2, 0, '2020-05-19', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(430, 53, 110, '100000.00', NULL, '2019-09-11', '2020-09-01', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(431, 53, 110, '-100000.00', 2, '2019-09-19', '2019-09-19', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(433, 53, 110, '100000.00', 2, '2019-09-19', '2020-09-01', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(434, 54, 119, '300000.00', NULL, '2019-07-11', '2019-10-14', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(435, 54, 119, '-300000.00', 2, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(437, 54, 119, '300000.00', 2, '2019-08-03', '2020-10-14', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(438, 55, 116, '50000.00', NULL, '2018-08-15', '2019-09-20', '21.00', 2, 0, '2020-05-19', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(440, 55, 116, '61535.62', NULL, '2019-09-21', '2020-11-30', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(441, 56, 123, '200000.00', NULL, '2019-07-03', '2019-08-02', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(442, 56, 123, '-200000.00', NULL, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(444, 56, 123, '200000.00', NULL, '2019-08-03', '2019-11-13', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(447, 56, 132, '214597.26', NULL, '2019-11-14', '2020-07-20', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(448, 80, 120, '510000.00', NULL, '2019-07-04', '2020-02-07', '9.00', 5, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(449, 80, 120, '-10000.00', NULL, '2019-07-04', '2019-07-04', '9.00', 5, 0, '2020-05-19', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(450, 80, 120, '-500000.00', 2, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(452, 80, 120, '500000.00', 2, '2019-08-03', '2020-02-07', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(456, 57, 116, '50000.00', NULL, '2018-10-16', '2019-09-20', '21.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(457, 57, 116, '-50000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-05-19', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(458, 57, 116, '59752.05', NULL, '2019-09-21', '2020-11-30', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(459, 58, 118, '100000.00', NULL, '2019-09-12', '2020-01-07', '9.00', 5, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(460, 58, 118, '-100000.00', NULL, '2019-09-19', '2019-09-19', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(462, 58, 118, '100000.00', NULL, '2019-09-19', '2020-01-07', '18.00', 2, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(465, 58, 129, '105621.92', NULL, '2020-01-08', '2020-07-22', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(482, 60, 115, '450000.00', NULL, '2018-08-10', '2019-09-20', '21.00', 2, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(483, 60, 120, '450000.00', NULL, '2019-05-29', '2020-02-07', '9.00', 5, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(485, 60, 120, '450000.00', NULL, '2019-05-30', '2020-02-08', '18.00', 2, 1, '2020-05-19', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(486, 60, 120, '-450000.00', NULL, '2019-05-30', '2019-05-30', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(488, 60, 122, '150000.00', NULL, '2019-05-29', '2019-05-30', '9.00', 5, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(496, 62, 130, '500000.00', NULL, '2019-10-19', '2020-10-31', '9.00', 5, 0, '2020-05-19', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(497, 63, 122, '-700000.00', NULL, '2019-08-03', '2019-08-03', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(499, 63, 122, '700000.00', NULL, '2019-08-02', '2020-07-13', '9.00', 1, 1, '2020-05-19', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(500, 63, 122, '700000.00', NULL, '2019-08-03', '2020-07-13', '18.00', 2, 0, '2020-05-19', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(524, 32, 122, '150000.00', NULL, '2019-06-01', '2020-07-13', '18.00', 2, 0, '2020-07-20', '2020-12-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(555, 26, 130, '411216.44', NULL, '2020-02-01', '2020-07-06', '18.00', 2, 0, '2020-09-02', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(564, 16, 125, '588254.79', 2, '2020-02-01', '2020-07-17', '18.00', 2, 0, '2020-09-02', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(565, 16, 125, '-588254.79', NULL, '2020-07-18', '2020-07-18', '18.00', 4, 1, '2020-09-02', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(571, 53, 110, '-100000.00', 2, '2020-09-02', '2020-09-02', '18.00', 4, 1, '2020-09-02', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(573, 31, 110, '-100000.00', 2, '2020-09-02', '2020-09-02', '18.00', 4, 1, '2020-09-02', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(575, 30, 110, '-100000.00', 2, '2020-09-02', '2020-09-02', '18.00', 4, 1, '2020-09-02', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(577, 38, 110, '-150000.00', 2, '2020-09-02', '2020-09-02', '18.00', 4, 1, '2020-09-02', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(581, 62, 130, '-500000.00', NULL, '2019-11-01', '2019-11-01', '9.00', 1, 1, '2020-10-22', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(594, 49, 107, '-511619.18', 2, '2020-06-26', '2020-06-26', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(595, 50, 107, '500000.00', 2, '2019-09-19', '2020-06-26', '18.00', 2, 1, '2020-11-17', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(600, 12, 116, '-100000.00', 2, '2020-11-18', '2020-11-18', '18.00', 2, 1, '2020-11-17', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(601, 29, 108, '-200000.00', 2, '2020-11-18', '2020-11-18', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(602, 34, 108, '-200000.00', 2, '2020-11-18', '2020-11-18', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(603, 49, 110, '-511619.18', NULL, '2020-09-01', '2020-09-01', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(605, 6, 113, '-350000.00', NULL, '2020-10-01', '2020-10-01', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(606, 10, 113, '-60528.77', NULL, '2020-10-01', '2020-10-01', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(607, 26, 113, '-296171.23', NULL, '2020-10-01', '2020-10-01', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(608, 47, 113, '-100000.00', NULL, '2020-10-01', '2020-10-01', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(610, 52, 113, '-58860.27', NULL, '2020-10-01', '2020-10-01', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(611, 60, 115, '-450000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 1, '2020-11-17', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(612, 2, 115, '-250000.00', NULL, '2020-10-16', '2020-10-16', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(613, 7, 115, '-250000.00', NULL, '2020-10-16', '2020-10-16', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(614, 27, 115, '-300000.00', NULL, '2020-10-16', '2020-10-16', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(615, 40, 115, '-150000.00', NULL, '2020-10-16', '2020-10-16', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(616, 50, 115, '-100000.00', NULL, '2020-10-16', '2020-10-16', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(617, 55, 116, '-50000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-11-17', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(621, 50, 117, '-500000.00', NULL, '2020-11-03', '2020-11-03', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(622, 27, 118, '-500000.00', NULL, '2020-01-08', '2020-01-08', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(623, 58, 118, '-100000.00', NULL, '2020-01-08', '2020-01-08', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(624, 5, 119, '-50000.00', NULL, '2020-10-15', '2020-10-15', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(625, 17, 119, '-50000.00', NULL, '2020-10-15', '2020-10-15', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(626, 54, 119, '-300000.00', NULL, '2020-10-15', '2020-10-15', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(628, 65, 119, '-200000.00', NULL, '2020-10-15', '2020-10-15', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(630, 60, 120, '-450000.00', NULL, '2020-02-08', '2020-02-08', '18.00', 4, 1, '2020-11-17', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(631, 68, 120, '-100000.00', NULL, '2020-02-08', '2020-02-08', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(632, 80, 120, '-500000.00', NULL, '2020-02-08', '2020-02-08', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(633, 49, 121, '-500000.00', NULL, '2020-03-14', '2020-03-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(635, 66, 121, '-100000.00', NULL, '2020-03-14', '2020-03-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(636, 60, 122, '-150000.00', NULL, '2019-05-30', '2019-05-30', '9.00', 1, 1, '2020-11-17', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(637, 60, 122, '150000.00', NULL, '2019-05-30', '2020-07-13', '18.00', 2, 1, '2020-11-17', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(638, 32, 122, '-150000.00', NULL, '2020-07-14', '2020-07-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(640, 63, 122, '-700000.00', NULL, '2020-07-14', '2020-07-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(641, 60, 122, '-150000.00', NULL, '2020-07-14', '2020-07-14', '18.00', 4, 1, '2020-11-17', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(643, 1, 123, '-100000.00', NULL, '2019-11-14', '2019-11-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(644, 9, 123, '-100000.00', NULL, '2019-11-14', '2019-11-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(645, 56, 123, '-200000.00', NULL, '2019-11-14', '2019-11-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(647, 64, 123, '-100000.00', NULL, '2019-11-14', '2019-11-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(648, 70, 123, '-100000.00', NULL, '2019-11-14', '2019-11-14', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(650, 18, 126, '-200000.00', NULL, '2019-12-03', '2019-12-03', '21.00', 4, 0, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(651, 27, 126, '-229218.18', 2, '2020-11-03', '2020-11-03', '18.00', 4, 1, '2020-11-17', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(652, 18, 126, '-200000.00', NULL, '2020-11-03', '2020-11-03', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(654, 50, 126, '-500000.00', NULL, '2020-11-03', '2020-11-03', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(656, 32, 128, '450000.00', NULL, '2019-09-21', '2019-09-21', '18.00', 2, 0, '2020-11-17', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(657, 32, 128, '-450000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-11-17', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(658, 23, 128, '-500000.00', NULL, '2020-01-25', '2020-01-25', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(659, 32, 128, '-450000.00', NULL, '2020-01-25', '2020-01-25', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(660, 43, 129, '-200000.00', NULL, '2019-09-20', '2019-09-20', '21.00', 4, 0, '2020-11-17', '2020-12-11', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(665, 26, 129, '-296171.23', NULL, '2020-07-23', '2020-07-23', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(666, 43, 129, '-225084.93', NULL, '2020-07-23', '2020-07-23', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(667, 51, 129, '-300000.00', NULL, '2020-07-23', '2020-07-23', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(668, 58, 129, '-105621.92', NULL, '2020-07-23', '2020-07-23', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(670, 62, 130, '500000.00', NULL, '2019-11-01', '2020-07-06', '18.00', 2, 1, '2020-11-17', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(671, 26, 130, '-350000.00', NULL, '2020-02-01', '2020-02-01', '21.00', 4, 0, '2020-11-17', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(673, 26, 130, '-411216.44', NULL, '2020-07-07', '2020-07-07', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(674, 62, 130, '-500000.00', NULL, '2020-07-07', '2020-07-07', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(676, 1, 132, '-105967.12', NULL, '2020-07-21', '2020-07-21', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(677, 9, 132, '-105819.18', NULL, '2020-07-21', '2020-07-21', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(678, 56, 132, '-214597.26', NULL, '2020-07-21', '2020-07-21', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(680, 64, 132, '-107224.66', 2, '2020-07-21', '2020-07-21', '18.00', 4, 1, '2020-11-17', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(682, 13, 112, '-50000.00', NULL, '2020-12-04', '2020-12-04', '18.00', 4, 1, '2020-12-03', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(686, 57, 116, '-59752.05', 2, '2020-12-02', '2020-12-02', '18.00', 4, 1, '2020-12-03', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(687, 55, 116, '-61535.62', 2, '2020-12-02', '2020-12-02', '18.00', 4, 1, '2020-12-03', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(689, 12, 116, '-100000.00', 2, '2020-12-02', '2020-12-02', '18.00', 4, 1, '2020-12-03', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(690, 39, 112, '-600000.00', 2, '2020-12-04', '2020-12-04', '18.00', 4, 1, '2020-12-03', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(691, 36, 112, '-150000.00', 2, '2020-12-04', '2020-12-04', '18.00', 4, 1, '2020-12-03', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(692, 33, 116, '-500000.00', NULL, '2020-12-02', '2020-12-02', '18.00', 4, 1, '2020-12-03', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(693, 29, 116, '-100000.00', 2, '2020-12-02', '2020-12-02', '18.00', 4, 1, '2020-12-03', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(703, 4, 116, '-120000.00', NULL, '2020-12-02', '2020-12-02', '18.00', 4, 1, '2020-12-03', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(704, 28, 116, '-100000.00', 2, '2020-12-02', '2020-12-02', '18.00', 4, 0, '2020-12-03', '2020-12-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(705, 16, 127, '450000.00', 2, '2018-08-21', '2020-06-24', '21.00', 2, 0, '2020-12-07', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(706, 16, 127, '-450000.00', 2, '2020-06-24', '2020-06-24', '21.00', 4, 1, '2020-12-07', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(707, 50, 107, '-500000.00', 2, '2020-06-26', '2020-06-26', '18.00', 4, 1, '2020-12-07', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(708, 49, 108, '450000.00', NULL, '2019-01-25', '2019-09-21', '21.00', 2, 0, '2020-12-07', '2021-02-01', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(709, 49, 108, '-450000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 1, '2020-12-07', '2021-02-01', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(710, 49, 108, '511619.18', NULL, '2019-09-21', '2020-11-18', '18.00', 2, 0, '2020-12-07', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(711, 49, 108, '-511619.18', 2, '2020-11-18', '2020-11-18', '18.00', 4, 1, '2020-12-07', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(712, 16, 125, '-450000.00', NULL, '2020-02-01', '2020-02-01', '21.00', 4, 0, '2020-12-07', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(713, 61, 129, '100000.00', NULL, '2019-12-09', NULL, '9.00', 5, 0, '2020-12-08', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(714, 61, 129, '-100000.00', NULL, '2019-12-10', '2019-12-10', '9.00', 1, 1, '2020-12-08', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(715, 61, 129, '100000.00', NULL, '2019-12-10', NULL, '18.00', 2, 1, '2020-12-08', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(716, 61, 129, '-100000.00', 2, '2020-07-23', '2020-07-23', '18.00', 4, 1, '2020-12-08', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(717, 46, 108, '100000.00', 2, '2019-09-26', '2020-11-18', '18.00', 2, 0, '2020-12-08', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(718, 46, 108, '-100000.00', 2, '2020-11-18', '2020-11-18', '18.00', 4, 1, '2020-12-08', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(719, 46, 116, '100000.00', 1, '2019-10-22', NULL, '9.00', 5, 0, '2020-12-08', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(720, 46, 116, '-100000.00', 1, '2019-11-01', '2019-11-01', '9.00', 1, 1, '2020-12-08', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(721, 46, 116, '100000.00', NULL, '2019-11-01', '2020-12-02', '18.00', 2, 1, '2020-12-08', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(722, 46, 116, '-100000.00', 2, '2020-12-02', '2020-12-02', '18.00', 4, 1, '2020-12-08', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(724, 59, 83, '605352.40', NULL, '2020-12-01', '2022-12-03', '18.00', 2, 1, '2020-12-09', '2021-04-12', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(726, 48, 124, '450000.00', NULL, '2018-08-16', '2020-02-01', '21.00', 2, 0, '2020-12-11', '2020-12-11', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(727, 48, 124, '-450000.00', NULL, '2019-11-01', '2019-11-01', '21.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(728, 48, 109, '450000.00', NULL, '2019-02-06', '2022-12-11', '21.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(729, 48, 109, '-450000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(730, 48, 112, '200000.00', NULL, '2019-02-06', '2020-02-01', '21.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(731, 48, 112, '-200000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(732, 48, 113, '50000.00', NULL, '2019-02-06', '2020-02-01', '21.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(733, 48, 113, '-50000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(734, 48, 116, '300000.00', NULL, '2018-08-16', '2020-02-01', '21.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(735, 48, 116, '-300000.00', NULL, '2019-10-01', '2019-10-01', '21.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(736, 48, 117, '450000.00', NULL, '2018-08-16', '2020-02-01', '21.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(737, 48, 117, '-450000.00', NULL, '2019-09-21', '2019-09-21', '21.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(738, 48, 109, '508512.33', NULL, '2019-09-21', '2020-02-01', '18.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(739, 48, 109, '-508512.33', NULL, '2020-01-14', '2020-01-14', '18.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(740, 48, 110, '100000.00', NULL, '2020-08-24', '2022-12-11', '18.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(741, 48, 110, '-100000.00', NULL, '2020-09-02', '2020-09-02', '18.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(742, 48, 112, '226005.48', NULL, '2019-09-21', '2022-12-11', '18.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(743, 48, 112, '-226005.48', NULL, '2020-12-04', '2020-12-04', '18.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(744, 48, 113, '56501.37', NULL, '2019-09-21', '2020-02-01', '18.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `investments` (`investment_id`, `investor_id`, `opportunity_id`, `investment_amount`, `investment_exit_rollover`, `release_date`, `end_date`, `investment_interest_rate`, `transaction_type`, `blocked`, `datecreated`, `lastupdated`, `trial785`, `repayment_amount`, `release_percentage`, `release_amount`, `linked_unit`, `project`, `singedLoanAgreementFile`, `POPFile`, `attorneyConfirmLetterFile`, `investment_closed`) VALUES
(745, 48, 113, '150000.00', NULL, '2020-08-24', '2022-12-11', '18.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(746, 48, 113, '-56501.37', 2, '2020-10-01', '2020-10-01', '18.00', 4, 1, '2020-12-11', '2020-12-11', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(748, 48, 113, '-150000.00', NULL, '2020-10-01', '2020-10-01', '18.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(749, 48, 117, '553561.64', NULL, '2019-09-21', '2020-02-01', '18.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(750, 48, 117, '-553561.64', NULL, '2020-11-03', '2020-11-03', '18.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(751, 48, 125, '576345.21', NULL, '2019-12-18', '2020-02-01', '18.00', 2, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(752, 48, 125, '-576345.21', NULL, '2020-07-18', '2020-07-18', '18.00', 4, 0, '2020-12-11', '2020-12-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(753, 48, 126, '150000.00', 2, '2020-08-24', '2022-12-11', '18.00', 2, 1, '2020-12-11', '2020-12-11', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(754, 48, 126, '-150000.00', 2, '2020-11-03', '2020-11-03', '18.00', 4, 1, '2020-12-11', '2020-12-11', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(759, 32, 114, '-450000.00', 2, '2021-01-29', '2021-01-29', '18.00', 4, 1, '2021-02-04', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(760, 23, 114, '-531438.36', 2, '2021-01-29', '2021-01-29', '18.00', 4, 1, '2021-02-04', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(761, 35, 131, '-150000.00', 2, '2021-01-07', '2021-01-07', '18.00', 4, 1, '2021-02-04', '2021-02-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(774, 42, 111, '-50000.00', 2, '2021-02-18', '2021-02-18', '18.00', 4, 1, '2021-03-05', '2021-03-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(808, 36, 98, '176482.19', NULL, '2021-06-15', NULL, '18.00', 2, 1, '2021-03-05', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(877, 26, 83, '350942.62', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(878, 26, 93, '442851.94', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(879, 26, 99, '340718.63', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(880, 50, 84, '294523.46', NULL, '2020-12-15', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(881, 50, 85, '500000.00', NULL, '2020-12-02', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(882, 50, 85, '500000.00', NULL, '2020-12-22', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(883, 50, 94, '569164.39', NULL, '2020-12-19', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(884, 18, 93, '200000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(885, 58, 86, '117237.44', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(886, 27, 86, '263016.87', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(887, 27, 86, '500000.00', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(888, 125, 88, '1000000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-12', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(889, 125, 106, '200000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(890, 126, 89, '1000000.00', NULL, '2021-02-20', '2021-11-30', '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(891, 126, 90, '1000000.00', NULL, '2021-02-20', '2021-11-30', '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(892, 126, 91, '1000000.00', NULL, '2021-02-20', '2021-11-30', '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(893, 126, 97, '1000000.00', NULL, '2021-02-20', '2021-11-30', '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(894, 81, 92, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(895, 81, 102, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(896, 108, 92, '100000.00', NULL, '2021-02-20', NULL, '15.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(897, 102, 92, '600000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(898, 21, 92, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(899, 130, 92, '100000.00', NULL, '2021-02-20', NULL, '15.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(900, 19, 93, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(901, 9, 93, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(902, 32, 93, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(904, 49, 101, '517080.94', NULL, '2021-01-28', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(905, 129, 95, '500000.00', NULL, '2021-02-20', '2021-11-30', '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(906, 62, 95, '281315.07', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(910, 56, 98, '240948.63', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(911, 127, 99, '100000.00', NULL, '2021-02-20', NULL, '15.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(912, 1, 100, '118979.31', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(913, 64, 100, '120391.26', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(914, 43, 100, '258940.17', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(915, 31, 100, '117210.96', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(916, 31, 100, '32789.04', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(917, 51, 100, '320000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(918, 60, 102, '500000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(919, 68, 102, '109665.75', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(920, 128, 102, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(921, 117, 102, '100000.00', NULL, '2021-02-20', NULL, '15.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(922, 72, 106, '204000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(923, 23, 103, '500000.00', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(924, 120, 103, '100000.00', NULL, '2021-02-20', NULL, '15.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(925, 122, 103, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(926, 46, 103, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(927, 46, 111, '-100000.00', 2, '2021-03-09', '2021-03-09', '18.00', 4, 1, '2021-04-08', '2021-04-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(929, 93, 104, '150000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(930, 106, 104, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(931, 131, 104, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(932, 47, 104, '100000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(933, 132, 104, '350000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(934, 198, 101, '50000.00', NULL, '2021-02-20', NULL, '18.00', 2, 1, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(935, 63, 87, '819268.49', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-10', '2021-04-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(936, 63, 87, '200000.00', NULL, '2021-02-13', NULL, '18.00', 2, 1, '2021-04-10', '2021-04-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(937, 59, 106, '553419.26', NULL, '2020-11-26', NULL, '18.00', 2, 1, '2021-04-22', '2021-09-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(938, 18, 84, '200000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(939, 183, 84, '500000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(940, 48, 98, '237477.35', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(941, 48, 98, '155252.05', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(942, 48, 98, '100443.84', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(943, 73, 101, '130000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(944, 66, 101, '100000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(945, 139, 133, '400000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(946, 49, 133, '498918.83', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(947, 137, 135, '200000.00', NULL, '2021-05-01', NULL, '15.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(948, 133, 138, '110000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(949, 133, 145, '110000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(950, 133, 147, '110000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(951, 133, 151, '110000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(952, 6, 139, '405157.53', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(953, 2, 140, '280000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(954, 17, 140, '60898.63', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(955, 17, 140, '39101.37', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(956, 65, 140, '200000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(957, 55, 153, '50000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(958, 28, 144, '120000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(959, 19, 146, '100000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(960, 19, 149, '100000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(961, 19, 152, '100000.00', NULL, '2021-05-01', NULL, '18.00', 2, 1, '2021-05-10', '2021-05-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(962, 49, 154, '618344.34', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(963, 141, 134, '900000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(964, 141, 135, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(965, 138, 135, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(966, 187, 135, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(967, 170, 136, '900000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(968, 170, 137, '150000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(969, 170, 160, '500100.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(970, 170, 168, '900000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(971, 170, 169, '900000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(972, 170, 173, '900000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(973, 219, 137, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(974, 166, 137, '110000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(975, 166, 145, '110000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(976, 166, 151, '110000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(977, 166, 152, '110000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(978, 166, 157, '110000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(979, 28, 137, '120000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(980, 28, 148, '120000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(981, 28, 150, '120000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(982, 28, 157, '100000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(983, 157, 138, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(984, 167, 138, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(985, 5, 138, '61132.88', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(986, 5, 138, '38867.12', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(987, 195, 139, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(988, 195, 171, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(989, 27, 140, '341424.66', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(990, 7, 141, '250000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(991, 128, 141, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(992, 135, 141, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(993, 142, 141, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(994, 134, 142, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(995, 134, 143, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(996, 145, 144, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(997, 168, 142, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(998, 144, 142, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(999, 143, 142, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1000, 148, 143, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1001, 169, 143, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1002, 140, 153, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1003, 153, 153, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1004, 33, 155, '592342.47', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1005, 33, 146, '600000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1006, 159, 155, '300000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1007, 71, 156, '500500.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1008, 163, 156, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1009, 164, 156, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1010, 165, 156, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1011, 151, 162, '350000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1012, 150, 144, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1013, 155, 162, '150000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1014, 204, 159, '500100.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1015, 192, 160, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1016, 156, 162, '100000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1017, 156, 163, '900000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1018, 19, 144, '100000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1019, 19, 145, '100000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1020, 147, 145, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1021, 205, 145, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1022, 173, 146, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1023, 180, 146, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1024, 32, 148, '531887.67', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1025, 176, 148, '150000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1026, 175, 147, '150000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1027, 181, 149, '400000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1028, 179, 149, '300000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1029, 190, 149, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1030, 206, 150, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1031, 183, 150, '300000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1032, 183, 167, '600000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1033, 183, 176, '900000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1034, 177, 151, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1035, 154, 152, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1036, 199, 152, '600000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1037, 199, 171, '400000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1038, 209, 157, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1039, 210, 164, '100000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1040, 193, 166, '150000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1041, 194, 166, '250000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1042, 197, 167, '150000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1043, 188, 172, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1044, 196, 174, '500000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1045, 184, 175, '700000.00', NULL, '2021-06-05', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1046, 211, 175, '200000.00', NULL, '2021-06-05', NULL, '15.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1047, 212, 81, '500000.00', NULL, '2021-06-07', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1048, 183, 95, '200000.00', NULL, '2021-06-07', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1049, 183, 96, '500000.00', NULL, '2021-06-07', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1050, 50, 79, '844602.74', NULL, '2021-06-07', NULL, '18.00', 2, 1, '2021-06-10', '2021-06-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1051, 35, 101, '179145.21', NULL, '2021-06-15', NULL, '18.00', 2, 1, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1052, 149, 104, '100000.00', NULL, '2021-06-15', NULL, '18.00', 2, 1, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1053, 7, 82, '250000.00', NULL, '2021-06-15', NULL, '18.00', 2, 1, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1054, 214, 103, '125000.00', NULL, '2021-06-15', NULL, '18.00', 2, 1, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1055, 214, 104, '125000.00', NULL, '2021-06-15', NULL, '18.00', 2, 1, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1056, 221, 78, '550000.00', NULL, '2021-06-15', NULL, '18.00', 2, 1, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1057, 215, 82, '400000.00', NULL, '2021-06-15', NULL, '15.00', 2, 1, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1058, 218, 78, '100000.00', NULL, '2021-06-15', NULL, '15.00', 2, 1, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1059, 174, 164, '800000.00', NULL, '2021-07-01', NULL, '18.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1060, 23, 147, '628145.58', NULL, '2021-07-01', NULL, '18.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1061, 29, 153, '118641.10', NULL, '2021-07-01', NULL, '18.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1062, 31, 154, '200000.00', NULL, '2021-07-01', NULL, '18.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1063, 191, 166, '500000.00', NULL, '2021-07-01', NULL, '18.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1064, 48, 137, '100000.00', NULL, '2021-07-01', NULL, '18.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1065, 48, 141, '140000.00', NULL, '2021-07-01', NULL, '18.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1066, 52, 137, '69774.43', NULL, '2021-07-01', NULL, '18.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1067, 158, 143, '100000.00', NULL, '2021-07-01', NULL, '15.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1068, 160, 154, '100000.00', NULL, '2021-07-01', NULL, '15.00', 2, 1, '2021-07-05', '2021-07-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1069, 19, 114, '-100000.00', 2, '2020-01-25', '2021-01-29', '18.00', 4, 1, '2021-07-07', '2021-07-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1070, 19, 128, '-100000.00', 2, '2020-01-25', '2020-01-25', '18.00', 4, 1, '2021-07-07', '2021-07-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1071, 81, 54, '100000.00', NULL, '2021-08-03', NULL, '18.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1072, 232, 46, '100000.00', NULL, '2021-08-03', NULL, '15.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1073, 228, 46, '500000.00', NULL, '2021-08-03', NULL, '18.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1074, 235, 48, '100000.00', NULL, '2021-08-03', NULL, '15.00', 2, 1, '2021-08-03', '2021-09-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1075, 223, 47, '500000.00', NULL, '2021-08-03', NULL, '18.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1076, 227, 47, '500000.00', NULL, '2021-08-03', NULL, '18.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1077, 225, 49, '1000000.00', NULL, '2021-08-03', NULL, '18.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1078, 225, 50, '1000000.00', NULL, '2021-08-03', NULL, '18.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1079, 230, 54, '100000.00', NULL, '2021-08-03', NULL, '15.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1080, 226, 82, '100000.00', NULL, '2021-08-03', NULL, '15.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1081, 213, 77, '560000.00', NULL, '2021-08-03', NULL, '18.00', 2, 1, '2021-08-03', '2021-08-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1082, 224, 48, '100000.00', NULL, '2021-09-11', NULL, '15.00', 2, 1, '2021-09-13', '2021-09-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1083, 59, 99, '541409.23', NULL, '2020-11-07', NULL, '18.00', 2, 1, '2021-09-14', '2021-09-14', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1084, 49, 94, '431760.07', NULL, '2021-01-06', NULL, '18.00', 2, 1, '2021-09-14', '2021-09-14', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1085, 169, 96, '239574.40', NULL, '2021-02-19', NULL, '18.00', 2, 1, '2021-09-16', '2021-09-16', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1087, 236, 48, '200000.00', NULL, '2021-09-24', NULL, '15.00', 2, 1, '2021-09-28', '2021-09-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1088, 239, 53, '1000000.00', NULL, '2021-09-24', NULL, '18.00', 2, 1, '2021-09-28', '2021-09-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1089, 233, 54, '100000.00', NULL, '2021-09-24', NULL, '15.00', 2, 1, '2021-09-28', '2021-09-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1090, 231, 55, '500000.00', NULL, '2021-09-24', NULL, '18.00', 2, 1, '2021-09-28', '2021-09-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1091, 229, 78, '200000.00', NULL, '2021-09-24', NULL, '15.00', 2, 1, '2021-09-28', '2021-09-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1092, 0, 0, '0.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '0000-00-00', '2021-10-28', NULL, '0.00', '0.00', '0.00', '', '', 'undefined', 'undefined', 'undefined', NULL),
(1093, 0, 0, '0.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '0000-00-00', '2021-10-28', NULL, '0.00', '0.00', '0.00', '', '', 'undefined', 'undefined', 'undefined', NULL),
(1094, 0, 0, '0.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '0000-00-00', '2021-10-28', NULL, '0.00', '0.00', '0.00', '', '', 'undefined', 'undefined', 'undefined', NULL),
(1095, 0, 0, '0.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '0000-00-00', '2021-10-28', NULL, '0.00', '0.00', '0.00', '', '', 'undefined', 'undefined', 'undefined', NULL),
(1096, 1, 0, '0.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '0000-00-00', '2021-11-11', NULL, '0.00', '0.00', '0.00', '', '', 'cool.jpg', '', '', NULL),
(1097, 1, 0, '0.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '0000-00-00', '2021-11-11', NULL, '0.00', '0.00', '0.00', '', '', 'cool.jpg', 'cool.jpg', '', NULL),
(1098, 1, 0, '1.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '0000-00-00', '2021-11-11', NULL, '0.00', '0.00', '0.00', '', '', 'cool.jpg', '', '', NULL),
(1099, 1, 0, '2.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '2021-11-11', '2021-11-11', NULL, '0.00', '0.00', '0.00', '', '', 'cool.jpg', '', '', NULL),
(1100, 1, 0, '55.00', NULL, '0000-00-00', '0000-00-00', '0.00', NULL, 0, '2021-11-12', '2021-11-12', NULL, '0.00', '0.00', '0.00', '', '', 'undefined', 'undefined', 'undefined', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `investors`
--

CREATE TABLE `investors` (
  `investor_id` int(11) NOT NULL COMMENT 'TRIAL',
  `investor_acc_number` varchar(6) NOT NULL COMMENT 'TRIAL',
  `investor_name` varchar(100) NOT NULL COMMENT 'TRIAL',
  `investor_surname` varchar(100) NOT NULL COMMENT 'TRIAL',
  `investor_organisation` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_id_number` varchar(100) NOT NULL COMMENT 'TRIAL',
  `investor_email` varchar(100) NOT NULL COMMENT 'TRIAL',
  `investor_mobile` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_landline` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_physical_street` varchar(200) DEFAULT NULL COMMENT 'TRIAL',
  `investor_physical_suburb` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_physical_province` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_physical_country` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_physical_postal_code` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_postal_street_box` varchar(200) DEFAULT NULL COMMENT 'TRIAL',
  `investor_postal_suburb` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_postal_province` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_postal_country` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_postal_postal_code` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `investor_fica` tinyint(1) DEFAULT NULL COMMENT 'TRIAL',
  `investor_ficadate` date DEFAULT NULL COMMENT 'TRIAL',
  `investor_reference` varchar(100) DEFAULT NULL COMMENT 'TRIAL',
  `userid` int(11) DEFAULT NULL COMMENT 'TRIAL',
  `blocked` tinyint(1) NOT NULL COMMENT 'TRIAL',
  `datecreated` date NOT NULL COMMENT 'TRIAL',
  `lastupdated` date NOT NULL COMMENT 'TRIAL',
  `trial789` char(1) DEFAULT NULL COMMENT 'TRIAL',
  `investor_two_name` varchar(45) DEFAULT NULL,
  `investor_two_surname` varchar(45) DEFAULT NULL,
  `investor_two_id_number` varchar(45) DEFAULT NULL,
  `company_name` varchar(45) DEFAULT NULL,
  `ref_number` varchar(45) DEFAULT NULL,
  `company_rep_initals` varchar(45) DEFAULT NULL,
  `company_rep_surname` varchar(45) DEFAULT NULL,
  `company_rep_id_number` varchar(45) DEFAULT NULL,
  `contact_email` varchar(45) DEFAULT NULL,
  `contact_two_email` varchar(45) DEFAULT NULL,
  `mobile` varchar(45) DEFAULT NULL,
  `landline` varchar(45) DEFAULT NULL,
  `mobile_two` varchar(45) DEFAULT NULL,
  `landline_two` varchar(45) DEFAULT NULL,
  `street_no` varchar(50) DEFAULT NULL,
  `street_name` varchar(45) DEFAULT NULL,
  `address_suburb` varchar(45) DEFAULT NULL,
  `province` varchar(45) DEFAULT NULL,
  `address_postal_code` varchar(45) DEFAULT NULL,
  `box_no` varchar(45) DEFAULT NULL,
  `postal_suburb` varchar(45) DEFAULT NULL,
  `postal_code` varchar(45) DEFAULT NULL,
  `bank_name` varchar(45) DEFAULT NULL,
  `account_name` varchar(45) DEFAULT NULL,
  `branch_code` varchar(45) DEFAULT NULL,
  `account_no` varchar(45) DEFAULT NULL,
  `fica_date` varchar(50) DEFAULT NULL,
  `person_mode` varchar(45) DEFAULT NULL,
  `investorOneDisclaimerFile` varchar(455) DEFAULT NULL,
  `investorOneIDFile` varchar(455) DEFAULT NULL,
  `investorOnePOAFile` varchar(455) DEFAULT NULL,
  `investorTwoDisclaimerFile` varchar(455) DEFAULT NULL,
  `investorTwoIDFile` varchar(455) DEFAULT NULL,
  `investorTwoPOAFile` varchar(455) DEFAULT NULL,
  `representativeDisclaimerFile` varchar(455) DEFAULT NULL,
  `representativeIDFile` varchar(455) DEFAULT NULL,
  `representativePOAFile` varchar(455) DEFAULT NULL,
  `companyResolutionFile` varchar(455) DEFAULT NULL,
  `companyRefDocsFile` varchar(455) DEFAULT NULL,
  `companyPOAFile` varchar(455) DEFAULT NULL,
  `buyers` int(11) DEFAULT NULL,
  `linked_email` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='TRIAL';

--
-- Dumping data for table `investors`
--

INSERT INTO `investors` (`investor_id`, `investor_acc_number`, `investor_name`, `investor_surname`, `investor_organisation`, `investor_id_number`, `investor_email`, `investor_mobile`, `investor_landline`, `investor_physical_street`, `investor_physical_suburb`, `investor_physical_province`, `investor_physical_country`, `investor_physical_postal_code`, `investor_postal_street_box`, `investor_postal_suburb`, `investor_postal_province`, `investor_postal_country`, `investor_postal_postal_code`, `investor_fica`, `investor_ficadate`, `investor_reference`, `userid`, `blocked`, `datecreated`, `lastupdated`, `trial789`, `investor_two_name`, `investor_two_surname`, `investor_two_id_number`, `company_name`, `ref_number`, `company_rep_initals`, `company_rep_surname`, `company_rep_id_number`, `contact_email`, `contact_two_email`, `mobile`, `landline`, `mobile_two`, `landline_two`, `street_no`, `street_name`, `address_suburb`, `province`, `address_postal_code`, `box_no`, `postal_suburb`, `postal_code`, `bank_name`, `account_name`, `branch_code`, `account_no`, `fica_date`, `person_mode`, `investorOneDisclaimerFile`, `investorOneIDFile`, `investorOnePOAFile`, `investorTwoDisclaimerFile`, `investorTwoIDFile`, `investorTwoPOAFile`, `representativeDisclaimerFile`, `representativeIDFile`, `representativePOAFile`, `companyResolutionFile`, `companyRefDocsFile`, `companyPOAFile`, `buyers`, `linked_email`) VALUES
(1, 'ZBAL01', 'Bret', 'Baldwin', '', '7406215090087', 'brettbaldwin74@gmail.com', '083 561 0981', '', '68 Eastford Street', 'Welbedacht ', 'Western Cape ', 'South Africa', '6571', 'PO BOx 1453', 'Sedgefield', 'Western Cape ', 'South Africa ', '6572', 1, '2020-07-30', '', 1, 0, '2020-04-17', '2020-09-23', 'T', '', '', '7406215090087', '', 'undefined', '', '', '', 'brettbaldwin74@gmail.com', '', '083 561 0981', '', '', '', '', '68 Eastford Street', 'Welbedacht ', 'Western Cape ', '', 'PO BOx 1453', 'Sedgefield', '6572', 'aa', 'aa', '', 'undefined', '', 'person', 'wp2082317.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'null'),
(2, 'ZBEL01', 'undefined', '', '', '6909180254084', 'belfordhelen@gmail.com', '082 345 5548', '', '34 7th Avenue ', 'Fairways Wynberg', 'Western Cape', 'South Africa', '7800', '', '', '', '', '', 1, '2020-11-01', '', 2, 0, '2020-04-17', '2020-11-18', 'T', '', '', '', '', 'undefined', '', '', '', 'belfordhelen@gmail.com', '', '082 345 5548', '', '', '', '', '34 7th Avenue ', 'Fairways Wynberg', 'Western Cape', '', '', '', '', '', '', '', 'undefined', '', 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'null'),
(3, 'ZCHA01', 'Charok', 'Visser', 'Charle Electrical', '1992/033460/23', 'cee@charle.co.za', '083 255 9307', '', '26 Taures Street', 'Brackenfell', 'Western Cape', 'South Africa ', '7560', 'PO Box 298', 'Brackenfell', 'Western Cape', 'South Africa ', '7561', 1, NULL, '', 3, 0, '2020-04-17', '2020-06-30', 'T', 'null', 'null', 'null', 'null', 'undefined', 'null', 'null', 'null', 'cee@charle.co.za', 'null', '083 255 9307', '', '', '', 'null', '26 Taures Street', 'Brackenfell', 'Western Cape', NULL, 'PO Box 298', 'Brackenfell', '7561', 'null', 'null', 'null', 'undefined', 'null', 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'null'),
(4, 'ZCHR01', 'Greg', 'Christelis', '', '5604260047', 'gregchristelis@gmail.com', '264812508302', '+26461226956', '5 Auob Street ', 'Eros', 'Windhoek', 'Namibia', '9000', 'PO Box 21850', '', 'Windhoek', 'Namibia', '9000', 1, '2019-10-08', '', 4, 0, '2020-04-17', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(5, 'ZCOL01', 'Christine', 'Collins', '', '7303261009188', 'c.collins@magneticsouth.net', '0720307950', '', 'TH 30 - Thesen Islands', 'Knysna', 'Western Cape', 'South Africa', '6571', 'PO Box 1225', 'Knysna ', 'Western Cape', 'South Africa ', '6571', 1, '2019-08-30', '', 5, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(6, 'ZDAM01', 'Lisbeth', 'Damane', '', '6210150613080', 'ntsikidamane@gmail.com', '0729589923', '0732942693', '27 Block Road', 'Kenilworth', 'Western Cape', 'South Africa ', '7780', '27 Block Road', 'Kenilworth', 'Western Cape', 'South Africa', '7780', 1, '2019-09-30', '', 6, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(7, 'ZDAV01', 'Heather', 'Davis', NULL, '4308070081081', 'davies79@mweb.co.za', '0823484449', '021 788 1288', '4 Lincoln Road ', 'Lakeside', 'Western Cape ', 'South Africa ', '7945', 'PO Box 22547', 'Fishoek ', 'Western Cape ', 'South Africa ', '7974', NULL, NULL, NULL, 7, 0, '2020-04-17', '2020-04-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(8, 'ZEND01', 'Dave', 'Endersen', NULL, 'PT5329252', 'daveendersen@gmail.com', '0833265415', NULL, NULL, 'Newlands', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(9, 'ZFON01', 'Lorraine', 'Aveling-Fontain', '', '5603210105082', 'lorraineav@telkomsa.net', '082 444 6593', '031 702 8995', '21 Rockhaven Road', 'Pinetown', 'Kwazulu-Natal', 'South Africa', '3610', '21 Rockhaven Road', 'Pinetown', 'Kwazulu-Natal', 'South Africa', '3610', 1, '2020-09-15', '', 9, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(10, 'ZGFY01', 'Wynand ', 'Haywood', 'GFY Investments', '6501120179081', 'wynand@capeprojects.co.za', '0826586585', '021 919 9944', '72 - 76 Edward Street', 'Bellville', 'Western Cape ', 'South Africa ', '7535', 'PO Box 1807', 'Bellville', 'Western Cape', 'South Africa', '7530', 0, NULL, '', 10, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(11, 'ZGTS01', 'Timothy', 'West', 'GTST Investments', '2016/5165760/07', 'timwestctn@gmail.com', '0827690602', '', '34 Hillcrest Way', 'Constantia', 'Western Cape', 'South Africa', '7806', '', '', '', '', '', 0, NULL, '', 11, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(13, 'ZHAL01', 'Deanne', 'Halton', '', '6905240060081', 'deannelhalton@gmail.com', '0820715601', '0825577054', '64 Chesterfield Street ', 'Bryanstan ', 'Gauteng', 'South Africa ', '2021', 'PO Box 130192', 'Bryanston', 'Gauteng', 'South Africa', '2021', 1, '2019-10-30', '', 13, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(14, 'ZHAN01', 'James Faber', 'Hanekom', '', '6605025117086', 'james@swartland.co.za', '0824673711', '022 433 8030', '65 Marino Street', 'Malmesbury', 'Western Cape ', 'South Africa ', '7300', 'PO Box 216', 'Moorreesburg', 'Western Cape', 'South Africa ', '7310', 0, NULL, '', 14, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(15, 'ZHAN05', 'Jurie Hendrik Nicolaas', 'Hanekom', '', '6403255084089', 'jurie@swartland.co.za', '082 557 1772', '022 487 2417', '9 Percheron Street', 'Malmesbury', 'Western Cape', 'South Africa', '7300', 'PO Box 216', 'Moorreesburg', 'Western Cape', 'South Africa ', '7310', 0, NULL, '', 15, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(16, 'ZHEI01', 'Dieter Raimund', 'Heinze', '', '8104045090083', 'dieter@preem.co.za', '083 445 3335', '021 902 0114', '49 Dyke Street', 'Eeste River', 'Western Cape ', 'South Africa ', '7100', '49 Dyke Street', 'Eerste River', 'Western Cape ', 'South Africa', '7100', 1, '2020-09-18', '', 16, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(17, 'ZHUN01', 'Lance ', 'Hunter', NULL, '8411235062081', 'lance7h@gmail.com', '0723740431', '011 782 4176', '17 Leslie Avenue', 'Sandton', 'Gauteng', 'South Africa ', '2196', '17 Leslie Avenue', 'Sandtong', 'Gauteng', 'South Africa', '2196', NULL, NULL, NULL, 17, 0, '2020-04-17', '2020-04-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(18, 'ZHUT01', 'Tracey', 'Hutchings', NULL, '6103010092084', 'tracy@thebestblindcompany.co.za', '0834419030', '021 461 2122', '1 Constantia View, Fowes Road', 'Wynberg', 'Western Cape ', 'South Africa', '7800', 'PO Box 15179', 'Vlaeberg', 'Western Cape ', 'South Africa ', '8018', NULL, NULL, NULL, 18, 0, '2020-04-17', '2020-04-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(19, 'ZINT01', 'Marc ', 'Lunau', 'Intipunku Trust', 'IT4358/2006', 'marclunau@gmx.net', '0833115551', '021 671 1954', '13 Greenlawns Square', 'Claremont', 'Western Cape', 'South Africa', '7708', '13 Greenlawns Square', 'Claremong', 'Western Cape', 'South Africa', '7708', 0, NULL, '', 19, 0, '2020-04-17', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(20, 'ZJMS01', 'Wynand ', 'Haywood', 'Jou Ma se Company', '2012/099991/07', 'wynand@capeprojects.co.za', '0826586585', '021 919 9944', '72-76 Edward Street', 'Bellville', 'Western Cape ', 'South Africa', '7535', '', '', '', '', '', 0, NULL, '', 10, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(21, 'ZKIR01', 'Mabinang', 'Lebuso', '', '7806060502088', 'mabinangkiri@gmail.com', '0817677504', '', '3 Zola  Budd Street', 'Willows', 'Free State ', 'South Africa ', '9301', '3 Zola Budd Street', 'Willows ', 'Free State', 'South Africa', '9301', 1, '2020-07-09', '', 21, 0, '2020-04-17', '2020-07-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(22, 'ZKRI01', 'Christopher', 'Kriek', NULL, '9287185051085', 'kriekchris@gmail.com', '+447540059426', '', '57 Hothom Road', 'London', '', 'United Kingdom', '', '57 Hothom Road ', 'London', '', 'United Kingdom', '', NULL, NULL, NULL, 22, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(23, 'ZKRU01', 'Jurgen', 'Kruger', '', '6611305034082', 'jkrugersa@gmail.com', '0828081515', '', '5 Hennie Joubert Street ', 'Boksburg', 'Gauteng', 'South Africa ', '1470', 'PO Box 19176', 'Sunward Park, Boksburg', 'Gauteng ', 'South Africa', '1470', 1, '2020-07-30', '', 23, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(24, 'ZLAN01', 'Ian (Lanser Civils)', 'Lanser', NULL, '2013/017738/07', 'ian@lansercivils.co.za', '0835003018', '021 982 5248', '7 Rome Road', 'Brackenfell', 'Western Cape', 'South Africa ', '7560', 'PO Box 443', 'Table View', 'Western Cape ', 'South Africa ', '7439', NULL, NULL, NULL, 24, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(25, 'ZLAR01', 'Janine Gail', 'Larkin', '', '7308220147086', 'larkinfamilysa@gmail.com', '0839619117', '021 555 3311', '35A Bay Beach Ave', 'Sunset Links', 'Western Cape', 'South Africa', '7441', '', '', '', '', '', 0, NULL, '', 25, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(26, 'ZLEB01', 'Hopolang', 'Lebusa', '', '7711085351083', 'hopolang.csi@gmail.com', '0828054156', '0764302359', '4 Langeberg Avenue ', 'Rustenburg', 'North West', 'South Africa ', '2999', 'PO Box 1966', 'Waterfall ', 'North West ', 'South Africa ', '0323', 1, '2020-08-31', '', 26, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(27, 'ZLEW01', 'Martina', 'Lewis', NULL, '5607280041085', 'mclewis@gmail.com', '0833266812', '', '93 Fourth Aveneu', 'Edenvale', 'Gauteng', 'South Africa ', '1610', 'PO Box 3185', 'Edenvale ', 'Gauteng', 'South Africa ', '1610', NULL, NULL, NULL, 27, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(28, 'ZLUN01', 'Marc', 'Lunau', '', '6801166126180', 'marclunau@gmx.net2', '0833115551', '', '13 Greenlawns Square', 'Claremont', 'Western Cape ', 'South Africa ', '7708', '13 Greenlawns Square', 'Claremont', 'Western Cape ', 'South Africa ', '7708', 0, NULL, '', 19, 0, '2020-04-17', '2020-11-27', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(29, 'ZMAG01', 'Petro', 'Psomotragos', 'Magos Media', '2017/149827/07', 'petro@magos.co.za', '0825744800', '011 268 6273', '5 Fricker Road', 'Illovo', 'Gauteng ', 'Western Cape ', '2196', 'PO Box 588', 'Ruimsig ', 'Gauteng', 'South Africa ', '1735', 0, NULL, '', 29, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(30, 'ZMAS01', 'Dave', 'Masterton', NULL, '', 'davidotto108@gmail.com', '0678369210', '', '', 'JHB', '', '', '', '', '', '', '', '', NULL, NULL, NULL, 30, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(31, 'ZMAT01', 'Natalie', 'Matthews', NULL, '7903240066082', 'nataliegmatthews@gmail.com', '0741016046', '', '114 9th Street', 'Linden', 'Gauteng', 'South Africa ', '2195', '114 9th Street', 'Linden', 'Gauteng', 'South Africa', '2195', NULL, NULL, NULL, 31, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(32, 'ZMCD01', 'Veronica', 'McDonald', '', '6002240029082', 'mcdonaldveronica8@gmail.com', '0714231575', '', '52 Botha Street', 'Goodwood', 'Western Cape ', 'South Africa', '7460', '52 Botha Street', 'Goodwood', 'Western Cape', 'South Africa ', '7460', 1, '2020-09-15', '', 32, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(33, 'ZMCK01', 'Caitlin', 'McKenzie-Jones', NULL, '', 'caitlin.mackenziejones@gmail.com', '0822956000', '', 'S1 Ash Street', 'NorthCliff', 'Gauteng', 'South Africa ', '2195', 'S1 Ash Street', 'Northcliff', 'Gauteng', 'South Africa ', '2195', NULL, NULL, NULL, 33, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(34, 'ZMCN01', 'Richared', 'McNeil', NULL, '4005295117084', 'rick33@icon.co.za', '0825571391', '021 785 1045', '20 Northshore Drive ', 'Noordhoek', 'Western Cape ', 'South Africa ', '7975', '20 Northshore Drive ', 'Noordhoek', 'Western Cape', 'South Africa ', '7975', NULL, NULL, NULL, 34, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(35, 'ZMDE01', 'Bennet', 'Mdebuka', NULL, '5605175787085', 'ben.mdebuka2@gmail.com', '0794921815', '', '53 Caernarvon Street', 'Parklands ', 'Western Cape ', 'South Africa ', '7441', 'PO Box 20155', 'Big Bay', 'Western Cape', 'South Africa ', '7448', NULL, NULL, NULL, 35, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(36, 'ZMDE05', 'Loyiso', 'Mdebuka', NULL, '8502075829080', 'loyiso@blankkanvas.co.za', '0829641433', '', '5 Carnation Street', 'Khayelitsha', 'Western Cape', 'South Africa ', '7784', '5 Carnation Street ', 'Khayelitsha', 'Western Cape ', 'South Africa ', '7784', NULL, NULL, NULL, 36, 0, '2020-04-17', '2020-04-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(37, 'ZMEA01', 'Wynand ', 'Haywood ', '', '2001/027362/07', 'wynand@capeprojects.co.za', '0826586585', '', '72-76 Edward Str', 'Bellville', 'Western Cape', 'South Africa', '7535', '', '', '', '', '', 0, NULL, '', 10, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(38, 'ZMEY01', 'Kenneth', 'Meyer', '', '5602045179080', 'kenymeyer@gmail.com', '0825683105', '', '919 8th Avenue ', 'Wilderness', 'Western Cape ', 'South Africa ', '6560', 'PO Box 811', 'Wilderness ', 'Western Cape', 'South Africa', '6560', 0, NULL, '', 38, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(39, 'ZMOA01', 'Peter', 'Mulder', 'Moana Polu (Pty) Ltd', '2018/628884/07', 'petermul14@gmail.com ', '0837992406', '', '20 Swapo Road', 'Durban North ', 'KZN', 'South Africa', '4057', '', '', '', '', '', 0, NULL, '', 39, 0, '2020-04-17', '2020-11-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(40, 'ZMOO01', 'Joal & Vanessa', 'Moore & Van Rensburg', '', '5408255037087 / 6309230130089', 'vanessavanR23@gmail.com', '0844560923/0844560825', '021 987 1480', '22 Azalea Street', 'Gelvandale PE', 'KZN', 'South Africa ', '', '', '', '', '', '', 0, NULL, '', 40, 0, '2020-04-17', '2020-11-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(41, 'ZMYB01', 'Hermanus Carel', 'Myburgh', '', '8408155050088', 'herman.myburgh@gmail.com', '0828757482', '0124204540', '730 Norman Street', 'Montana Park, Pretoria', 'Tswane', 'South Africa', '0182', '', '', '', '', '', 0, NULL, '', 41, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(42, 'ZMYB05', 'Irene Stoffelene', 'Myburg', '', '5907030095088', 'irenemyburg10@gmail.com', '0648537955', '', '41 Bellevue Rd', 'Prestbury, Pietermaritzburg', 'KZN', 'South Africa ', '3201', '', '', '', '', '', 0, NULL, '', 42, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(43, 'ZNAT01', 'Thandekile Evelyn', 'Hlapolosa', 'Nathi Business Solutions', '2013/055660/07', 'hlapolosa.te@gmail.com', '0795024284', '', '1388 Terry Desouza Street', 'Oppenhim Park, Welkom ', 'Free State ', 'South Africa ', '9463', '', '', '', '', '', 1, '2020-08-30', '', 43, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(44, 'ZOPP01', 'Charles Nixon', 'Morgan', 'Opportunity Global Development Structering', '2010/022775/07', 'nick@opportunity.co.za', '0823075511', '021 9499944', '72 - 76 Edward Street', 'Bellville', 'Western Cape ', 'South Africa ', '7535', '', '', '', '', '', 0, NULL, '', 44, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(45, 'ZQUI01', 'Charles Nixon ', 'Morgan', 'Quinate Consulting (Pty) Ltd', '2005/025742/07', 'nick@opportunity.co.za2', '0823075511', '021 919 9944', '72 - 76 Edward Street', 'Bellville', 'Western Cape ', 'South Africa ', '7535', '', '', '', '', '', 0, NULL, '', 44, 0, '2020-04-17', '2020-12-02', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(46, 'ZRAB01', 'Rabbit Pants (Lourens) ', 'Haasbroek', 'Rabbit Pants Trust', '2013/164577/07', 'digitmediax@gmail.com2', '076 066 7579', '079 353 3287', '', 'Balitto', '', 'Darnal', '4480', 'PO Box 6893', 'Zimbali', '', '', '4418', 0, NULL, '', 46, 0, '2020-04-17', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(47, 'ZRAM01', 'Tshegofatso', 'Ramoshaba', '', '9412140600089', 'tshegofatso.enactus@gmail.com', '0783696564', '', '36C Burg Street', 'City Centre', 'Cape Town ', 'South Africa', '8001', '', '', '', '', '', 0, NULL, '', 47, 0, '2020-04-17', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(48, 'ZRAN01', 'R', 'Rankin', NULL, '9104285036084', 'ross.rankin91@gmail.com', '(+44)07553037346', NULL, NULL, 'Scotland', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 48, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(49, 'ZSCH01', 'Inga', 'Schubert', NULL, '6904270031088', 'instanttags@mweb.co.za', '0828529596', '', '33 Sunbird Close', 'Bloubergrise', 'Western Cape ', 'South Africa', '7441', '33 Sunbird Close ', 'Bloubergrise', 'Western Cape ', 'South Africa ', '7441', NULL, NULL, NULL, 49, 0, '2020-04-17', '2020-05-04', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(50, 'ZSON01', 'Charles ', 'Maduna', 'C-Sonke Trading', '2007/199991/23', 'charlesm@c-sonke.co.za', '0721413078', '051 4302330', '20 Aliwal Street', 'Bloemfontein', 'Free State', 'South Africa', '9300', 'PO Box 6839', 'Bloemfontein', 'Free State', 'South Africa', '9300', 1, '2020-07-01', '', 50, 0, '2020-04-17', '2020-07-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(51, 'ZSPA01', 'Anna Maria Johanna ', 'Sparrow', '', '6601250095089', 'annatie.sparrow@gmail.com', '0844081732', '0219764231', 'No 3 Suikerbosway', 'Durbanville', 'WC', 'SA', '7550', '', '', '', '', '', 1, '2020-10-01', '', 51, 0, '2020-04-17', '2020-10-21', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(52, 'ZSPE01', 'MS & P', 'Speelman', NULL, '59040555708083 / 6006160774080', 'samspeelmam8@gmail.com', '0732228542/0832550900', NULL, NULL, 'Bloemfontein', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 52, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(53, 'ZSUT01', 'M', 'Sutton', NULL, '7111050075082', 'msutton@iqbusiness.net', '0722079395', NULL, NULL, 'Sunninghill', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 53, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(54, 'ZSWA01', 'D & G', 'Swart', NULL, '8211125104088 / 8706210021089', 'deonswart12@gmail.com', '0749766403/0847105291', NULL, NULL, 'CT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 54, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(55, 'ZVDM01', 'P', 'vd Mescht', '', '6803090146086', 'paulavdmescht@gmail.com', '0829200821', '', '', 'Blouberg', '', '', '', '', '', '', '', '', 0, NULL, '', 55, 0, '2020-04-17', '2020-11-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(56, 'ZVED01', 'Craig', 'Vedders', '', '5711015043083', 'cvedders@gmail.com', '0832744301', '', '', 'CT', '', '', '', '', '', '', '', '', 0, NULL, '', 56, 0, '2020-04-17', '2020-12-02', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(57, 'ZVOR01', 'S', 'Vorster', NULL, '', 'debbie3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 57, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(58, 'ZVWY01', 'JJP', 'van Wyk', '', '6305075013083', 'hansievw123@gmail.com', '0742285660', '0119543369', '19 Hanekom', 'Krugersdorp', 'Gauteng', 'South Africa', '1739', 'PO Box 1536', 'Noordheuwel', 'Geuteng', 'South Africa', '1756', 1, '2020-11-05', '', 58, 0, '2020-04-17', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(59, 'ZWAT01', 'PG', 'Watts', NULL, '6307045025080', 'gregwatts2@gmail.com', '0825732203/+24300688892', NULL, '23 Hillside Rd', 'Fish Hoek', 'Western Cape', 'South Africa', NULL, '23 Hillside Rd', 'Fish Hoek', 'Western Cape', 'South Africa', NULL, NULL, NULL, NULL, 59, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(60, 'ZWED01', 'Hans', 'Wedermann', NULL, '5604095078089', 'wederman@mweb.co.za', '0832529941', '021 715 0842', '7 Barn Rd', 'Bergvliet', 'Western Cape', 'South Africa', '8000', 'PO Box 296', 'Constantia', 'Western Cape', 'South Africa', '7848', NULL, NULL, NULL, 60, 0, '2020-04-17', '2020-04-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(61, 'ZWED05', 'L', 'Wedermann', NULL, '5609090066088', 'lindawedermann@hotmail.com', '0832585800', NULL, NULL, 'CT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 61, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(62, 'ZWEL01', 'Chris', 'Welham', '', '6308085003086', 'chris.welham@outlook.com', '0832616925', '', '', 'Paarl', '', '', '', '', '', '', '', '', 0, NULL, '', 62, 0, '2020-04-17', '2020-12-02', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(63, 'ZZYL01', 'John ', 'Zylstra ', '', '6410175097083', 'john.zylstra@afpro.co.za', '0829006948', '0217942571', '42 Duckett Ave', 'Constantia', 'Western Cape', 'SA', '', '42 Duckett Ave', 'Constantia', 'Cape Town', 'South Africa ', '', 0, '2020-09-21', '', 63, 0, '2020-04-17', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(64, 'ZBOT01', 'Carina', 'Botha', '', '6006160107083', 'cari.botha16@gmail.com', '084 330 0863', '', '49 Riverview Drive', 'Waterfall ', 'Gauteng', 'South Africa ', '3610', 'PO Box 1663', 'Linkhills', 'Gauteng', 'South Africa ', '3652', 1, '2020-09-11', '', 64, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(65, 'ZMAR01', 'Beverley-Ann Kinsla', 'Martin', '', '5510150002080', 'bevmartin136@gmail.com', '0763822377', '', '10 Pinto Road', 'Table View', 'Western Cape', 'South Africa ', '7441', '', '', '', '', '', 0, NULL, '', 65, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(66, 'ZMCD02', 'Andre (Josias Andreas)', 'McDonald', '', '5406195096080', 'mcdonalda622@gmail.com', '0765333628', '', '52 Botha Street', 'Goodwood', 'Western Cape ', 'South Africa', '7460', '52 Botha Street', 'Goodwood', 'Western Cape', 'South Africa', '7460', 1, '2020-09-15', '', 66, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(67, 'ZATK01', 'Genevive', 'Atkinson', '', '', 'freefoxgen@gmail.com', '082 223 3024', '', '1 Woodside Drive', 'Pinelands', 'Western Cape', 'South Africa ', '7405', '1 Woodside Drive', 'Pinelands', 'Western Cape', 'South Africa', '7405', 0, NULL, '', 67, 0, '2020-04-17', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(68, 'ZKUS01', 'Rolf', 'Kuster', '', '4805125003085', 'kuster@intekom.co.za', '0844607301', '0317764089', '49 Riverview Drive', 'Crest Holme', 'KZN', 'South Africa', '3601', 'PO Box 1663', 'Linkhills', 'KZN', 'South Africa', '3652', 1, '2020-08-28', '', 68, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(69, 'ZMOR01', 'Justine', 'Morgan', NULL, '7702110094087', 'justinemorgan38@gmail.com', '0716495976', NULL, '1 Carlton Crescent', 'Parklands', 'Western Cape ', 'South Africa ', '7441', '1 Carlton Crescent', 'Parklands', 'Western Cape', 'South Africa', '7441', NULL, NULL, NULL, 69, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(70, 'ZSAN01', 'Micheal', 'Sandeman', NULL, '5906235127084', 'micheal.maclogs@gmail.com', '0832306706', NULL, '39 Sandol Crescent', 'Durbanville', 'Western Cape', 'South Africa', '7550', '39 Sandol Crescent', 'Durbanville', 'Western Cape', 'South Africa', '7550', NULL, NULL, NULL, 70, 0, '2020-04-17', '2020-04-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(71, 'ZVDW01', 'Phillip', 'van der Walt Trust', '', 'IT26/13', 'phillip890714@gmail.com', '+447563446550', '', '130 Warkworth Woods', 'Newcastle upon Tyne', '', 'United Kingdom', 'NE35RD', '130 Warkworth Woods', 'Newcastle upon Tyne', '', 'United Kingdom', 'NE35RD', 0, NULL, '', 71, 0, '2020-04-17', '2020-11-24', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(72, 'ZKUS02', 'Kerry', 'Kuster', '', '7501180137085', 'kerry_kuster@hotmail.com', '07453110863', '', '49 Riverview Drive', 'Crestholme', 'KZN', 'South Africa', '3610', 'PO Box 1663', 'Linkhills', 'KZN', 'South Africa', '3652', 1, '2020-03-26', '', 72, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(73, 'ZKUS03', 'Joanne', 'Kuster', '', '7109160180081', 'bugskuster@yahoo.com', '0846135457', '', '49 Riverview Drive', 'Crestholme', 'KZN', 'South Africa', '3610', 'PO Box 1663', 'Linkhills', 'KZN', 'South Africa', '3652', 1, '2020-03-26', '', 73, 0, '2020-04-17', '2020-09-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(80, 'ZVER01', 'Brendan & Octavia', 'Vermaak & Palmos', '', '7412120232087 & 7609205848083', 'brepalco@gmail.com', '0828793645', '', '171 Lake View', 'Muldersdrif', 'North West', 'South Africa', '1738', 'PO Box 202', 'Skeerpoort', 'North West', 'South Africa ', '0232', 0, NULL, '', 117, 0, '2020-04-17', '2020-12-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(81, 'ZALM01', 'Marc', 'Lunau', 'ALMA at Constantia Trust', 'IT576/2006 ', 'marclunau@gmx.net3', '0833115551', '021 6711954', '13 Greenlawns Square', 'Claremont', 'Western Cape', 'South Africa', '7708', '', '', '', '', '', 1, '2020-06-30', '', 19, 0, '2020-05-04', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(93, 'ZKRO02', 'Che', 'Kropp', '', '7608295855186', 'chekroppe@gmail.com', '0621907675', '', 'Anna Frank Laan 18', '', '', 'Netherlands', '1403HR', '', '', '', '', '', 1, '2020-05-14', '', 83, 0, '2020-05-14', '2020-07-01', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(95, 'ZDAL01', 'Ajmuddien ', 'Dalvie', '', '7402155181085', 'aju.dalvie@yahoo.com', '0797500647', '0216962464', '23 3rd Avenue', 'Rondebosch East', 'Western Cape', 'South Africa', '', '23 3rd Avenue', 'Rondebosch East', 'Cape Town', 'South Africa', '', 1, '2020-07-13', '', 85, 0, '2020-05-18', '2020-07-14', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(102, 'ZESP01', 'Etienne ', 'Espag', '', '7209275023083', 'etiennee40@gmail.com', '0731525684', '0731525684', '14 Hardekool Street', 'Brits', 'Northwest', 'South Africa', '0250', '14 Hardekool Street', 'Brits', 'Norhtwest', 'South Africa ', '0250', 1, '2020-07-08', '', 87, 0, '2020-07-10', '2020-07-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(106, 'ZHAR01', 'Terry Anne', 'Hart', '', '6505030142089', 'terryhsa@gmail.com', '0832545452', '', '11 York Street', 'Harfield Village Claremont ', 'Western Cape', 'South Africa ', '7708', '', '', '', '', '', 1, '2020-06-30', '', 89, 0, '2020-07-10', '2020-07-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(108, 'ZROD01', 'Vuyisile', 'Rodolo', '', '6504085566086', 'vuyirod@gmail.com', '0827796375', '', '57 1st Street', 'Krugersdorp', 'Northern Province', 'SA', '1739', 'PO Box 571', 'Rant-en-Dal', 'Northern Province', 'SA', '1751', 1, '2020-07-22', '', 90, 0, '2020-07-20', '2020-09-02', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(117, 'ZJER01', 'Towela Patricia Rosemary', 'Jere', '', 'MA834032', 'towelajere@yahoo.com', '0718641746', '0129930228', '298 Eleanor Street', 'Grasfontein', 'Pretoria', 'SA', '0081', '', '', '', '', '', 1, '2020-08-18', '', 91, 0, '2020-09-02', '2020-09-02', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(120, 'ZVER02', 'Jean-Jacques EP', 'Verhaeghe', 'J Verhaeghe & Associates', '7009295088086', 'jjverhaeghe@gmail.com', '0836451677', '0129910061', '490 Arkansas Street', 'Faerie Glen', 'Pretoria', 'SA', '0081', 'PO Box 38074', 'Faerie Glen', 'Pretoria', 'SA', '0081', 0, '2020-08-11', '', 92, 0, '2020-09-02', '2020-09-02', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(122, 'ZDAK01', 'Bulelwa ', 'Daku', '', '6411090624084', 'miyodk@gmail.com', '082 770 3454', '', '17 Silver Stoat, Midstreem Meadows Ext. 76', 'Olifantsfontein', 'Western Cape', 'South Africa', '', '', '', '', '', '', 1, '2020-08-24', '', 79, 0, '2020-09-23', '2020-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(125, 'ZROB01', 'John ', 'Zylstra', 'THE ROBYN TRUST', 'IT3294/95', 'john.zylstra@afpro.co.za', '082006948', '0217945271', '42 Duckitt Ave', 'Constantia', 'Western Cape', 'South Africa ', '', '', '', '', '', '', 1, '2020-09-28', '', 63, 0, '2020-10-19', '2020-10-19', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(126, 'ZBET01', 'Johan ', 'Vermeulen', 'Bettterlife Group Limited', '1992/000443/06', 'johan.vermeulen@betterlife.co.za', '0115165500', '082 576 4855', '', '', '', '', '', '', '', '', '', '', 0, NULL, '', 105, 0, '2020-10-19', '2020-11-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(127, 'ZSOU01', 'RK ', 'Sourgen', 'Big Buck Family Trust', 'IT2995/02', 'russells@econorisk.co.za', '0825730056', '', '69 Kessel Street', 'Fairland, Randburg', 'Gauteng', 'SA', '2194', '', '', '', '', '', 1, '2020-08-12', '', 98, 0, '2020-10-21', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(128, 'ZNGO01', 'Khula Moses', 'Ngomane', '', '8807155561057', 'mosesngomane24@gmail.com', '0835440315', '0738953266', '161 Isabel Estate, 14 Dexter Road', 'North Riding', 'Gauteng', 'SA', '2194', '117', 'River Crescent', 'Gauteng', 'SA', '1042', 1, '2020-08-12', '', 78, 0, '2020-10-21', '2020-12-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(129, 'ZPLA01', 'Aneta', 'Placzkowska', '', 'ED3190091', 'aplaczkowska@hotmail.co.uk', '0783220323', '', '7 Rhebok Str', 'Lime Acres', '', '', '8410', '', '', '', '', '', 1, '2020-09-14', '', 103, 0, '2020-10-22', '2020-10-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(130, 'ZBRO01', 'CRAIG ', 'BROWN', '', '6504265337183', 'zimbrowns@mweb.co.za', '0711432696', '0333471127', '52 Victoria Rd', 'PMB', 'KZN', 'SA', '3201', '', '', '', '', '', 1, '2020-08-18', '', 104, 0, '2020-11-12', '2020-11-12', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(131, 'ZPIE01', 'Jacques', 'Pienaar', '', '8105155063083', 'J4filmsound@gmail.com', '14243331918', '', '56 Knights Ridge Royal Ascot', 'Milnerton', 'Cape Town', 'South Africa', '7441', '20 Dulwich Cresent', 'Parklands North', 'Cape Town', 'South Africa', '7441', 0, NULL, '', 106, 0, '2020-11-18', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL);
INSERT INTO `investors` (`investor_id`, `investor_acc_number`, `investor_name`, `investor_surname`, `investor_organisation`, `investor_id_number`, `investor_email`, `investor_mobile`, `investor_landline`, `investor_physical_street`, `investor_physical_suburb`, `investor_physical_province`, `investor_physical_country`, `investor_physical_postal_code`, `investor_postal_street_box`, `investor_postal_suburb`, `investor_postal_province`, `investor_postal_country`, `investor_postal_postal_code`, `investor_fica`, `investor_ficadate`, `investor_reference`, `userid`, `blocked`, `datecreated`, `lastupdated`, `trial789`, `investor_two_name`, `investor_two_surname`, `investor_two_id_number`, `company_name`, `ref_number`, `company_rep_initals`, `company_rep_surname`, `company_rep_id_number`, `contact_email`, `contact_two_email`, `mobile`, `landline`, `mobile_two`, `landline_two`, `street_no`, `street_name`, `address_suburb`, `province`, `address_postal_code`, `box_no`, `postal_suburb`, `postal_code`, `bank_name`, `account_name`, `branch_code`, `account_no`, `fica_date`, `person_mode`, `investorOneDisclaimerFile`, `investorOneIDFile`, `investorOnePOAFile`, `investorTwoDisclaimerFile`, `investorTwoIDFile`, `investorTwoPOAFile`, `representativeDisclaimerFile`, `representativeIDFile`, `representativePOAFile`, `companyResolutionFile`, `companyRefDocsFile`, `companyPOAFile`, `buyers`, `linked_email`) VALUES
(132, 'ZJAN01', 'Petrus Johannes', 'Jansen van Rensburg', '', '5802205077088', 'pjansenvanrensburg713@gmail.com', '061 312 3482', '', '38 Sylvaner Street', 'Steynsrust', 'Somerset West', '', '', '', '', '', '', '', 0, NULL, '', 109, 0, '2020-11-18', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(133, 'ZJOH01', 'Lisa-Marie Natalie', 'Johns', '', '7303280069083', 'LmnJohns@gmail.com', '083 458 1795', '021 671 1954', '13 Greenlawns Square', 'Claremont', 'Cape Town', 'South Africa', '7708', '', '', '', '', '', 0, NULL, '', 19, 0, '2020-11-18', '2021-05-31', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(134, 'ZKOO01', 'Jayprakash Brijbukhandas', 'Koovarjee', '', '5808265094087', 'jay.koovarjee@gmail.com', '082 806 8445', '', '563 Mountbatten Drive', 'Reservoir Hills', 'Cape Town', 'South Africa', '4091', '', '', '', '', '', 1, '2020-11-12', '', 111, 0, '2020-11-18', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(135, 'ZVBL01', 'Glenda', 'van Blerk', '', '5306090019080', 'glenda@vanblerk.org', '082 415 3350', '', '10 High Riding Close ', 'Noordhoek', 'Western Cape', 'Cape Town', '7979', '', '', '', '', '', 1, '2020-11-09', '', 112, 0, '2020-11-18', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(136, 'ZDRE01', 'Ivor', 'Botha', 'Dreamcast Investments 74CC', '2001/060817/23 / 6608025176086', 'ivorbotha@icloud.com', '082 465 1626', '', '107 Market Street', 'Randburg', 'Pretoria', 'South Africa', '2194', '', '', '', '', '', 0, NULL, '', 113, 0, '2020-11-18', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(137, 'ZELE01', 'Emile Kenneth', 'Lew', '', '7601025025089', 'elew@webmail.co.za', '083 650 6673', '', '45 Bekker Street', 'Trichardt', 'Mpumalanga', 'South Africa', '2300', '', '', '', '', '', 1, '2020-09-14', '', 114, 0, '2020-11-18', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(138, 'ZHIL01', 'Trevor David', 'Hill', '', '6312175024085', 'trevhill@iafrica.com', '082 888 0882', '011 953 1171', '17 Tarentaal Street', 'Krugersdorp', 'Gauteng', 'South Africa', '1740', 'Po Box 819', 'Krugersdorp', 'Gauteng', 'South Africa', '1746', 0, NULL, '', 115, 0, '2020-11-18', '2020-11-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(139, 'ZCAM01', 'Jeremy', 'Campbell', '', '7110235013083', 'campbellroseline03@gmail.com', '076 908 8818', '079 328 5308', '28 Santo Alberto Street', 'Bluedowns', 'Western Cape ', 'Cape Town', '7100', '', '', '', '', '', 0, NULL, '', 116, 0, '2020-11-18', '2020-11-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(140, 'ZBOH01', 'Werner Hugo & Brenda', 'Bohme', '', '5511035075082', 'mb.s@absamail.co.za', '0829007308', '0832581975', 'Riebeek Street', 'Goodwood', 'WC', 'SA', '7460', '', '', '', '', '', 1, '2020-12-04', '', 122, 0, '2020-12-08', '2020-12-08', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(141, 'ZZYL03', ' Sandra Robyn', 'Zylstra', '', '6608160023085', 'sandra.zylstra@merck.com', '0823820934', '', '9 Gerard Road ', 'Lakeside', 'WC', 'SA', '7895', '', '', '', '', '', 0, NULL, '', 124, 0, '2020-12-08', '2021-04-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(142, 'ZBAR01', 'Stuart Christopher', 'Barr', '', '7405125255087', 'stu.barr@gmail.com', '0734784282', '', 'Ulusasa Private Game Reserve', 'Sasi Sand Private Game Reserve', 'Hazyview', '', '1242', 'PO Box ', 'Hazyview', '', '', '1242', 0, NULL, '', 125, 0, '2020-12-10', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(143, 'ZJBM01', 'Jacobus Bruwer', 'Morkel', '', '5208105082089', 'morkel.jb@gmail.com', '0742034486', '', '9 Riesling Str', 'Wellington', 'Western Cape ', 'Cape Town', '7655', 'PO Box 492', 'Wellington', '', '', '7654', 0, NULL, '', 126, 0, '2020-12-10', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(144, 'ZFEM01', 'Francina Elisabeth', 'Morkel', '', '5207210087082', 'francina.morkel@gmail.com', '0832706332', '0218733103', '9 Riesling Str', 'Wellington', 'Western Cape', 'Cape Town', '7655', 'PO Box 492', 'Wellington', '', '', '7654', 0, NULL, '', 129, 0, '2020-12-10', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(145, 'ZKFT01', 'Koovarjee Family Trust', 'Koovarjee', '', 'IT6598/1988', 'jay.koovarjee@gmail.com', '0828068445', '', '10 Samantha Gardens ', '563 Mountbatten Drive', 'Reservoir Hills', 'Cape Town', '4091', '', '', '', '', '', 0, NULL, '', 111, 0, '2020-12-10', '2020-12-10', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(147, 'ZSCH02', 'Zeldre', 'van Schalkwyk', '', '7504050031081', 'zeldrevs@gmail.com', '0825721459', '', '40 Ring Road ', 'Three Rivers', 'Vereeniging', 'Gauteng', '', '', '', '', '', '', 0, NULL, '', 133, 0, '2020-12-14', '2020-12-14', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(148, 'ZPJB01', 'Petrus Johannes ', 'Botha', '', '6501305071087', 'peet.hanneke.botha@gmail.com', '072 801 2984', '', 'Roket Crescent 57', 'Kuilsriver', 'Western Cape', 'Cape Town', '7580', 'PO Box 415', 'Soneike Kuilsriver', 'Western Cape', 'Cape Town', '7580', 0, NULL, '', 134, 0, '2021-01-08', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(149, 'ZMAD01', 'Esther', 'Maduna', '', '7908270317081', 'madunaester@gmail.com', '0766722983', '', '7991 Hospital View', 'Bo Hlo Kong', 'Bethlehem', '', '9700', 'PO Box 6839', '', 'Bloemfontein', '', '7300', 1, '2021-02-19', '', 135, 0, '2021-02-22', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(150, 'ZTHO01', 'Tamzin', 'Hoets', '', '7105020145082', 'tazmoneh@yahoo.co.uk', '0765346997', '', '17 Milton Road', 'Kirstenhof', 'Cape Town', '', '7945', '', '', '', '', '', 1, NULL, '', 136, 0, '2021-02-22', '2021-07-01', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(151, 'ZJHO01', 'Jean', 'Hoets', '', '4904070089080', 'jeanhoets@gmail.com', '0829515469', '', '17 Milton Road ', 'Kirstenhof', 'Cape Town', '', '7945', '', '', '', '', '', 1, NULL, '', 137, 0, '2021-02-22', '2021-07-01', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(153, 'ZLEW02', 'Leon', 'Lewis', '', '9104115123086', 'ljplewis@live.co.za', '0824179396', '', '22 Green Acers', 'Highveld', 'Esate Centurion', '', '0157', '', '', '', '', '', 1, NULL, '', 138, 0, '2021-02-22', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(154, 'ZHAM01', 'Lynnette Gladys', 'Hambidge', '', '5610160097086', 'lynnette.hambidge@gmail.com', '0829221080', '0210010742', '1001 Palme d\' Or, Oasis', 'Retirement Resort', 'Oasis Lane', 'Century City', '7441', '', '', '', '', '', 1, NULL, '', 139, 0, '2021-02-22', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(155, 'ZKRO01', 'Kroonprins Kafee CC', 'van der Merwe', '', '1996/007137/23', 'frans110500@gmail.com', '0613242374', '0235411137', '1 Adderley Street', 'Prince Albert', '', '', '6930', 'PO Box 230', 'Prince Albert', '', '', '6930', 1, NULL, '', 140, 0, '2021-02-22', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(156, 'ZPED01', 'Wendy', 'Pederson', '', '7705160023082', 'wendyadejager@gmail.com', '0847649040', '', '2 Laing Street', 'Paulshof', '', '', '2056', 'PO Box 283', 'Paulshof', '', '', '2056', 1, NULL, '', 141, 0, '2021-02-22', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(157, 'ZVZY01', 'Jacques Petrus', 'van Zyl', '', '4802045088080', '', '0762979434', '', '39 Nola Crescent', 'BonnieBrae', 'Kraaifontein', 'Western Cape', '', '', '', '', '', '', 1, '2021-03-17', '', NULL, 0, '2021-03-11', '2021-03-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(158, 'ZTPI01', 'Tabansi Property Investments', 'RE Matlala', '', '2016/191922/07', 'raisibe@me.com', '0838426165', '', '191 Retief Avenue', 'Centurion', 'Johannesburg', '', '0157', '', '', '', '', '', 0, NULL, '', 143, 0, '2021-03-11', '2021-03-26', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(159, 'ZASD01', 'Asdia Trust', 'S Bendall', '', 'IT699/2011', 'sbend@iafrica.com', '0823041367', '', '1 Tendele Road', 'Douglasdale', '', '', '2153', 'PO Box 1698', 'Fourways', '', '', '2055', 0, NULL, '', 144, 0, '2021-03-11', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(160, 'ZTSH01', 'Thandeka Patience', 'Tshabalala', '', '8610220740086', 'ttshabalala22@gmail.com', '0817207132', '0799977266', '1876 Senaoane', 'Amvoti Street', '', '', '1818', '', '', '', '', '', 0, NULL, '', 145, 0, '2021-03-11', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(162, 'ZHMA01', 'Harry', 'Mathope', '', '9401135195080', 'ohmathope@gmail.com', '0613154052', '', '43 Penny Street', 'Witpoortjie', 'Roodepoort', '', '1724', '', '', '', '', '', 0, NULL, '', NULL, 0, '2021-03-11', '2021-03-11', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(163, 'ZGMA01', 'Gerald Adriaan Odendal', 'Matthee', '', '6210265018084', 'geraldmatthee1@gmail.com', '0827849756', '', '7 Jansen Street', 'Parow', '', '', '7500', '', '', '', '', '', 0, NULL, '', 147, 0, '2021-03-11', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(164, 'ZSMI01', 'Eugene Patrick', 'Smit', '', '6701055011081', 'eugenepsmit@gmail.com', '0721485667', '', '4 Uitzicht Heights', 'Steenbok Street', 'Goedemoed', '', '7550', '', '', '', '', '', 0, NULL, '', 148, 0, '2021-03-11', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(165, 'ZLMA01', 'Luvo', 'Magwaza', '', '9007305728087', 'luvomagwaza@gmail.com', '0843507284', '', '35 Sangoma Street', 'Luzuko Park', 'Philippi Estate', '', '7750', '', '', '', '', '', 0, NULL, '', 149, 0, '2021-03-11', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(166, 'ZCRO01', 'Marc', 'Lunau', 'Crownhill Properties 271CC t/ha Houses4Rent', '200505741623', 'marc@houses4rent.co.za', '0833115551', '0216711954', '13 Greenlawns Square', 'Claremont', 'Western Cape', 'South Africa', '7708', '13 Greenlawns Square', 'Claremont ', 'Western Cape', 'South Africa', '7708', 1, '2021-03-11', '', 19, 0, '2021-03-18', '2021-03-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(167, 'ZLOU01', 'Ricardo Brandon', 'Louw', '', '8205285106081', 'ricardo@bjk.co.za', '0727069429', '', '16 Moorland Crescent', 'Dreyersdal, Tokai', 'WesternCapre', 'South Africa', '7945', '16 Moorland Crescent', 'Dreyersdal, Tokai', 'Western Cape ', 'South Africa', '7945', 1, '2021-03-16', '', 150, 0, '2021-03-18', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(168, 'ZVAN01', 'Gerhard Andre', 'van Rensburg', '', '6110285092087', 'gerhard@vicitude.co.za', '0824517727', '0878078934', '', '', '', '', '', '', '', '', '', '', 1, '2021-03-18', '', 151, 0, '2021-03-18', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(169, 'ZHEY01', 'Vincent Derick', 'Heynes', '', '6406115192083', 'heynesv25@gmail.com', '0849825960', '0446950047', '246 Charles Street', 'Die Heuwel, Groot Brak Rivier', 'Western Cape', 'South Africa', '6525', '', '', '', '', '', 1, '2021-03-17', '', 152, 0, '2021-03-18', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(170, 'ZDEB01', 'Willem Henry', 'De Beer', '', '54060855075087', 'debeerwillie00@gmail.com', '0836355957', '', 'Portion 19 of 443JT, Houboschhoek', 'Nelspruit ', 'Mpumalanga', 'South Africa', '1200', 'Private Bag x11326, Post Net Suite 209', 'Nelspruit', 'Mpumalanga', 'South Africa', '1200', 1, '2021-03-11', '', 153, 0, '2021-03-18', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(173, 'ZBET02', 'Dawie Izak ', 'Bester', '', '8704115090085', 'bester.dawie@gmail.com', '0823219063', '', '18 St Andrews Drive', 'van Riebeeckpark, Worcester', 'Western Cape', 'South Africa', '6850', '', '', '', '', '', 1, '2021-03-11', '', 154, 0, '2021-03-18', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(174, 'ZGLO01', 'Elizma', 'Goltz', 'SafeTech', '200901211123', 'info@safetechtraining.co.za', '0832996462', '', '15 Dana Street', 'Brackenfell', 'Western Cape', 'South Africa', '7560', 'PO Box 1305', 'Brackenfell', 'Western Cape ', 'South Africa', '7560', 1, '2021-03-04', '', 155, 0, '2021-03-18', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(175, 'ZBUR01', 'Barend Frederik', 'Burger', '', '6208015130084', 'bennieb@armscor.co.za', '0824162879', '0124282306', '21 Nenga Place', 'Moreletapark', 'Pretoria', '', '', 'PO Box 914 743', 'Pretoria', '', '', '', 0, NULL, '', 156, 0, '2021-03-19', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(176, 'ZRIB01', 'Paulo Sergip Da Silva', 'Ribeiro', '', '7807265080086', 'paulribeiro78@gmail.com', '0828017233', '', '', '', '', '', '', 'PO Box 2173', 'Bedfordview', '', '', '2008', 0, NULL, '', 157, 0, '2021-03-19', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(177, 'ZDEK01', 'Dawn Margaret', 'De Klerk', '', '6003190028082', 'dmw.way@gmail.com', '0724451430', '', '38 Burne Crescent', 'Glenashley', '', '', '4051', '', '', '', '', '', 0, NULL, '', 158, 0, '2021-03-19', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(179, 'ZBAR02', 'Nicolaas Jacobus', 'Barkhuysen', '', '7604075027088', 'jbarkhuysen@yahoo.com', '0845823579', '', '3 Eunice Road', 'Lorraine', 'Port Elizabeth', '', '6070', '', '', '', '', '', 1, '2021-03-30', '', 159, 0, '2021-03-19', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(180, 'ZZYL02', 'Petronella Johanna', 'Zylstra', '', '6903260172084', 'billie@inqwell.co.za', '0833023575', '', '42 Duckitt Avenue', 'Constantia', 'Cape Town', '', '', '', '', '', '', '', 0, NULL, '', 160, 0, '2021-03-19', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(181, 'ZTSO01', 'Abram Matlotleng', 'Tsoku', '', '8112235760084', 'matlotleng.tsk@gmail.com', '0828426565', '0677808228', 'Unit 10, 8 Morning View', 'Parklands', '', '', '7441', '', '', '', '', '', 0, NULL, '', 161, 0, '2021-03-19', '2021-03-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(182, 'ZTOL01', 'Christo', 'Tolken', '', '6809045009089', 'tolken.christo@gmail.com', '0824549032', '', 'Aanoewer Aftree Oord B3', 'Hibiskuslaan', 'Western Cape', 'SA', '', '', '', '', '', '', 1, '2021-03-25', '', 164, 0, '2021-03-31', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(183, 'ZDIC01', 'Grant Allan', 'Dickinson', 'Lutel Properties 1', '2002/018221/07', 'rant@dickinson.co.za', '0825562383', '', '35 Arcadia Rd', 'Freshnaye', 'Western Cape', 'South Africa', '8005', 'PO Box 52350', 'Sasxon World', '', 'South Africa', '2132', 1, '2021-03-31', '', 162, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(184, 'ZAFR01', 'John Robert', 'Zylstra', 'African Process Solutions (Pty) Ltd', '2003/013925/07', 'john.zylstra@afpro.co.za', '0829006948', '0216839431', 'D2 ClareView Business Park, 236 Imam Heron Road', 'Claremont', 'WC', 'SA', '7708', '', '', '', '', '', 1, '2021-03-24', '', 63, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(187, 'ZVAN02', 'Agatha Dorothea', 'van Schalkwyk', '', '6602160096084', 'agatha@awf.co.za', '0829039230', '0355620962', 'Lot H105 D540 Rd', 'False Bay', 'Hluhluwe', 'SA', '3960', 'PO Box 564', 'Hluhluwe', '', 'SA', '3960', 1, '2021-03-23', '', 163, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(188, 'ZHAA01', 'Maresia', 'Haasbroek', '', '7601170072084', 'maresia.haasbroek@gmail.com', '0843088288', '', '10 Clifton Crescent', 'Parklands', 'WC', 'SA', '7449', '', '', '', '', '', 1, '2021-03-31', '', 165, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(190, 'ZWAY01', 'Shirley Kathleen', 'Way', '', '5805170061086', 'msway@mweb.co.za', '0832894559', '', '5 Hydrangea Place', 'Glenhills', '', 'SA', '4051', '', '', '', '', '', 1, '2021-03-24', '', 166, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(191, 'ZMIN01', 'Irene Petronella', 'Minnaar', '', '5708280082085', 'irene@henrene.co.za', '0827725715', '', '33 Rustig Avenue', 'Van Riebeek Park, Kempton Park', 'Gauteng', 'SA', '', '', '', '', '', '', 1, '2021-03-23', '', 167, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(192, 'ZFOU01', 'Hester Magrietha', 'Fourie', '', '5010190051080', 'casperfourie0@gmail.com', '0834148106', '', '12 Birmenhead Street', 'Strand', 'WC', 'SA', '7140', '', '', '', '', '', 1, '2021-03-30', '', 168, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(193, 'ZVAL01', 'Manoj', 'Vallabh', '', '6703075199086', 'manvallabh@gmail.com', '0827898563', '0118549670', '4 Mandrill Street', 'Lenasia', 'Gauteng', 'SA', '1827', '', '', '', '', '', 1, '2021-03-31', '', 169, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(194, 'ZRUS01', 'Izak Cornelius', 'Rust', '', '7210105091084', 'koringplaas@foxwireless.co.za', '0823262226', '', 'Koringplaas', 'Moorreesburg', 'WC', 'SA', '7310', 'PO Box', 'Moorreesburg', 'WC', 'SA', '7310', 1, '2021-03-26', '', 170, 0, '2021-04-06', '2021-04-06', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(195, 'ZDAD01', 'Feroz', 'Dadoo', 'Closeprops 138 CC', '7302275301086', 'zoref@icloud.com', '0828530069', '0119042452', '54 Yellowwood Crescent', 'Aspen Hill', 'JHB', '', '2190', 'PO Box 15146', 'Eden Park', 'Alberton', '', '1455', 1, '2021-04-01', '', 172, 0, '2021-04-07', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(196, 'ZEDE01', 'JP', 'van Eden', '', '4404255020083', '', '0728391276', '', '7 Denne Street', 'Kuilsriver', '', '', '', '', '', '', '', '', 0, NULL, '', NULL, 0, '2021-04-07', '2021-04-07', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(197, 'ZWAL01', 'Benedict Josph', 'Walters', '', '5606095085089', 'benwalters0@gmail.com', '0844466814', '0215241011', '15 Welgemeend Street', 'Kleinbosch', 'Parow', '', '7500', '15 Welgemeend', 'Kleinbosch', 'Parow', '', '7500', 1, '2021-04-07', '', 173, 0, '2021-04-08', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(198, 'ZWED02', 'Candice', 'Wedermann', '', '9103270268082', 'candi_wedermann@hotmail.co.za', '0733342209', '0217150841', '7 Barn Road ', 'Bergvliet', 'Cape Town', '', '', 'PO Box 296', 'Constantia', '', '', '7848', 0, NULL, '', 84, 0, '2021-04-08', '2021-09-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(199, 'ZGIL01', 'Estelle Maria ', 'Gildenhuys', '', '6307110057083', 'estellepropnet@gmail.com', '0723418660', '', 'Renosterbos', 'Riebeekwes', '', '', '7306', '', '', '', '', '', 1, '2021-04-08', '', 171, 0, '2021-04-09', '2021-04-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(204, 'ZKRO03', 'Jacqueline', 'Krohn', '', '6909050153085', 'crown@polka.co.za', '0824713933', '', '4 Donna Street ', 'Morgenster Heights', 'Brackenfell', '', '', '', '', '', '', '', 0, NULL, '', 179, 0, '2021-05-13', '2021-05-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(205, 'ZGOV01', 'Preshnee', 'Govender', '', '8609140147083', 'govender.presh@gmail.com', '0787452856', '', '1 Teal Place', 'Lotus Park ', 'Isipingo', '', '4133', '', '', '', '', '', 0, NULL, '', 178, 0, '2021-05-13', '2021-05-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(206, 'ZJOR01', 'Glen Rutherford', 'Jordaan', '', '4805135068086', 'jordash@mweb.co.za', '0823390004', '', '2 Carnoustie Close', 'The Glades', 'Dainfern', '', '', 'PO Box 4778', 'Dainfern', '', '', '2055', 0, NULL, '', 177, 0, '2021-05-13', '2021-05-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(209, 'ZSCH03', 'Gary James', 'Schmidt', '', '6309275029089', 'bergcc@telkomsa.net', '0834098432', '', '18 Ridge Road Lot 144', 'Bergville', 'KZN', '', '3350', 'PO Box 21', 'Bergville', 'KZN', '', '3350', 1, '2021-05-07', '', 176, 0, '2021-05-13', '2021-05-14', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(210, 'ZBEN01', 'Heino', 'Beneke', '', '9404255046083', 'beneke09@gmail.com', '0826587661', '', '31 Assembly Rd', 'Bluff', 'KZN', 'SA', '4052', '', '', '', '', '', 1, '2021-04-21', '', 182, 0, '2021-05-13', '2021-05-14', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(211, 'ZBEN02', 'Veronica', 'Beneke', '', '6502100097087', 'info@acquilaguesthouse.co.za', '0828791502', '', '31 Assembly Road', 'Bluff', '', '', '4052', '', '', '', '', '', 0, NULL, '', 175, 0, '2021-05-13', '2021-05-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(212, 'ZERA01', 'Jacques ', 'Erasmus', 'Sumsare Family(PTY) LTD', '8004055055085', 'jacques.erasmus@hotmail.com', '0713828588', '', '38 Lily Road ', 'Alberton', '', '', '', '', '', '', '', '', 0, NULL, '', 174, 0, '2021-05-13', '2021-05-14', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(213, 'ZOLI01', 'Jan and Loraine', 'Olivier', '', '4605145106086 / 4808020096089', 'jaraine@skysat.co.za', '0829257768', '', '', '', '', '', '', 'PO Box 427', 'Heilbron', 'Hebron', '', '1681', 0, NULL, '', 181, 0, '2021-05-13', '2021-05-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(214, 'ZNIE01', 'Grant Richard', 'van Niekerk', '', '7006115144081', 'vanniekerk.grant@gmail.com', '0832356679', '', '17 Fountain Road', 'Bergvliet', '', '', '7800', '', '', '', '', '', 0, NULL, '', 180, 0, '2021-05-13', '2021-05-13', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(215, 'ZERA02', 'Chantal', 'Erasmus', '', '6912270104086', 'ccje27@gmail.com', '0815418349', '', '64 Olympus Drive ', 'Olive Hill 4, Pentagon Park', 'Freestate', 'SA', '9301', 'PO Box 6839', 'Bloemfontein', 'Freestate', 'SA', '9301', 1, '2021-05-25', '', 183, 0, '2021-05-27', '2021-05-27', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(218, 'ZVER03', 'Jacob ', 'Vermeulen', '', '4412165058085', 'jaapj.vermeulen@gmail.com', '0825585065', '0448270242', '625 Lake Rd', 'Wilderness', 'EC', 'SA', '6560', '', '', '', '', '', 1, '2021-05-25', '', 184, 0, '2021-05-27', '2021-05-27', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(219, 'ZBLO01', 'Robert Errol', 'Blows', '', '5808255140080', 'robertblows123@gmail.com', '0837666535', '0219058607', '15 Fern Street ', 'Rustdal', 'Kuilsriver', 'Cape Town ', '', '', '', '', '', '', 0, NULL, '', NULL, 0, '2021-05-28', '2021-05-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(221, 'ZCRO02', 'Gregory Murray', 'Crouse', '', '5006105107082', 'gregcrouse@webmail.co.za', '0810420458', '0126600943', '1054 Edwards Road ', 'Centurion', 'Gauteng', 'Cape Town', '0157', '', '', '', '', '', 1, '2021-06-02', '', 186, 0, '2021-06-10', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(223, 'ZLOU02', 'Leon', 'Louw', '', '5412135100081', 'finaleprop@gmail.com', '0837036612', '', '83 La Montagne', 'Somerset West', 'Western Cape', 'Cape Town', '7130', '', '', '', '', '', 1, '2021-06-09', '', 187, 0, '2021-06-10', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(224, 'ZGIL02', 'John Henry', 'Gildenhuis', '', '6903305062084', 'gildenjh@snatchprojects.co.za', '0828945749', '', '15 Marchapie 385 Kersboom', 'Magalieskruin', 'Gauteng', 'SA', '0182', '', '', '', '', '', 1, '2021-06-15', '', 188, 0, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(225, 'ZPRO01', 'ADRIAN ', 'DU TOIT', 'Prostart Properties 45 (Pty) Ltxd', '6209125137084', 'adriandtkta@global.co.za', '0832356884', '0116223287', '80 Langerman Drive', 'Kensington', 'Gauteng', 'SA', '2094', 'PO BOX 591312', 'KENGRAY', 'GAUTENG', 'SA', '2100', 1, '2021-06-15', '', 191, 0, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(226, 'ZMAT03', 'Delia', 'Matthee', '', '5901010138083', 'geraldmatthee1@gmail.com', '0846012252', '', '7 Jansen Street', 'Parow', 'WC', 'SA', '7500', '', '', '', '', '', 1, '2021-06-15', '', 147, 0, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(227, 'ZVOL01', 'Gideon', 'Volschenk', '', '5412055107082', 'deonvol@telkomsa.net', '0822247785', '0218545589', '75 Madison Square Steyn Str', 'Strand', 'WC', 'SA', '7140', '', '', '', '', '', 1, '2021-06-15', '', 192, 0, '2021-06-17', '2021-06-17', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(228, 'ZWES01', 'Gerhardus Jacobus', 'Wessels', '', '6708225012089', 'wessels.gerhard@yahoo.com', '0833877809', '', '49 Raven Street', 'Elspark, Germiston', 'WC', 'SA', '1428', '', '', '', '', '', 1, '2021-06-15', '', 193, 0, '2021-06-18', '2021-06-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(229, 'ZZEL01', 'Vaclav Merek', 'Svacha', 'ZELPY 1726 (Pty) Ltd', '2002/031172/07', 'mcmnursery@gmail.com', '0823884021', '', 'Penrose Farm, Richtershoek', 'Maleane', 'Mpumalanga', 'SA', '1320', 'PO Box 744', 'Maleane', 'Mpumalanga', 'SA', '1320', 1, '2021-06-17', '', 194, 0, '2021-06-18', '2021-06-18', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(230, 'ZDEM01', 'Gillies Nikian Anton', 'De Montille', '', '7905015253084', 'gilles.demontille@gmail.com', '0722819172', '', '6 Deerhurst Crescent', 'Hillcrest ', 'KZN', 'SA', '3610', 'PO BOX 1412', 'Umhlanga Rocks ', 'KZN', 'SA', '4319', 1, '2021-06-22', '', 195, 0, '2021-06-22', '2021-06-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(231, 'ZELO01', 'Gerhardus', 'Eloff', '', '5807265073083', 'gmmeloff@gmail.com', '260764036705', '', 'Farm 554 E', 'MASABUKA', '', 'ZAMBIA', '', 'PO BOX', 'Bryanston', '', 'SA', '2021', 1, '2021-06-22', '', 196, 0, '2021-06-22', '2021-06-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(232, 'ZJEN01', 'DARYL ANNE ', 'JENNINGS', '', '4706210072086', 'daryl3.jennings@gmail.com', '0724248585', '', '76 B 3rd Street', 'Linden', 'Gauteng', 'SA', '2195', '', '', '', '', '', 1, '2021-06-22', '', 197, 0, '2021-06-22', '2021-06-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(233, 'ZKEW01', 'LISA MAREE', 'KEWLEY', '', '7708090179087', 'lisakewley@nashuaisp.co.za', '0834494111', '', 'Lot K97', 'NO 15489, Kwambonambi', 'KZN', 'SA', '3915', 'PO BOX 337', 'HLUHLUWE', 'KZA', 'SA', '3960', 1, '2021-06-22', '', 198, 0, '2021-06-25', '2021-09-03', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(234, 'ZHAU01', 'JOSEPH HERMAN', 'HAUMANN', '', '7911185027084', 'joe.haumann@gmail.com', '0788244673', '', '402 Seaways', '31 Beach Rd, Moulle Point', 'WC', 'SA', '8005', '', '', '', '', '', 1, '2021-06-23', '', 199, 0, '2021-06-25', '2021-06-25', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(235, 'ZWIL01', 'GAIL', 'WILSON', '', '5202030089087', 'gailwilson@mweb.co.za', '083635559', '', '9 African Street', 'Oaklands, JHB', 'Gauteng', 'SA', '2192', '', '', '', '', '', 1, '2021-06-28', '', 200, 0, '2021-06-28', '2021-06-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(236, 'ZSTO01', 'NICOLAAS ', 'STOLS', '', '7210045011085', 'nstols99@gmail.com', '0842809482', '', '35 Cupious Crescent', 'Grasfontain, Pretoria', 'Gauteng', 'SA', '0042', 'Postnet Suite 424', 'Menlo Park, Pretoria', 'Gauteng', 'SA', '0102', 1, '2021-06-29', '', 201, 0, '2021-06-29', '2021-06-29', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(237, 'ZNAG01', 'ALAN MARTIN', 'NAGEL', '', '5604125052088', 'nagel.ren@gmail.com', '0824667065', '', '36 Kingklip Crescent', 'Harbour Lights, St Helena Bay', 'WC', 'SA', '7390', '7 Blacktail Crescent,', 'Harbour Lights, St Helenabay', 'WC', 'SA', '7390', 1, '2021-06-29', '', 202, 0, '2021-06-29', '2021-06-29', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(239, 'ZKRI02', 'Hermanus Johannes', 'Kriel', '', '5310035088085', 'krielhj@yahoo.com', '0845880855', '', 'Plot GX3', 'Hartswater', 'Northern Cape', 'SA', '8570', 'PO BOx 505', 'Hartswater', 'Northern Cape', 'SA', '8570', 1, '2021-06-30', '', 203, 0, '2021-06-30', '2021-06-30', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(240, 'ZKRI03', 'HELENA JACOBA', 'KRIEL', '', '5909110027080', 'he.kriel@outlook.com', '0826600518', '', 'Flat 7, Olivier Street', 'Schwizer-Reneke', 'North West ', 'SA', '2780', '', '', '', '', '', 1, '2021-07-20', '', 204, 0, '2021-07-21', '2021-07-21', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(241, 'ZVIS01', 'ERNA', 'VISSER', '', '5707120009084', 'ernavisser7@gmail.com', '0691879441', '', 'Boontjiesrivier', 'Wolseley', 'WC', 'SA', '6830', 'Posbus 169', 'Wolseley', 'WC', 'ZA', '6830', 1, '2021-07-19', '', 205, 0, '2021-07-21', '2021-07-21', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(242, 'ZDEC01', 'HENDRIK', 'DE CLERK', '', '7510135085083', 'hennie101@icloud.com', '0812707610', '', 'Staff House 2, Farm Erfdell, JU21', 'Kiepersol', 'Mpumalanga', 'SA', '1242', 'PO BOX 1242', 'Hazyview', 'Mpumalanga', 'SA', '1242', 1, '2021-07-12', '', 208, 0, '2021-07-22', '2021-07-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(243, 'ZSLE01', 'SYBRAND JOHAN ', 'SLEIGH', '', '4109175017081', 'johansleigh@hotmail.com', '0721112897', '0219813751', 'Debora Close 4', 'Protea Heights, Brackenfell', 'WC', 'SA', '7560', '', '', '', '', '', 1, NULL, '', 207, 0, '2021-07-22', '2021-07-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(244, 'ZSCO01', 'CARYN', 'SCOTT', '', '5605110102085', 'carynscott@afrihost.com', '0836455945', '', '6 Colinton Rd', 'Newlands', 'WC', 'SA', '7700', '', '', '', '', '', 1, '2021-07-20', '', 206, 0, '2021-07-22', '2021-07-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL);
INSERT INTO `investors` (`investor_id`, `investor_acc_number`, `investor_name`, `investor_surname`, `investor_organisation`, `investor_id_number`, `investor_email`, `investor_mobile`, `investor_landline`, `investor_physical_street`, `investor_physical_suburb`, `investor_physical_province`, `investor_physical_country`, `investor_physical_postal_code`, `investor_postal_street_box`, `investor_postal_suburb`, `investor_postal_province`, `investor_postal_country`, `investor_postal_postal_code`, `investor_fica`, `investor_ficadate`, `investor_reference`, `userid`, `blocked`, `datecreated`, `lastupdated`, `trial789`, `investor_two_name`, `investor_two_surname`, `investor_two_id_number`, `company_name`, `ref_number`, `company_rep_initals`, `company_rep_surname`, `company_rep_id_number`, `contact_email`, `contact_two_email`, `mobile`, `landline`, `mobile_two`, `landline_two`, `street_no`, `street_name`, `address_suburb`, `province`, `address_postal_code`, `box_no`, `postal_suburb`, `postal_code`, `bank_name`, `account_name`, `branch_code`, `account_no`, `fica_date`, `person_mode`, `investorOneDisclaimerFile`, `investorOneIDFile`, `investorOnePOAFile`, `investorTwoDisclaimerFile`, `investorTwoIDFile`, `investorTwoPOAFile`, `representativeDisclaimerFile`, `representativeIDFile`, `representativePOAFile`, `companyResolutionFile`, `companyRefDocsFile`, `companyPOAFile`, `buyers`, `linked_email`) VALUES
(245, 'ZRAB02', 'ROISIN NATALIE', 'RABE', '', '7501160058087', 'roshmcd@hotmail.com', '0781634862', '', '821 Patrick Avenue, Nature\'s Place', 'Faerie Glen', 'Gauteng', 'SA', '0043', '2259', 'Wingate Park', 'Gauteng', 'SA', '0153', 1, '2021-07-20', '', 209, 0, '2021-07-22', '2021-07-22', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(246, 'ZCUP01', 'TYRONE MARGARET', 'CUPIDO', '', '5806035147086 / 6510020528081', 'tyronecupido59@gmail.com', '0794394052 ', '', '11 Manitoba Close', 'Portlands', 'WC', 'SA', '7785', '', '', '', '', '', 1, '2021-07-28', '', 210, 0, '2021-07-28', '2021-07-28', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(247, 'ZNEE01', 'CHRISTIAAN TROSKIE', 'NEETHLING', '', '5704155023080', 'troskie.neethling@timequantum.co.za', '0825586190', '0213452391', '695 Platinum Street', 'Elardus Park', 'Gauteng', 'SA', '0181', 'PO BOX 4300', 'RIETVLEIRAND', 'GAUTENG', 'SA', '0174', 1, '2021-07-29', '', 211, 0, '2021-08-05', '2021-08-05', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(248, 'ZSMI02', 'SOPHIA CATHARINA', 'SMIT', '', '6109050017089', 'catrismit@gmail.com', '0760169700', '', '184 Kommetjie rd', 'FISH HOEK', 'WC', 'SA', '7975', '', '', '', '', '', 1, '2021-08-07', '', 213, 0, '2021-08-19', '2021-08-19', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(249, 'ZDEH01', 'CHARL', 'OBERHOLZER', 'DE AFRIKANDER HANDELSHUIS', '4610279871', 'handelshuis@afrikaner.com', '0849031111', '', 'Eeufees Rd', 'Groenkloof', 'Gauteng', 'SA', '', '', '', '', '', '', 1, '2021-08-16', '', 214, 0, '2021-08-19', '2021-08-19', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(251, 'ZMOO02', 'CHREESON LOGANATHAN', 'MOODLEY', '', '6207015148088', 'chreeson@gotec.co.za', '0836305043', '', '100 Morgkram Ave', 'KINGSBURY', 'KZN', 'SA', '4145', '', '', '', '', '', 1, '2021-08-12', '', 215, 0, '2021-08-19', '2021-08-19', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(252, 'ZSOU02', 'Frances Leathem', 'Sourgen', '', '5610170133186', 'sourgenf@gmail.com', '0827737576', '', 'no 3 Kessellea', '69 Kessel Street', 'Fairland', '', '2170', '', '', '', '', '', 1, '2021-09-03', '', 218, 0, '2021-09-08', '2021-09-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(253, 'ZNIE02', 'Linda Kathleen', 'van Niekerk', '', '5712150088081', 'linda@klr.co.za', '0829031438', '', '2 Willingdon Avenue Kloof', '', 'Cape Town ', 'KZN', '3610', '', '', '', '', '', 1, '2021-08-31', '', 219, 0, '2021-09-08', '2021-09-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(254, 'ZSIV01', 'Gareth William', 'Bedell-Sivright', '', '8108205072088', 'gareth@glengarry.co.za', '0827833445', '0824682670', '1 Highmoor Road', 'Glengarry Park, Mooi River', 'Western Cape', 'Cape Town', '3300', 'PO Box 39', 'Rosetta', '', '', '3301', 1, '2021-08-20', '', 220, 0, '2021-09-08', '2021-09-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(255, 'ZSCA01', 'Kert', 'Scalzini', '', '7212315243083', 'kert@opportunity.co.za', '0824499066', '', '72 Porterfield Road', 'Blouberg Rise', 'Western Cape ', 'Cape Town', '7441', '', '', '', '', '', 1, '2021-08-24', '', 216, 0, '2021-09-08', '2021-09-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(256, 'ZSCA02', 'Chad', 'Scalzini', '', '8306235299081', 'cscalzini@gmail.com', '0835381433', '', '10 Justice Walk', 'Zonnebloem', 'Western Cape ', 'Cape Town', '7925', '', '', '', '', '', 1, '2021-08-24', '', 217, 0, '2021-09-08', '2021-09-09', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(257, 'ZRIT01', 'Dennis', 'Ritter', '', '6804035154086', 'dennisjritter@gmail.com', '0833279997', '', '36 Mala - Mala Crescent', 'Clara Anna Fontein Estate', 'Durbanville', 'Cape Town ', '7550', '', '', '', '', '', 1, '2021-09-13', '', 222, 0, '2021-09-15', '2021-09-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(259, 'ZMYB02', 'Willem Johannes', 'Myburgh', '', '6807125017089', 'wmyburgh12@gmail.com', '0824527045', '', '41 Topaz Avenue', 'Kloofendal', '', '', '1724', '', '', '', '', '', 1, '2021-09-09', '', 223, 0, '2021-09-15', '2021-09-15', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(260, 'ZREN01', 'Marlene Ann', 'van Rensburg', '', '6307180141080', 'remm@mweb.co.za', '0748906638', '', '8 Notting Hill, Claire Crescent', 'Ben Kamma', 'Port Elizabeth', 'Cape Town', '6025', '8 Notting Hill, Claire Crescent', 'Ben Kamma', 'Port Elizabeth', 'Cape Town', '6025', 1, '2021-09-15', '', 224, 0, '2021-09-23', '2021-09-23', 'T', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'person', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(261, '', '', '', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, NULL),
(262, 'Test', '', '', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, NULL),
(266, 'ZMCL01', 'Connor', 'McLean', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(269, 'ZMLO01', 'C', 'MLoi', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(272, 'ZCCC01', 'ccccccc', 'cccccc', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(279, 'ZMCL', 'c', 'mclkk', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(280, 'ZMCL0', 'c', 'mclk', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(284, 'ZRAM00', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', '6b6ae55c383c7329a320465fab3b3cd8.jpeg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(285, 'ZRAM02', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'a58142ff4746324a69a493f54fe44dff.jpeg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(286, 'ZRAM03', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', '853fe6707e6abcd0139c6694c219ba34.jpeg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(287, 'ZRAM04', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'a074341638f0ba3303e9040706277c45.jpeg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(288, 'ZRAM05', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', '0fc0cefbec898a5e5678ef2efa7223fb.jpeg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(289, 'ZRAM06', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'f53d3af3531907463ef8360892b548df.jpeg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(290, 'ZRAM07', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', '1ff61aecbc8cbb00ba367cc2f36fec39', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(291, 'ZRAM08', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', '356b0a615b2fd9f415668ddaa0523ba8', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(292, 'ZRAM09', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', '4ed8ecd2e9f645a726047fccdcdff3bb', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(293, 'ZRAM10', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', '172675b4c2b3bcea62ac0cd704476543', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(294, 'ZRAM11', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'cool.jpg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(295, 'ZRAM12', 'C', 'Ramsey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'cool.jpg', 'cool.jpg', '', '', '', '', '', '', '', '', '', '', 1, ''),
(296, 'ZTES00', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'wp2082317.jpg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(298, 'ZTES02', 'Craig', 'Test2', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(300, 'ZTES03', 'Craig', 'Test2', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(302, 'ZTES04', 'Craig', 'Test2', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(304, 'ZTES05', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(306, 'ZTES06', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(309, 'ZTES07', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(311, 'ZTES08', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(314, 'ZTES09', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(316, 'ZTES10', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(318, 'ZTES11', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(320, 'ZTES12', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(322, 'ZTES13', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(323, 'ZTES[o', 'Craig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(336, 'Z[obje', '', '', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(342, 'ZTES16', 'Creig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(344, 'ZTES17', 'Creig', 'Test', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(345, 'ZTEZ17', 'Creig', 'Tez', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(346, 'ZTEZ02', 'Creig', 'Tez', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(348, 'ZTEZ18', 'Creig', 'Tez', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(349, 'ZTEZ04', 'Creig', 'Tez', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(350, 'ZTEY05', 'Creig', 'Tey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(351, 'ZTEY02', 'Creig', 'Tey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(352, 'ZTEY03', 'Creig', 'Tey', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(353, 'ZDEM04', 'Creig', 'Dem', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(354, 'ZDEM02', 'Creig', 'Dem', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(355, 'ZZES00', 'Craig', 'Zes', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'wp2082317.jpg', 'cool.jpg', '', '', '', '', '', '', '', '', '', '', 1, ''),
(356, 'ZZEZ00', 'Connor', 'Zez', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'cool.jpg', '', '', '', '', '', '', '', '', '', '', '', 1, ''),
(357, 'ZSHO03', 'Craig', 'ShowCodeAdding1forSameSurname', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(358, 'ZSHO02', 'Craig', 'ShowCodeAdding1forSameSurname', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(360, 'ZSHO04', 'Craig', 'ShowCodeAdding1forSameSurname', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(362, 'ZSHO05', 'Craig', 'ShowCodeAdding1forSameSurname', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(364, 'Z249', '', '', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(365, 'ZLEM02', 'Connor', 'Lem', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 1, ''),
(366, 'ZSES02', 'Craig', 'Ses', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0000-00-00', '0000-00-00', NULL, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'person', 'XBs38dw.png', 'g55hez6.png', '', '', '', '', '', '', '', '', '', '', 1, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `investments`
--
ALTER TABLE `investments`
  ADD PRIMARY KEY (`investment_id`);

--
-- Indexes for table `investors`
--
ALTER TABLE `investors`
  ADD PRIMARY KEY (`investor_id`),
  ADD UNIQUE KEY `ix_investor_acc_number` (`investor_acc_number`),
  ADD KEY `fk_investors_users` (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `investments`
--
ALTER TABLE `investments`
  MODIFY `investment_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'TRIAL', AUTO_INCREMENT=1101;

--
-- AUTO_INCREMENT for table `investors`
--
ALTER TABLE `investors`
  MODIFY `investor_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'TRIAL', AUTO_INCREMENT=367;
**********************


    insert into salesData (unit,beds,bath,base_price,contract_price,sold,development) values
(160,0,0,0,0,false,2);

    insert into salesData (unit,beds,bath,base_price,contract_price,sold,development) values
(159,0,0,0,0,false,1);

&*&*&*&*&*&*&*&*&*

alter table qcquestionnaireDone add column finalised boolean default false;
alter table qcquestionnaireDone add column finalisedBy varchar(100);




     


