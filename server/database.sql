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
